import React from 'react';
import './CategorySpotlight.css';

export default function CategorySpotlight({ onCategorySelect, onTagSelect }) {
  const categories = [
    {
      name: 'ID/Cards',
      icon: 'ID Card',
      desc: 'KNUST IDs, Drivers Licenses, Bank Cards',
      tags: ['#StudentID', `#IndexNumber`, '#NHISCard'],
      color: 'blue'
    },
    {
      name: 'Electronics',
      icon: 'Electronics',
      desc: 'Laptops, Phones, AirPods, Chargers',
      tags: ['#MacBook', '#AirPods', '#iPhone', '#CasioFx'],
      color: 'purple'
    },
    {
      name: 'Keys',
      icon: 'Keys',
      desc: 'Hall Room Keys, Car Fobs, Lanyards',
      tags: ['#UnityKeys', '#BruneiKeys', '#CarFob'],
      color: 'amber'
    },
    {
      name: 'Books',
      icon: 'Books',
      desc: 'Lecture Notes, Textbooks, Folders',
      tags: ['#ScienceNotes', '#LawBooks', '#LabReport'],
      color: 'emerald'
    },
    {
      name: 'Clothing',
      icon: 'Clothing',
      desc: 'Lab Coats, Hoodies, Umbrellas, Jackets',
      tags: ['#LabCoat', '#KNUSTHoodie', '#Umbrella'],
      color: 'rose'
    },
    {
      name: 'Bag/Wallet',
      icon: 'Bag',
      desc: 'Backpacks, Purses, Leather Wallets',
      tags: ['#NikeBag', '#LeatherWallet', '#ToteBag'],
      color: 'indigo'
    }
  ];

  return (
    <div className="category-spotlight-container">
      <div className="spotlight-header">
        <h2>Popular Categories &amp; Quick Tags</h2>
        <p>Click any category or tag to instantly filter active lost &amp; found items</p>
      </div>

      <div className="categories-spotlight-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`spotlight-card spotlight-${cat.color}`}
            onClick={() => onCategorySelect?.(cat.name)}
          >
            <div className="spotlight-icon-wrapper">
              <span className="spotlight-icon">{cat.icon}</span>
            </div>
            <h3 className="spotlight-name">{cat.name}</h3>
            <p className="spotlight-desc">{cat.desc}</p>
            <div className="spotlight-tags">
              {cat.tags.map((tag) => (
                <span
                  key={tag}
                  className="spotlight-tag-pill"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagSelect?.(tag.replace('#', ''));
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
