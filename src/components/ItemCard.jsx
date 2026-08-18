import React, { useState } from 'react';
import { ShareTicketModal } from './ShareTicketModal';
import './ItemCard.css';

export function ItemCard({ item, onClick }) {
  const [showShareModal, setShowShareModal] = useState(false);

  const formattedDate = new Date(item.date_lost).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const itemTypeLabel = item.type === 'lost' ? ' Lost' : 'Found';
  const statusLabel = item.status === 'open' ? 'Open' : 'Resolved';
  const statusClass = item.status === 'open' ? 'open' : 'resolved';

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  return (
    <>
      <div className="item-card" onClick={onClick}>
        {/* Image */}
        <div className="item-image">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} />
          ) : (
            <div className="no-image">No Image</div>
          )}
          <span className={`item-type-badge ${item.type}`}>{itemTypeLabel}</span>
          <button
            className="card-share-badge"
            onClick={handleShareClick}
            title="Generate Share Flyer / Pass"
          >
            Share Flyer
          </button>
        </div>

        {/* Content */}
        <div className="item-content">
          <h3 className="item-title">{item.title}</h3>

          <p className="item-description">
            {item.description && item.description.length > 80
              ? `${item.description.substring(0, 80)}...`
              : item.description}
          </p>

          <div className="item-meta">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="category-badge">{item.category}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Location:</span>
              <span className="location-text">{item.location}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Date:</span>
              <span className="date-text">{formattedDate}</span>
            </div>

            <div className="meta-item">
              <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
            </div>
          </div>

          <div className="item-contact">
            <small>Posted by: {item.contact}</small>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareTicketModal item={item} onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
}
