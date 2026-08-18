import React from 'react';
import './ActivityTicker.css';

export default function ActivityTicker() {
  const activities = [
    { type: 'found', text: 'Student ID card found near KNUST Main Library', time: '10m ago' },
    { type: 'lost', text: 'Casio fx-991ES Calculator reported missing at Science Hall', time: '25m ago' },
    { type: 'resolved', text: 'Black Dell laptop reuniting with owner at Commercial Area', time: '1h ago' },
    { type: 'found', text: 'Set of hall keys found near Unity Hall main gate', time: '2h ago' },
  ];

  return (
    <div className="activity-ticker-bar">
      <div className="ticker-label">
        <span className="live-dot"></span>
        <span className="ticker-title">KNUST Campus Live</span>
      </div>
      <div className="ticker-scroll">
        <div className="ticker-track">
          {activities.concat(activities).map((act, idx) => (
            <div key={idx} className="ticker-item">
              <span className={`ticker-badge badge-${act.type}`}>
                {act.type.toUpperCase()}
              </span>
              <span className="ticker-text">{act.text}</span>
              <span className="ticker-time">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
