import React from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Home.css';

export default function Home() {
  const { session } = useAuth();

  return (
    <div className="home-container">
      <div className="hero">
        <h1>Campus Lost & Found</h1>
        <p>Help fellow KNUST students find their lost items or report found items</p>

        {session ? (
          <div className="hero-buttons">
            <a href="/post" className="btn btn-primary">
              Post an Item
            </a>
            <a href="/browse" className="btn btn-secondary">
              Browse Items
            </a>
          </div>
        ) : (
          <div className="hero-buttons">
            <a href="/auth" className="btn btn-primary">
              Sign In
            </a>
          </div>
        )}
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>📝 Post Items</h3>
          <p>Report lost or found items with photos and details</p>
        </div>
        <div className="info-card">
          <h3>🔍 Search & Browse</h3>
          <p>Filter by category, location, and date to find items</p>
        </div>
        <div className="info-card">
          <h3>✅ Match & Resolve</h3>
          <p>Our matching system helps connect lost and found items</p>
        </div>
      </div>
    </div>
  );
}
