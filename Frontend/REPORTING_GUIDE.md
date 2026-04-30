## 📱 FRONTEND: Report & Flagging System Guide

This guide shows you how to implement the **Report Post** and **Report User** buttons in your frontend.

---

## 🎯 What To Build

### 1. Report Buttons (On Posts/Users)
- Report button on **Project cards**
- Report button on **Design cards**
- Report button on **User profiles**
- Report button on **Comments**

### 2. Report Modal/Form
- Reason dropdown (predefined list)
- Optional description field (500 chars max)
- Submit button with loading state

### 3. Admin Dashboard Pages
- **Flagged Content Queue** - Review auto-flagged posts
- **User Reports** - View & resolve user reports
- **Activity Logs** - Track all admin actions

---

## 📋 API ENDPOINTS AVAILABLE

### Create Report (Public)
```javascript
POST /api/reports/create
Authorization: Bearer {token}

Request:
{
  "reportType": "project",  // "project" | "design" | "comment" | "user"
  "reportedItem": "projectId",
  "reason": "Inappropriate content",
  "description": "Optional details up to 500 chars"
}

Response (201):
{
  "message": "Report submitted successfully",
  "report": {
    "_id": "reportId",
    "reportType": "project",
    "reportedItem": { /* project data */ },
    "reportedBy": { "username": "...", "email": "..." },
    "reason": "Inappropriate content",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get My Reports
```javascript
GET /api/reports/my-reports?status=pending&page=1&limit=10
Authorization: Bearer {token}

Response:
{
  "reports": [ /* array of reports */ ],
  "pagination": {
    "total": 5,
    "pages": 1,
    "currentPage": 1
  }
}
```

### Get Report Details
```javascript
GET /api/reports/:id
Authorization: Bearer {token}

Response:
{
  "_id": "reportId",
  "reportType": "project",
  "reportedItem": { /* full item data */ },
  "reportedBy": { /* user data */ },
  "reason": "Spam",
  "status": "pending",
  "resolution": null
}
```

### Delete Report (Pending Only)
```javascript
DELETE /api/reports/:id
Authorization: Bearer {token}

Response:
{ "message": "Report deleted successfully" }
```

### Get Flagged Content (Admin)
```javascript
GET /api/admin/projects  // All projects (some may be flagged)
GET /api/admin/designs   // All designs (some may be flagged)
GET /api/admin/comments  // All comments (some may be flagged)

Returns: Content with isFlagged: true and flags array
{
  "isFlagged": true,
  "flagLevel": "medium",
  "flags": [
    { "reason": "Profanity detected", "flaggedAt": "..." },
    { "reason": "Spam pattern detected", "flaggedAt": "..." }
  ]
}
```

### Get All Reports (Admin)
```javascript
GET /api/admin/reports?status=pending&page=1&limit=20
Authorization: Bearer {adminToken}

