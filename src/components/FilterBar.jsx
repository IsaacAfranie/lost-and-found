import React, { useState, useCallback, useRef } from 'react';
import { CATEGORIES, LOCATIONS, ITEM_TYPE } from '../utils/constants';
import './FilterBar.css';

export function FilterBar({ filters, onFilterChange }) {
  const [expanded, setExpanded] = useState(false);
  const searchRef = useRef(null);

  const set = (key, value) => onFilterChange({ ...filters, [key]: value });

  const handleReset = () => {
    onFilterChange({
      type: 'all',
      category: null,
      location: null,
      status: 'open',
      search: '',
      startDate: null,
      endDate: null,
    });
    if (searchRef.current) searchRef.current.focus();
  };

  const activeFilterCount = [
    filters.type && filters.type !== 'all',
    filters.category,
    filters.location,
    filters.status && filters.status !== 'open',
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  return (
    <div className="filter-bar">
      {/* ── Hero Search ── */}
      <div className="search-hero">
        <span className="search-icon" aria-hidden="true"></span>
        <input
          ref={searchRef}
          id="search"
          type="text"
          placeholder="Search by title, description, or keyword…"
          value={filters.search || ''}
          onChange={(e) => set('search', e.target.value)}
          className="search-input"
          autoComplete="off"
          spellCheck="false"
        />
        {filters.search && (
          <button
            className="search-clear"
            onClick={() => { set('search', ''); searchRef.current?.focus(); }}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Type Pill Tabs ── */}
      <div className="type-pills">
        {[['all', 'All Items'], [ITEM_TYPE.LOST, 'Lost'], [ITEM_TYPE.FOUND, 'Found']].map(
          ([val, label]) => (
            <button
              key={val}
              className={`pill ${filters.type === val ? 'pill-active' : ''}`}
              onClick={() => set('type', val)}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* ── Advanced Toggle ── */}
      <button
        className="filters-toggle"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <span>Advanced Filters</span>
        {activeFilterCount > 0 && (
          <span className="filter-badge">{activeFilterCount}</span>
        )}
      </button>

      {/* ── Advanced Filter Grid ── */}
      {expanded && (
        <div className="filter-grid">
          <div className="filter-item">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={filters.category || ''}
              onChange={(e) => set('category', e.target.value || null)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              value={filters.location || ''}
              onChange={(e) => set('location', e.target.value || null)}
            >
              <option value="">All Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={filters.status || 'open'}
              onChange={(e) => set('status', e.target.value || null)}
            >
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="startDate">From Date</label>
            <input
              id="startDate"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => set('startDate', e.target.value || null)}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="endDate">To Date</label>
            <input
              id="endDate"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => set('endDate', e.target.value || null)}
            />
          </div>

          <button className="reset-btn" onClick={handleReset}>
            Reset All
          </button>
        </div>
      )}
    </div>
  );
}
