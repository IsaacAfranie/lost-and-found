import React from 'react';
import './SkeletonCard.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-body">
        <div className="skeleton-header">
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-badge shimmer"></div>
        </div>
        <div className="skeleton-text shimmer"></div>
        <div className="skeleton-text short shimmer"></div>
        <div className="skeleton-footer">
          <div className="skeleton-meta shimmer"></div>
          <div className="skeleton-meta shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
