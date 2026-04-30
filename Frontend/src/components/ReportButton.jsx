import React, { useState } from 'react';
import { api } from '../../services/api';
import Toast from '../Toast';

const REPORT_REASONS = [
  'Inappropriate content',
  'Spam',
  'Copyright violation',
  'Hate speech',
  'Harassment',
  'Misleading info',
  'Other'
];

export default function ReportButton({ itemId, itemType, className = '' }) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      setToast({ type: 'error', message: 'Please select a reason' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/reports/create', {
        reportType: itemType,
        reportedItem: itemId,
        reason,
        description
      });

      setToast({ type: 'success', message: 'Report submitted successfully' });
      setTimeout(() => {
        setShowModal(false);
        setReason('');
        setDescription('');
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to submit report'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`report-btn ${className}`}
        title="Report this content"
      >
        🚩 Report
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report {itemType}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-group">
                <label htmlFor="reason">Reason *</label>
                <select
                  id="reason"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="form-input"
                  disabled={loading}
                >
                  <option value="">Select a reason...</option>
                  {REPORT_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Additional Details (optional)</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 500))}
                  maxLength={500}
                  placeholder="Provide more context..."
                  rows={4}
                  className="form-input"
                  disabled={loading}
                />
                <small>{description.length}/500</small>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>

            {toast && (
              <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(null)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
