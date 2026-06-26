import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { ItemCard } from '../components/ItemCard';
import { useItems } from '../hooks/useItems';
import '../styles/Browse.css';

export default function Browse({ onItemSelect }) {
  const [filters, setFilters] = useState({
    type: 'all',
    category: null,
    location: null,
    status: 'open',
    search: '',
    startDate: null,
    endDate: null,
  });

  const { items, loading, error } = useItems(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleItemClick = (item) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
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
        <h1>Browse Items</h1>
        <p>Search for lost or found items on campus</p>
      </header>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      <div className="browse-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p>📭 No items found matching your filters.</p>
            <p>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="items-count">
              <p>Found {items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="items-grid">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
