import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { ItemCard } from '../components/ItemCard';
import { useItems } from '../hooks/useItems';
import { SkeletonGrid } from '../components/SkeletonCard';
import CampusMap from '../components/CampusMap';
import '../styles/Browse.css';

export default function Browse({ onItemSelect, initialSearch = '' }) {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    type: 'all',
    category: null,
    location: null,
    status: 'open',
    search: initialSearch,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (initialSearch !== undefined) {
      setFilters((prev) => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  const { items, loading, error } = useItems(filters);

  const itemsCountByLocation = items.reduce((acc, item) => {
    if (item.location) {
      acc[item.location] = (acc[item.location] || 0) + 1;
    }
    return acc;
  }, {});

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, search: '' }));
  };

  if (error) {
    return (
      <div className="browse-container">
        <div className="error-message">
          <h2>Error Loading Items</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-container">
      <header className="browse-header">
        <h1>Browse <span className="accent">Items</span></h1>
        <p>Search for lost or found items across KNUST campus</p>
      </header>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      <div className="view-mode-bar">
        <div className="view-toggle-buttons">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            Campus Map View
          </button>
        </div>
      </div>

      {viewMode === 'map' && (
        <CampusMap
          selectedLocation={filters.location}
          onLocationSelect={(loc) => setFilters((prev) => ({ ...prev, location: loc }))}
          itemsCountByLocation={itemsCountByLocation}
        />
      )}

      <div className="browse-content">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">No results</div>
            <h3>No items found</h3>
            {filters.search ? (
              <p>No results matching <strong>"{filters.search}"</strong>. Try broadening your keywords or clearing filters.</p>
            ) : (
              <p>No items found matching your filter criteria.</p>
            )}
            <div className="empty-actions">
              {filters.search && (
                <button onClick={clearSearch} className="btn btn-secondary">Clear Search</button>
              )}
              <a href="#post" className="btn btn-primary">Post an Item</a>
            </div>
          </div>
        ) : (
          <>
            <div className="items-count">
              <p>
                Found <span className="badge-count">{items.length}</span> {items.length === 1 ? 'item' : 'items'}
                {filters.search && (
                  <span className="search-query-tag">
                    matching "{filters.search}"
                    <button onClick={clearSearch} className="tag-clear-btn" title="Clear search">Clear</button>
                  </span>
                )}
              </p>
            </div>
            <div className="items-grid">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => onItemSelect && onItemSelect(item)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
