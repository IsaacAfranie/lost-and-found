import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useItems } from '../hooks/useItems';
import { scoreMatches } from '../utils/match';
import { ItemCard } from '../components/ItemCard';
import '../styles/ItemDetail.css';

export default function ItemDetail({ itemId, onBack }) {
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('id', itemId)
          .single();

        if (error) throw error;
        setItem(data);

        // Fetch opposite type items for matching
        if (data.type === 'lost') {
          const { data: foundItems, error: matchError } = await supabase
            .from('items')
            .select('*')
            .eq('type', 'found')
            .eq('status', 'open');

          if (!matchError && foundItems) {
            const topMatches = scoreMatches(data, foundItems, 5);
            setMatches(topMatches);
          }
        } else {
          const { data: lostItems, error: matchError } = await supabase
            .from('items')
            .select('*')
            .eq('type', 'lost')
            .eq('status', 'open');

          if (!matchError && lostItems) {
            const topMatches = scoreMatches(data, lostItems, 5);
            setMatches(topMatches);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  const handleResolve = async () => {
    try {
      setResolving(true);
      const { error } = await supabase
        .from('items')
        .update({ status: 'resolved' })
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      setItem({ ...item, status: 'resolved' });
      alert('Item marked as resolved!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <div className="item-detail-container">
        <button onClick={onBack} className="back-btn">← Back</button>
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
        <button onClick={onBack} className="back-btn">← Back</button>
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

  const itemTypeLabel = item.type === 'lost' ? '🔍 Lost Item' : '✅ Found Item';
  const statusLabel = item.status === 'open' ? 'Open' : 'Resolved';

  return (
    <div className="item-detail-container">
      <button onClick={onBack} className="back-btn">← Back</button>

      <div className="item-detail">
        {/* Main Content */}
        <div className="detail-main">
          {/* Image */}
          {item.image_url && (
            <div className="detail-image">
              <img src={item.image_url} alt={item.title} />
            </div>
          )}

          {/* Details */}
          <div className="detail-info">
            <div className="detail-header">
              <h1>{item.title}</h1>
              <div className="detail-badges">
                <span className="type-badge">{itemTypeLabel}</span>
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
              <h3>Details</h3>
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
              <h3>Contact Information</h3>
              <p className="contact-info">{item.contact}</p>
            </div>

            {/* Owner Actions */}
            {isOwner && item.status === 'open' && (
              <div className="owner-actions">
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
                ✓ This item has been marked as resolved.
              </div>
            )}
          </div>
        </div>

        {/* Possible Matches */}
        {matches.length > 0 && (
          <div className="detail-matches">
            <h2>
              Possible Matches
              {item.type === 'lost'
                ? ' (Found Items)'
                : ' (Lost Items)'}
            </h2>
            <p className="matches-intro">
              These items might be related based on category and keywords.
            </p>
            <div className="matches-grid">
              {matches.map((match) => (
                <ItemCard key={match.id} item={match} onClick={() => {}} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
