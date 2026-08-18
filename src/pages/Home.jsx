import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useItems } from '../hooks/useItems';
import { ItemCard } from '../components/ItemCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ActivityTicker from '../components/ActivityTicker';
import '../styles/Home.css';

export default function Home({ onItemSelect, onSearch }) {
  const { session } = useAuth();
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { items, loading, error } = useItems({
    status: 'open',
    type: typeFilter,
    limit: 6,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        window.location.hash = `browse/${encodeURIComponent(searchQuery.trim())}`;
      }
    } else {
      window.location.hash = 'browse';
    }
  };

  const handleCategorySelect = (categoryName) => {
    window.location.hash = `browse`;
  };

  const handleTagSelect = (tagText) => {
    if (onSearch) {
      onSearch(tagText);
    } else {
      window.location.hash = `browse/${encodeURIComponent(tagText)}`;
    }
  };

  return (
    <div className="home-container">
      {/* ── Live Campus Ticker ──────────────── */}
      <ActivityTicker />

      {/* ── Hero ─────────────────────────── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">KNUST Campus</div>
          <h1 className="hero-title">
            Lost Something?<br />
            <span className="hero-accent">We'll Help You Find It.</span>
          </h1>
          <p className="hero-sub">
            The official lost &amp; found platform for KNUST students.
            Post lost items, report what you found, and let our smart
            matching system do the rest.
          </p>

          {/* ── Hero Quick Search Form ── */}
          <form className="hero-search-form" onSubmit={handleSearchSubmit}>
            <div className="hero-search-input-wrapper">
              <span className="hero-search-icon"></span>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search lost or found items (e.g. Student ID, Laptop, Keys)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">
                Search
              </button>
            </div>
          </form>

          <div className="hero-buttons">
            {session ? (
              <>
                <a href="#post" className="btn btn-primary">Post an Item</a>
                <a href="#browse" className="btn btn-secondary">Browse All Items</a>
              </>
            ) : (
              <>
                <a href="#auth" className="btn btn-primary">Get Started</a>
                <a href="#browse" className="btn btn-outline">Browse All Items</a>
              </>
            )}
            <a href="#guide" className="btn btn-outline" style={{ borderStyle: 'dashed' }}>
              Security &amp; Porter Directory
            </a>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="deco-circle deco-1" />
          <div className="deco-circle deco-2" />
          <div className="deco-circle deco-3" />
        </div>
      </section>

      {/* ── Recent Listings ──────────────── */}
      <section className="recent-section">
        <div className="recent-header">
          <h2 className="section-heading">Recent on Campus</h2>
          <a href="#browse" className="view-all-link">View all →</a>
        </div>

        <div className="type-tabs">
          {[
            { value: 'all', label: 'All' },
            { value: 'lost', label: 'Lost' },
            { value: 'found', label: 'Found' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`type-tab ${typeFilter === value ? 'active' : ''}`}
              onClick={() => setTypeFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {error ? (
          <p className="recent-error">Could not load listings. Please try again later.</p>
        ) : loading ? (
          <SkeletonGrid count={3} />
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>No {typeFilter === 'all' ? '' : typeFilter + ' '}listings yet.</p>
            <a href={session ? '#post' : '#auth'} className="btn btn-primary">
              {session ? 'Post an Item' : 'Get Started'}
            </a>
          </div>
        ) : (
          <div className="recent-items-grid">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onItemSelect?.(item)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="home-cta-banner">
        <div>
          <p className="cta-kicker">Need help fast?</p>
          <h3>Search for what was left behind on campus.</h3>
        </div>
        <div className="cta-actions">
          <a href="#browse" className="btn btn-primary">Browse listings</a>
          <a href="#post" className="btn btn-secondary">Post an item</a>
        </div>
      </section>

      <section className="trust-strip">
        <div className="trust-metric">
          <strong>2 min</strong>
          <span>average claim start</span>
        </div>
        <div className="trust-metric">
          <strong>100%</strong>
          <span>KNUST-focused</span>
        </div>
        <div className="trust-metric">
          <strong>24/7</strong>
          <span>campus visibility</span>
        </div>
      </section>

      {/* ── How It Works ─────────────────── */}
      <section className="steps-section">
        <h2 className="section-heading section-heading-plain">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon"></div>
            <h3>Post Your Item</h3>
            <p>Report a lost or found item with a photo, description, and where it was last seen.</p>
          </div>
          <div className="step-card step-green">
            <div className="step-number">02</div>
            <div className="step-icon"></div>
            <h3>Browse &amp; Search</h3>
            <p>Filter by category, location, and date. Our search scans every listing instantly.</p>
          </div>
          <div className="step-card step-yellow">
            <div className="step-number">03</div>
            <div className="step-icon"></div>
            <h3>Match &amp; Reunite</h3>
            <p>Our system suggests matching items automatically. Contact the poster and get it back.</p>
          </div>
        </div>
      </section>

      <section className="home-feature-section">
        <div className="home-feature-header">
          <h2 className="section-heading section-heading-soft">Why students use CampusFind</h2>
          <p>Built around trust, speed, and safer campus recovery.</p>
        </div>

        <div className="home-feature-grid">
          <div className="feature-card feature-card-green">
            <div className="feature-label">Fast Search</div>
            <h3>Find the right item in seconds</h3>
            <p>Search across categories, locations, and dates to narrow down exactly what was lost or found on campus.</p>
          </div>

          <div className="feature-card feature-card-blue">
            <div className="feature-label">Verified Contact</div>
            <h3>Safer handoff and ownership checks</h3>
            <p>Share direct item details, verify proof, and confirm ownership before meeting up with another student.</p>
          </div>

          <div className="feature-card feature-card-yellow">
            <div className="feature-label">Campus Network</div>
            <h3>Built for KNUST communities</h3>
            <p>From the library and halls to the science blocks, the platform supports the way students actually move around campus.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