Response:
[
  {
    "_id": "reportId",
    "reportType": "project",
    "reportedItem": { /* item */ },
    "reason": "Copyright violation",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  // ...
]
```

### Resolve Report (Admin)
```javascript
POST /api/admin/reports/:id/resolve
Authorization: Bearer {adminToken}

Request:
{
  "action": "removed",  // "removed" | "suspended" | "warning" | "no-action"
  "adminNotes": "Content violated guidelines"
}

Response:
{ "message": "Report resolved" }
```

---

## 💻 COMPONENT IMPLEMENTATION EXAMPLES

### 1. Report Button Component
```jsx
// components/ReportButton.jsx
import { useState } from 'react';
import ReportModal from './ReportModal';

export default function ReportButton({ itemId, itemType }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="report-btn"
        title="Report this content"
      >
        🚩 Report
      </button>

      {showModal && (
        <ReportModal
          itemId={itemId}
          itemType={itemType}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
```

### 2. Report Modal
```jsx
// components/ReportModal.jsx
import { useState } from 'react';
import { api } from '../services/api';
import Toast from './Toast';

const REPORT_REASONS = [
  "Inappropriate content",
  "Spam",
  "Copyright violation",
  "Hate speech",
  "Harassment",
  "Misleading info",
  "Other"
];

export default function ReportModal({ itemId, itemType, onClose }) {
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

      setToast({ 
        type: 'success', 
        message: 'Report submitted successfully' 
      });
      setTimeout(onClose, 1500);
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Report {itemType}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason</label>
            <select value={reason} onChange={e => setReason(e.target.value)}>
              <option value="">Select a reason...</option>
              {REPORT_REASONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Additional Details (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 500))}
              maxLength={500}
              placeholder="Provide more context..."
              rows={4}
            />
            <small>{description.length}/500</small>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="primary">
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>

        {toast && <Toast type={toast.type} message={toast.message} />}
      </div>
    </div>
  );
}
```

### 3. Add Report Button to Project Card
```jsx
// components/feed/FeedCard.jsx
import ReportButton from '../ReportButton';

export default function FeedCard({ project }) {
  return (
    <div className="feed-card">
      {/* Existing card content */}
      <h3>{project.title}</h3>
      <p>{project.description}</p>

      {/* Flag warning if auto-flagged */}
      {project.isFlagged && (
        <div className={`flag-warning flag-${project.flagLevel}`}>
          ⚠️ This content is under review
          {project.flagLevel === 'high' && ' - May be restricted'}
        </div>
      )}

      {/* Action buttons */}
      <div className="card-actions">
        <button onClick={() => handleLike(project._id)}>👍 Like</button>
        <button onClick={() => handleSave(project._id)}>💾 Save</button>
        <ReportButton itemId={project._id} itemType="project" />
      </div>
    </div>
  );
}
```

### 4. Admin: Flagged Content Queue
```jsx
// pages/AdminFlaggedQueue.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminFlaggedQueue() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedContent();
  }, []);

  const fetchFlaggedContent = async () => {
    try {
      const res = await api.get('/admin/projects');
      // Filter only flagged items
      const flagged = res.data.projects.filter(p => p.isFlagged);
      setProjects(flagged);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (projectId) => {
    await api.post(`/admin/projects/${projectId}/approve`);
    fetchFlaggedContent();
  };

  const handleReject = async (projectId) => {
    await api.post(`/admin/projects/${projectId}/reject`);
    fetchFlaggedContent();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flagged-queue">
      <h2>Flagged Content Review ({projects.length})</h2>

      {projects.length === 0 ? (
        <p>No flagged content</p>
      ) : (
        <div className="queue-items">
          {projects.map(project => (
            <div key={project._id} className="queue-item">
              <div className="content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>

              <div className="flag-info">
                <strong>Flag Level: {project.flagLevel}</strong>
                <ul>
                  {project.flags.map((flag, idx) => (
                    <li key={idx}>• {flag.reason}</li>
                  ))}
                </ul>
              </div>

              <div className="actions">
                <button 
                  onClick={() => handleApprove(project._id)}
                  className="approve-btn"
                >
                  ✅ Approve
                </button>
                <button 
                  onClick={() => handleReject(project._id)}
                  className="reject-btn"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5. Admin: User Reports Dashboard
```jsx
// pages/AdminReports.jsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    const res = await api.get(`/admin/reports?status=${filter}`);
    setReports(res.data);
  };

  const handleResolve = async (reportId, action) => {
    await api.post(`/admin/reports/${reportId}/resolve`, { action });
    fetchReports();
  };

  return (
    <div className="reports-dashboard">
      <h2>User Reports</h2>

      <div className="filters">
        {['pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={filter === status ? 'active' : ''}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      <table className="reports-table">
        <thead>
          <tr>
            <th>Reporter</th>
            <th>Item Type</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report._id}>
              <td>{report.reportedBy.username}</td>
              <td>{report.reportType}</td>
              <td>{report.reason}</td>
              <td>{new Date(report.createdAt).toLocaleDateString()}</td>
              <td>
                {report.status === 'pending' && (
                  <>
                    <button onClick={() => handleResolve(report._id, 'removed')}>
                      Remove
                    </button>
                    <button onClick={() => handleResolve(report._id, 'no-action')}>
                      Dismiss
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🎨 CSS STYLING REFERENCE

```css
/* Report Button */
.report-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.report-btn:hover {
  background: #ee5a52;
}

/* Flag Warning */
.flag-warning {
  padding: 12px;
  border-radius: 4px;
  margin: 10px 0;
  font-weight: 500;
}

.flag-warning.flag-low {
  background: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.flag-warning.flag-medium {
  background: #ffe5e5;
  color: #721c24;
  border-left: 4px solid #ff6b6b;
}

.flag-warning.flag-high {
  background: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.form-group small {
  display: block;
  margin-top: 4px;
  color: #999;
  font-size: 12px;
}
```

---

## ✅ CHECKLIST: Frontend Features To Build

- [ ] Report button on project cards
- [ ] Report button on design cards
- [ ] Report button on user profiles
- [ ] Report modal with form validation
- [ ] Toast notifications for success/error
- [ ] Display flagged content warning
- [ ] Admin flagged content queue page
- [ ] Admin reports dashboard
- [ ] Admin activity logs page
- [ ] Search/filter reports
- [ ] Bulk actions for admins
- [ ] Export reports as CSV

---

## 🔗 INTEGRATION CHECKLIST

Before going live:
- [ ] Update all API calls to use `/api/reports` endpoints
- [ ] Add report buttons to all user-generated content
- [ ] Create admin moderation pages
- [ ] Test rate limiting (try rapid requests)
- [ ] Test auto-flagging (create post with spam keywords)
- [ ] Test report submission
- [ ] Test admin review flow
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test on mobile

---

That's everything you need to implement the report & flagging system on the frontend! 🚀
