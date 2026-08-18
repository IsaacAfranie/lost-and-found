import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ItemCard } from '../components/ItemCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import '../styles/Dashboard.css';

export default function Dashboard({ onItemSelect }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTab, setFilterTab] = useState('all');

  useEffect(() => {
    async function fetchMyItems() {
      if (authLoading) return;

      if (!user) {
        setItems([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchErr } = await supabase
          .from('items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchErr) throw fetchErr;
        setItems(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load your items.');
      } finally {
        setLoading(false);
      }
    }

    fetchMyItems();
  }, [user, authLoading]);

  const filteredItems = items.filter((item) => {
    if (filterTab === 'open') return item.status === 'open';
    if (filterTab === 'resolved') return item.status === 'resolved';
    return true;
  });

  const openCount = items.filter(i => i.status === 'open').length;
  const resolvedCount = items.filter(i => i.status === 'resolved').length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-profile-summary">
          <div className="avatar-circle">
            {user?.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1>My Activity &amp; Posts</h1>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num">{items.length}</span>
            <span className="stat-label">Total Posted</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{openCount}</span>
            <span className="stat-label">Active Open</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{resolvedCount}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button
          className={`dash-tab ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          All Items ({items.length})
        </button>
        <button
          className={`dash-tab ${filterTab === 'open' ? 'active' : ''}`}
          onClick={() => setFilterTab('open')}
        >
          Open Listings ({openCount})
        </button>
        <button
          className={`dash-tab ${filterTab === 'resolved' ? 'active' : ''}`}
          onClick={() => setFilterTab('resolved')}
        >
          Resolved ({resolvedCount})
        </button>
      </div>

      <main className="dashboard-content">
        {loading ? (
          <SkeletonGrid count={3} />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>You haven't posted any {filterTab === 'all' ? '' : filterTab} items yet.</p>
            <a href="#post" className="btn btn-primary">Post an Item Now</a>
          </div>
        ) : (
          <div className="dashboard-grid">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onItemSelect?.(item)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
