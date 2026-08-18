import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { scoreMatches } from '../utils/match';
import { ItemCard } from '../components/ItemCard';
import { ShareTicketModal } from '../components/ShareTicketModal';
import ClaimModal from '../components/ClaimModal';
import '../styles/ItemDetail.css';

export default function ItemDetail({ itemId, onBack, onItemSelect }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchItem = async () => {
      if (!itemId) return;
      try {
        setLoading(true);
        setError(null);

        const { data, error: itemError } = await supabase
          .from('items')
          .select('*')
          .eq('id', itemId)
          .single();

        if (itemError) throw itemError;
        if (!isMounted) return;
        setItem(data);

        // Fetch possible matches (non-blocking)
        try {
          const oppositeType = data.type === 'lost' ? 'found' : 'lost';
          const { data: candidates } = await supabase
            .from('items')
            .select('*')
            .eq('type', oppositeType)
            .eq('status', 'open');

          if (isMounted && candidates) {
            setMatches(scoreMatches(data, candidates, 5));
          }
        } catch (matchErr) {
          console.log('Match fetch notice (non-fatal):', matchErr.message);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load item details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [itemId]);

  const handleResolve = async () => {
    try {
      setResolving(true);
      setResolveError(null);
      const { error } = await supabase
        .from('items')
        .update({ status: 'resolved' })
        .eq('id', itemId);

      if (error) throw error;
      setItem((prev) => ({ ...prev, status: 'resolved' }));
    } catch (err) {
      setResolveError(err.message);
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <div className="item-detail-container">
        <button onClick={onBack} className="back-btn">← Back to listings</button>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail-container">
        <button onClick={onBack} className="back-btn">← Back to listings</button>
        <div className="error-message">
          <h2>Item Not Found</h2>
          <p>{error || 'The item you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === item.user_id;
  const formattedDate = new Date(item.date_lost).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemTypeLabel = item.type === 'lost' ? 'Lost Item' : 'Found Item';
  const statusLabel = item.status === 'open' ? 'Open' : 'Resolved';

  return (
    <div className="item-detail-container">
      <button onClick={onBack} className="back-btn">← Back to listings</button>

      <div className="item-detail">
        <div className="detail-main">
          {item.image_url && (
            <div className="detail-image">
              <img src={item.image_url} alt={item.title} />
            </div>
          )}

          <div className="detail-info">
            <div className="detail-header">
              <h1>{item.title}</h1>
              <div className="detail-badges">
                <span className={`type-badge ${item.type}`}>{itemTypeLabel}</span>
                <span className={`status-badge ${item.status}`}>{statusLabel}</span>
              </div>
            </div>

            {item.description && (
              <div className="detail-section">
                <h3>Description</h3>
                <p>{item.description}</p>
              </div>
            )}

            <div className="detail-section">
              <h3>Item Details</h3>
              <div className="detail-grid">
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="value category-badge">{item.category}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">{item.location}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Contact &amp; Claim Action</h3>
              <p className="contact-info">{item.contact}</p>

              <div className="action-buttons-group" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {item.type === 'found' && item.status === 'open' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowClaimModal(true)}
                  >
                    Claim &amp; Verify Ownership
                  </button>
                )}

                <button
                  className="share-pass-btn"
                  onClick={() => setShowShareModal(true)}
                >
                  Generate Share Flyer / WhatsApp Pass
                </button>
              </div>
            </div>

            {isOwner && item.status === 'open' && (
              <div className="owner-actions">
                {resolveError && (
                  <p className="resolve-error">{resolveError}</p>
                )}
                <button
                  className="resolve-btn"
                  onClick={handleResolve}
                  disabled={resolving}
                >
                  {resolving ? 'Marking as Resolved...' : 'Mark as Resolved'}
                </button>
              </div>
            )}

            {item.status === 'resolved' && (
              <div className="resolved-banner">
                This item has been resolved.
              </div>
            )}
          </div>
        </div>

        {matches.length > 0 && (
          <div className="detail-matches">
            <h2>
              Possible Matches
              {item.type === 'lost' ? ' (Found Items)' : ' (Lost Items)'}
            </h2>
            <p className="matches-intro">
              These items might be related based on category and keywords.
            </p>
            <div className="matches-grid">
              {matches.map((match) => (
                <ItemCard
                  key={match.id}
                  item={match}
                  onClick={() => onItemSelect && onItemSelect(match)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showShareModal && (
        <ShareTicketModal item={item} onClose={() => setShowShareModal(false)} />
      )}

      {showClaimModal && (
        <ClaimModal item={item} onClose={() => setShowClaimModal(false)} />
      )}
    </div>
  );
}
