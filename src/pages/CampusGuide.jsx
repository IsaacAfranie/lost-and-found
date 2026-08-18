import React, { useState } from 'react';
import '../styles/CampusGuide.css';

export default function CampusGuide() {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const porterDesks = [
    {
      id: 'library',
      name: 'KNUST Main University Library',
      location: 'Ground Floor Main Security Desk',
      hours: 'Mon - Sun: 8:00 AM - 10:00 PM',
      phone: '+233 (0) 3220 60021',
      details: 'Primary collection center for lost Student IDs, laptops, study notebooks, and calculators left in reading rooms.',
      badge: 'High Traffic',
      icon: 'Library'
    },
    {
      id: 'unity',
      name: 'Unity Hall (Conti) Secretariat',
      location: 'Main Gate Security Office',
      hours: '24/7 Security Coverage',
      phone: '+233 (0) 24 123 4567',
      details: 'Handles items lost around Unity Hall, Commercial Area walkways, and nearby lecture theatres.',
      badge: '24/7 Desk',
      icon: 'Campus Hall'
    },
    {
      id: 'science',
      name: 'College of Science Security Office',
      location: 'Block A, Ground Floor Near Dean\'s Office',
      hours: 'Mon - Fri: 7:30 AM - 6:00 PM',
      phone: '+233 (0) 3220 60321',
      details: 'Central point for items misplaced in science laboratories, lecture halls, and practical session areas.',
      badge: 'Faculty Hub',
      icon: 'Science'
    },
    {
      id: 'commercial',
      name: 'Commercial Area Campus Police Station',
      location: 'Opposite KNUST Hospital Junction',
      hours: '24/7 Duty Office',
      phone: '+233 (0) 3220 60100',
      details: 'Official security outpost for high-value items, lost wallets, mobile phones, and bank cards.',
      badge: 'Official Security',
      icon: 'Security'
    },
    {
      id: 'queens',
      name: 'Queen Elizabeth II (Queen\'s) Hall',
      location: 'Porter\'s Desk, Main Entrance',
      hours: '24/7 Desk',
      phone: '+233 (0) 24 987 6543',
      details: 'Receives items lost around Queen\'s Hall, Great Hall walkway, and administrative area.',
      badge: 'Hall Porter',
      icon: 'Hall'
    },
    {
      id: 'africa',
      name: 'Africa Hall Secretariat',
      location: 'Porter\'s Lodge, Gate 1',
      hours: '24/7 Desk',
      phone: '+233 (0) 20 555 0192',
      details: 'Collection point for items lost near Africa Hall, Brunei, and Ayeduase entrance.',
      badge: 'Hall Porter',
      icon: 'Campus'
    }
  ];

  const recoveryGuides = [
    {
      id: 'id-card',
      icon: 'ID Card',
      title: 'Lost Your KNUST Student ID Card?',
      subtitle: 'Fast-track guide to reporting and getting exam pass permission',
      steps: [
        'Search CampusFind first using your exact Full Name or Student Index Number in quotes.',
        'Check the Main Library Porter Desk & Commercial Area Police Desk where 70% of lost IDs are deposited.',
        'If preparing for exams, visit Academic Affairs (Great Hall block) with an official Police Extradition Extract to request a temporary exam permit.',
        'Post a "Lost" report on CampusFind with a clear contact number so whoever finds it can reach you instantly.'
      ]
    },
    {
      id: 'exam-emergency',
      icon: 'Emergency',
      title: 'Exam Week Emergency: Missing Calculator or Lab Coat?',
      subtitle: 'How to recover essential exam materials rapidly',
      steps: [
        'Post an urgent alert on CampusFind tagging your exam venue (e.g., #ScienceBlock or #Library).',
        'Check with your Departmental Executive Council (DESA/SESA/CoSE) office — students often turn in calculators there after papers.',
        'Browse recent "Found" listings under the Electronics or Clothing category.'
      ]
    },
    {
      id: 'safety',
      icon: 'Safety',
      title: 'Safe Campus Meetup Guidelines',
      subtitle: 'Protect yourself when claiming or handing over items',
      steps: [
        'Always schedule meetups in well-lit public campus places (e.g. Library Plaza, Commercial Area, or Hall Porter Desks).',
        'Verify identity & ownership before handing over high-value electronics (e.g., ask owner to unlock phone or state serial number).',
        'Never exchange monetary rewards electronically before physically inspecting the returned item.'
      ]
    }
  ];

  const faqs = [
    {
      q: 'How long does it take for a lost item to be matched on CampusFind?',
      a: 'Most items posted with clear photos and accurate location tags receive match suggestions within 2 to 12 hours.'
    },
    {
      q: 'What should I do if I find a student ID or driver\'s license?',
      a: 'Post it on CampusFind under the ID/Cards category. For security, hide sensitive details like national ID digits or full home address in photos.'
    },
    {
      q: 'Can I drop off a found item at a Hall Porter desk?',
      a: 'Yes! You can hand it over to any KNUST Hall Porter desk listed in our directory. Make sure to note which desk it was left at when posting.'
    },
    {
      q: 'Is CampusFind free for all KNUST students?',
      a: 'Yes, CampusFind is 100% free and open for all KNUST undergraduate, postgraduate, and campus community members.'
    }
  ];

  const filteredDesks = porterDesks.filter(desk =>
    desk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    desk.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    desk.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="campus-guide-container">
      {/* ── Header Banner ── */}
      <header className="guide-hero">
        <div className="guide-hero-badge">Campus Resource Hub</div>
        <h1 className="guide-title">
          KNUST Campus Directory &amp; <span className="hero-accent">Recovery Guide</span>
        </h1>
        <p className="guide-subtitle">
          Find official porter desk locations, report lost student IDs, and learn how to safely recover your belongings anywhere on campus.
        </p>

        <div className="guide-tabs">
          <button
            className={`guide-tab ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            Porter Desks &amp; Security ({porterDesks.length})
          </button>
          <button
            className={`guide-tab ${activeTab === 'guides' ? 'active' : ''}`}
            onClick={() => setActiveTab('guides')}
          >
            Recovery &amp; Safety Guides
          </button>
          <button
            className={`guide-tab ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            FAQs &amp; Help Desk
          </button>
        </div>
      </header>

      {/* ── Content Sections ── */}
      <main className="guide-main">

        {/* ── TAB 1: DIRECTORY ── */}
        {activeTab === 'directory' && (
          <section className="directory-section">
            <div className="directory-search">
              <span className="search-icon">Search</span>
              <input
                type="text"
                placeholder="Search collection point (e.g., Library, Unity, Science)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>Clear</button>
              )}
            </div>

            <div className="porter-grid">
              {filteredDesks.map((desk) => (
                <div key={desk.id} className="porter-card">
                  <div className="card-top">
                    <span className="card-icon">{desk.icon}</span>
                    <span className="card-badge">{desk.badge}</span>
                  </div>
                  <h3 className="card-name">{desk.name}</h3>
                  <div className="card-info-row">
                    <span className="info-icon">Location</span>
                    <span>{desk.location}</span>
                  </div>
                  <div className="card-info-row">
                    <span className="info-icon">Hours</span>
                    <span>{desk.hours}</span>
                  </div>
                  <div className="card-info-row">
                    <span className="info-icon">Phone</span>
                    <a href={`tel:${desk.phone}`} className="phone-link">{desk.phone}</a>
                  </div>
                  <p className="card-details">{desk.details}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TAB 2: GUIDES ── */}
        {activeTab === 'guides' && (
          <section className="guides-section">
            <div className="guides-grid">
              {recoveryGuides.map((guide) => (
                <div key={guide.id} className="guide-card">
                  <div className="guide-card-header">
                    <span className="guide-card-icon">{guide.icon}</span>
                    <div>
                      <h2>{guide.title}</h2>
                      <p>{guide.subtitle}</p>
                    </div>
                  </div>
                  <div className="steps-list">
                    {guide.steps.map((step, idx) => (
                      <div key={idx} className="step-item">
                        <span className="step-num">{idx + 1}</span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TAB 3: FAQS ── */}
        {activeTab === 'faqs' && (
          <section className="faqs-section">
            <div className="faqs-list">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`faq-item ${expandedFaq === idx ? 'expanded' : ''}`}
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <div className="faq-question">
                    <h3>{faq.q}</h3>
                    <span className="toggle-icon">{expandedFaq === idx ? '−' : '+'}</span>
                  </div>
                  {expandedFaq === idx && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="faq-cta-box">
              <h3>Still have questions or need assistance?</h3>
              <p>Post your item or check existing active posts on our browse page.</p>
              <div className="cta-buttons">
                <a href="#browse" className="btn btn-primary">Browse All Listings</a>
                <a href="#post" className="btn btn-secondary">Post a Lost Item</a>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
