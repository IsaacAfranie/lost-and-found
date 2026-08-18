import React, { useState } from 'react';
import './ShareTicketModal.css';

export function ShareTicketModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const itemUrl = `${window.location.origin}${window.location.pathname}#item/${item.id}`;
  const isLost = item.type === 'lost';
  const itemTypeLabel = isLost ? 'LOST ITEM ANNOUNCEMENT' : 'FOUND ITEM ANNOUNCEMENT';
  
  // Format WhatsApp Message
  const whatsappText = encodeURIComponent(
    `*KNUST CAMPUS ${isLost ? 'LOST ITEM' : 'FOUND ITEM'} NOTICE*\n\n` +
    `*Item:* ${item.title}\n` +
    `*Category:* ${item.category}\n` +
    `*Location:* ${item.location}\n` +
    `*Date:* ${new Date(item.date_lost).toLocaleDateString()}\n` +
    `*Contact:* ${item.contact}\n\n` +
    `*View Full Details & Photo:* ${itemUrl}\n\n` +
    `Please share in hall & department WhatsApp groups!`
  );

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  // Generate QR Code URL using free reliable QuickChart API
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(itemUrl)}&size=160&margin=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(itemUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="ticket-modal-backdrop" onClick={onClose}>
      <div className="ticket-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="ticket-close-btn" onClick={onClose} aria-label="Close">Close</button>

        {/* ── Ticket Header ── */}
        <div className={`ticket-header ${item.type}`}>
          <div className="ticket-badge">KNUST CAMPUS PASS</div>
          <h2 className="ticket-title">{itemTypeLabel}</h2>
          <div className="ticket-id-tag">REF: #{item.id.slice(0, 8).toUpperCase()}</div>
        </div>

        {/* ── Ticket Body ── */}
        <div className="ticket-body">
          <div className="ticket-main-info">
            {item.image_url ? (
              <div className="ticket-thumb">
                <img src={item.image_url} alt={item.title} />
              </div>
            ) : (
              <div className="ticket-thumb placeholder">
                <span>{isLost ? 'Lost Item' : 'Found Item'}</span>
              </div>
            )}

            <div className="ticket-details">
              <h3 className="ticket-item-title">{item.title}</h3>
              <div className="ticket-pills">
                <span className="pill-cat">{item.category}</span>
                <span className="pill-loc"> {item.location}</span>
              </div>
              <p className="ticket-date"> {new Date(item.date_lost).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <div className="ticket-contact">
                <span className="contact-lbl">Contact Person:</span>
                <strong className="contact-val">{item.contact}</strong>
              </div>
            </div>
          </div>

          {/* ── QR & Verification ── */}
          <div className="ticket-qr-section">
            <div className="qr-code-box">
              <img src={qrCodeUrl} alt="Scan QR to View Item" />
              <span>Scan to view on phone</span>
            </div>
            <div className="ticket-stub-info">
              <div className="stub-brand">Campus Lost &amp; Found</div>
              <p className="stub-desc">Official verification ticket for KNUST lost &amp; found network.</p>
              <div className="stub-dots"></div>
            </div>
          </div>
        </div>

        {/* ── Share Actions ── */}
        <div className="ticket-actions">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn whatsapp-btn"
          >
            Share on WhatsApp Group
          </a>
          <button
            onClick={handleCopyLink}
            className={`share-btn copy-btn ${copied ? 'copied' : ''}`}
          >
            {copied ? 'Link Copied!' : 'Copy Direct Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
