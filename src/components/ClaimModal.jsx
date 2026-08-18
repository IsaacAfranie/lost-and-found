import React, { useState } from 'react';
import './ClaimModal.css';

export default function ClaimModal({ item, onClose }) {
  const [proofText, setProofText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="claim-modal-overlay" onClick={onClose}>
      <div className="claim-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="claim-modal-close" onClick={onClose}>Close</button>

        <div className="claim-modal-header">
          <span className="claim-modal-icon">Security</span>
          <h2>Claim &amp; Verify Ownership</h2>
          <p>Verify details for: <strong>"{item.title}"</strong></p>
        </div>

        {!submitted ? (
          <form className="claim-form" onSubmit={handleSubmit}>
            <div className="security-notice">
              <span className="notice-icon">Tip</span>
              <p>
                To protect against fraudulent claims on campus, please describe unique features of this item (e.g. lockscreen photo description, scratches, serial numbers, or exact contents).
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="proof">Identifying Features / Proof of Ownership</label>
              <textarea
                id="proof"
                rows="4"
                required
                placeholder="E.g., The phone wallpaper is a red car; there is a scratch near the volume button..."
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
              />
            </div>

            <div className="meetup-tips">
              <h4>Campus Safe Meetup Reminder:</h4>
              <ul>
                <li>Meet at a public spot (KNUST Library Plaza or Commercial Area).</li>
                <li>Verify ownership details before handing over items.</li>
              </ul>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Prepare Verification Contact
              </button>
            </div>
          </form>
        ) : (
          <div className="claim-success-box">
            <span className="success-icon">Success</span>
            <h3>Verification Proof Prepared!</h3>
            <p className="success-sub">
              Below is the poster's direct contact information. When you contact them, share your verification note to confirm ownership.
            </p>

            <div className="contact-reveal-card">
              <span className="contact-label">Poster Contact Info:</span>
              <span className="contact-value">{item.contact}</span>
            </div>

            <div className="proof-summary">
              <strong>Your Verification Note:</strong>
              <p>"{proofText}"</p>
            </div>

            <button className="btn btn-primary btn-full" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
