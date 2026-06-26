import React from 'react';
import { CATEGORIES, LOCATIONS, ITEM_TYPE } from '../utils/constants';
import './FilterBar.css';

export function FilterBar({ filters, onFilterChange }) {
  const handleTypeChange = (e) => {
    onFilterChange({ ...filters, type: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onFilterChange({ ...filters, category: e.target.value || null });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value || null });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value || null });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStartDateChange = (e) => {
    onFilterChange({ ...filters, startDate: e.target.value || null });
  };

  const handleEndDateChange = (e) => {
    onFilterChange({ ...filters, endDate: e.target.value || null });
  };

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
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        {/* Search */}
        <div className="filter-item">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by title or description..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        {/* Type Toggle */}
        <div className="filter-item">
          <label htmlFor="type">Item Type</label>
          <select id="type" value={filters.type || 'all'} onChange={handleTypeChange}>
            <option value="all">All Items</option>
            <option value={ITEM_TYPE.LOST}>Lost</option>
            <option value={ITEM_TYPE.FOUND}>Found</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-item">
          <label htmlFor="category">Category</label>
          <select id="category" value={filters.category || ''} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="filter-item">
          <label htmlFor="location">Location</label>
          <select id="location" value={filters.location || ''} onChange={handleLocationChange}>
            <option value="">All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-item">
          <label htmlFor="status">Status</label>
          <select id="status" value={filters.status || 'open'} onChange={handleStatusChange}>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="filter-item">
          <label htmlFor="startDate">From Date</label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate || ''}
            onChange={handleStartDateChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="endDate">To Date</label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate || ''}
            onChange={handleEndDateChange}
          />
        </div>

        {/* Reset Button */}
        <button className="reset-btn" onClick={handleReset}>
          Reset Filters
        </button>
      </div>
    </div>
  );
}
