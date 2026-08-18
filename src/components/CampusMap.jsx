import React from 'react';
import './CampusMap.css';

export default function CampusMap({ selectedLocation, onLocationSelect, itemsCountByLocation = {} }) {
  const locations = [
    { id: 'KNUST Library', name: 'Main Library', x: 45, y: 35, icon: 'Library' },
    { id: 'Science Building', name: 'Science Block', x: 65, y: 28, icon: 'Science' },
    { id: 'Unity Hall', name: 'Unity Hall (Conti)', x: 30, y: 55, icon: 'Campus' },
    { id: 'Commercial Area', name: 'Commercial Area', x: 50, y: 65, icon: 'Market' },
    { id: 'Main Gate', name: 'Main Gate', x: 20, y: 80, icon: 'Gate' },
    { id: 'Great Hall', name: 'Great Hall', x: 75, y: 50, icon: 'Hall' },
    { id: 'Sports Complex', name: 'Sports Complex', x: 80, y: 75, icon: 'Sports' },
    { id: 'Ayeduase', name: 'Ayeduase Gate', x: 15, y: 30, icon: 'Entry' },
  ];

  return (
    <div className="campus-map-container">
      <div className="map-header">
        <div className="map-title-row">
          <h3>KNUST Interactive Campus Map</h3>
          <span className="map-hint">Click any hotspot to filter items by location</span>
        </div>
      </div>

      <div className="map-wrapper">
        <div className="map-canvas">
          {/* Simulated Campus Grid Background Pathways */}
          <svg className="map-routes-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 20 80 Q 35 60 50 65 T 75 50" fill="none" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="0.8" strokeDasharray="2,2" />
            <path d="M 45 35 L 65 28 L 75 50" fill="none" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="0.8" strokeDasharray="2,2" />
            <path d="M 30 55 L 45 35 L 50 65" fill="none" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="0.8" strokeDasharray="2,2" />
            <path d="M 15 30 L 45 35" fill="none" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="0.8" strokeDasharray="2,2" />
          </svg>

          {/* Location Nodes */}
          {locations.map((loc) => {
            const count = itemsCountByLocation[loc.id] || 0;
            const isSelected = selectedLocation === loc.id;

            return (
              <div
                key={loc.id}
                className={`map-node ${isSelected ? 'selected' : ''}`}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                onClick={() => onLocationSelect(isSelected ? null : loc.id)}
              >
                <div className="node-pin">
                  <span className="node-icon">{loc.icon}</span>
                  {count > 0 && <span className="node-count-badge">{count}</span>}
                </div>
                <div className="node-label">{loc.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedLocation && (
        <div className="map-selected-bar">
          <span>Filtering by location: <strong>{selectedLocation}</strong></span>
          <button className="clear-loc-btn" onClick={() => onLocationSelect(null)}>Clear Map Filter</button>
        </div>
      )}
    </div>
  );
}
