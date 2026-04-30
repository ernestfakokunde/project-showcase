import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Toast from '../components/Toast';
import '../styles/admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data.stats);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load stats'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'projects', label: '📌 Projects', icon: '📌' },
    { id: 'designs', label: '🎨 Designs', icon: '🎨' },
    { id: 'comments', label: '💬 Comments', icon: '💬' },
    { id: 'reports', label: '🚩 Reports', icon: '🚩' },
    { id: 'flagged', label: '⚠️ Flagged', icon: '⚠️' },
    { id: 'logs', label: '📜 Activity Logs', icon: '📜' }
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🛡️ Admin Control Panel</h1>
        <p>Manage platform content, users, and security</p>
      </header>

      <nav className="admin-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {activeTab === 'overview' && <AdminOverview stats={stats} />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'designs' && <AdminDesigns />}
        {activeTab === 'comments' && <AdminComments />}
        {activeTab === 'reports' && <AdminReports />}
        {activeTab === 'flagged' && <AdminFlaggedQueue />}
        {activeTab === 'logs' && <AdminActivityLogs />}
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ==================== OVERVIEW ====================
function AdminOverview({ stats }) {
  if (!stats) return <div>No data</div>;

  const StatCard = ({ label, value, icon, color }) => (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="admin-section">
      <h2>Platform Overview</h2>
      
      <div className="stats-grid">
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats.totalUsers}
          color="blue"
        />
        <StatCard
          icon="✅"
          label="Active Users"
          value={stats.activeUsers}
          color="green"
        />
        <StatCard
          icon="🚫"
          label="Suspended Users"
          value={stats.suspendedUsers}
          color="red"
        />
        <StatCard
          icon="📌"
          label="Active Projects"
          value={stats.activeProjects}
          color="purple"
        />
        <StatCard
          icon="🤝"
          label="Collaborations"
          value={stats.collaborationCount}
          color="orange"
        />
        <StatCard
          icon="📊"
          label="Reports Pending"
          value={stats.pendingReports}
          color="yellow"
        />
      </div>

      <div className="quick-stats">
        <div className="quick-stat">
          <span className="label">Platform Health</span>
          <div className="health-bar">
            <div className="health-fill" style={{ width: '85%' }}>85%</div>
          </div>
        </div>
        <div className="quick-stat">
          <span className="label">Content Moderation</span>
          <div className="health-bar">
            <div className="health-fill" style={{ width: '92%' }}>92%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== USERS MANAGEMENT ====================
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?search=${search}&page=${page}&limit=10`);
      setUsers(res.data.users);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    if (!window.confirm('Suspend this user?')) return;
    try {
      await api.put(`/admin/users/${userId}/suspend`);
      setToast({ type: 'success', message: 'User suspended' });
      fetchUsers();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to suspend user' });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone!')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setToast({ type: 'success', message: 'User deleted' });
      fetchUsers();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to delete user' });
    }
  };

  const handlePromote = async (userId) => {
    if (!window.confirm('Promote this user to admin?')) return;
    try {
      await api.put(`/admin/users/${userId}/promote`);
      setToast({ type: 'success', message: 'User promoted to admin' });
      fetchUsers();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to promote user' });
    }
  };

  return (
    <div className="admin-section">
      <h2>User Management</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by username, email, or name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td><strong>@{user.username}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.fullName || '-'}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handlePromote(user._id)}
                        className="btn btn-promote"
                        title="Promote to admin"
                      >
                        👑
                      </button>
                    )}
                    <button
                      onClick={() => handleSuspend(user._id)}
                      className="btn btn-warning"
                      title="Suspend user"
                    >
                      🚫
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-danger"
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

// ==================== PROJECTS MANAGEMENT ====================
function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [page, search, category]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/admin/projects?search=${search}&category=${category}&page=${page}&limit=10`
      );
      setProjects(res.data.projects);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to fetch projects' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (projectId) => {
    if (!window.confirm('Remove this project?')) return;
    try {
      await api.delete(`/admin/projects/${projectId}`);
      setToast({ type: 'success', message: 'Project removed' });
      fetchProjects();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to remove project' });
    }
  };

  const handleRestore = async (projectId) => {
    if (!window.confirm('Restore this project?')) return;
    try {
      await api.put(`/admin/projects/${projectId}/restore`);
      setToast({ type: 'success', message: 'Project restored' });
      fetchProjects();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to restore project' });
    }
  };

  const categories = ['Dev', 'Design', 'Web3', 'AI/ML', 'Game Dev', 'Motion', 'Open Source'];

  return (
    <div className="admin-section">
      <h2>Projects Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className={`category-badge ${project.category.toLowerCase()}`}>
                  {project.category}
                </span>
              </div>

              <p className="project-description">{project.description.substring(0, 100)}...</p>

              <div className="project-meta">
                <span>👤 {project.owner?.username}</span>
                <span>🤝 {project.collaborators?.length || 0} collaborators</span>
                <span>❤️ {project.likes?.length || 0} likes</span>
              </div>

              {project.isFlagged && (
                <div className={`flag-badge flag-${project.flagLevel}`}>
                  ⚠️ Flagged: {project.flagLevel}
                </div>
              )}

              <div className="card-actions">
                <button
                  onClick={() => handleRemove(project._id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
                {!project.isActive && (
                  <button
                    onClick={() => handleRestore(project._id)}
                    className="btn btn-success"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

// ==================== DESIGNS MANAGEMENT ====================
function AdminDesigns() {
  const [designs, setDesigns] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, [page]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/designs?page=${page}&limit=12`);
      setDesigns(res.data.designs);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to fetch designs' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (designId) => {
    try {
      await api.put(`/admin/designs/${designId}/approve`);
      setToast({ type: 'success', message: 'Design approved' });
      fetchDesigns();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to approve design' });
    }
  };

  const handleReject = async (designId) => {
    try {
      await api.put(`/admin/designs/${designId}/reject`);
      setToast({ type: 'success', message: 'Design rejected' });
      fetchDesigns();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to reject design' });
    }
  };

  return (
    <div className="admin-section">
      <h2>Design Moderation</h2>

      {loading ? (
        <div className="loading">Loading designs...</div>
      ) : (
        <div className="designs-grid">
          {designs.map(design => (
            <div key={design._id} className="design-card">
              {design.images?.[0] && (
                <img src={design.images[0].url} alt={design.title} className="design-image" />
              )}

              <div className="design-info">
                <h3>{design.title}</h3>
                <p className="design-owner">by @{design.owner?.username}</p>

                {design.isFlagged && (
                  <div className={`flag-badge flag-${design.flagLevel}`}>
                    ⚠️ {design.flagLevel}
                  </div>
                )}

                <div className="card-actions">
                  {!design.isApproved ? (
                    <>
                      <button
                        onClick={() => handleApprove(design._id)}
                        className="btn btn-success"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(design._id)}
                        className="btn btn-danger"
                      >
                        ❌ Reject
                      </button>
                    </>
                  ) : (
                    <span className="approved-badge">✅ Approved</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

// ==================== COMMENTS MANAGEMENT ====================
function AdminComments() {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [page]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/comments?page=${page}&limit=15`);
      setComments(res.data.comments);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to fetch comments' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commentId) => {
    try {
      await api.put(`/admin/comments/${commentId}/approve`);
      setToast({ type: 'success', message: 'Comment approved' });
      fetchComments();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to approve' });
    }
  };

  const handleReject = async (commentId) => {
    try {
      await api.put(`/admin/comments/${commentId}/reject`);
      setToast({ type: 'success', message: 'Comment rejected' });
      fetchComments();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to reject' });
    }
  };

  return (
    <div className="admin-section">
      <h2>Comment Moderation</h2>

      {loading ? (
        <div className="loading">Loading comments...</div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <strong>@{comment.author?.username}</strong>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </div>

              <p className="comment-text">{comment.text}</p>

              {comment.isFlagged && (
                <div className="flag-warning">⚠️ Flagged for review</div>
              )}

              <div className="card-actions">
                {!comment.isApproved ? (
                  <>
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="btn btn-success"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(comment._id)}
                      className="btn btn-danger"
                    >
                      ❌ Reject
                    </button>
                  </>
                ) : (
                  <span className="approved-badge">✅ Approved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

// ==================== REPORTS DASHBOARD ====================
function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [filter, page]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/reports?status=${filter}&page=${page}&limit=15`);
      setReports(res.data.reports);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to fetch reports' });
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId, action) => {
    try {
      await api.put(`/admin/reports/${reportId}/resolve`, { action });
      setToast({ type: 'success', message: 'Report resolved' });
      fetchReports();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to resolve report' });
    }
  };

  const statuses = ['pending', 'approved', 'rejected', 'resolved'];

  return (
    <div className="admin-section">
      <h2>User Reports</h2>

      <div className="status-filters">
        {statuses.map(status => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => {
              setFilter(status);
              setPage(1);
            }}
          >
            {status.toUpperCase()} ({status === 'pending' ? reports.length : 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : (
        <div className="reports-list">
          {reports.map(report => (
            <div key={report._id} className="report-item">
              <div className="report-header">
                <div>
                  <strong>@{report.reportedBy?.username}</strong> reported
                  <span className="report-type"> [{report.reportType}]</span>
                </div>
                <span className={`status-badge ${report.status}`}>
                  {report.status}
                </span>
              </div>

              <p className="report-reason">
                <strong>Reason:</strong> {report.reason}
              </p>

              {report.description && (
                <p className="report-description">{report.description}</p>
              )}

              <div className="report-meta">
                <small>Reported: {new Date(report.createdAt).toLocaleString()}</small>
              </div>

              {report.status === 'pending' && (
                <div className="card-actions">
                  <button
                    onClick={() => handleResolve(report._id, 'removed')}
                    className="btn btn-danger"
                  >
                    Remove Content
                  </button>
                  <button
                    onClick={() => handleResolve(report._id, 'suspended')}
                    className="btn btn-warning"
                  >
                    Suspend User
                  </button>
                  <button
                    onClick={() => handleResolve(report._id, 'no-action')}
                    className="btn btn-secondary"
                  >
                    No Action
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

// ==================== FLAGGED CONTENT QUEUE ====================
function AdminFlaggedQueue() {
  const [flaggedProjects, setFlaggedProjects] = useState([]);
  const [flaggedDesigns, setFlaggedDesigns] = useState([]);
  const [contentType, setContentType] = useState('projects');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchFlaggedContent();
  }, [contentType]);

  const fetchFlaggedContent = async () => {
    try {
      setLoading(true);
      const endpoint = contentType === 'projects' ? '/admin/projects' : '/admin/designs';
      const res = await api.get(endpoint);
      const flagged = res.data[contentType === 'projects' ? 'projects' : 'designs'].filter(
        item => item.isFlagged
      );

      if (contentType === 'projects') {
        setFlaggedProjects(flagged);
      } else {
        setFlaggedDesigns(flagged);
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to fetch flagged content' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      const endpoint = contentType === 'projects'
        ? `/admin/projects/${itemId}/approve`
        : `/admin/designs/${itemId}/approve`;
      await api.put(endpoint);
      setToast({ type: 'success', message: 'Content approved' });
      fetchFlaggedContent();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to approve' });
    }
  };

  const handleReject = async (itemId) => {
    try {
      const endpoint = contentType === 'projects'
        ? `/admin/projects/${itemId}/reject`
        : `/admin/designs/${itemId}/reject`;
      await api.put(endpoint);
      setToast({ type: 'success', message: 'Content rejected' });
      fetchFlaggedContent();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to reject' });
    }
  };

  const items = contentType === 'projects' ? flaggedProjects : flaggedDesigns;

  return (
    <div className="admin-section">
      <h2>Flagged Content Review Queue</h2>

      <div className="content-type-filter">
        <button
          className={`filter-btn ${contentType === 'projects' ? 'active' : ''}`}
          onClick={() => setContentType('projects')}
        >
          📌 Projects ({flaggedProjects.length})
        </button>
        <button
          className={`filter-btn ${contentType === 'designs' ? 'active' : ''}`}
          onClick={() => setContentType('designs')}
        >
          🎨 Designs ({flaggedDesigns.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading flagged content...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>✅ No flagged content to review!</p>
        </div>
      ) : (
        <div className="flagged-queue">
          {items.map(item => (
            <div key={item._id} className={`flag-item flag-${item.flagLevel}`}>
              <div className="flag-header">
                <div>
                  <h3>{item.title}</h3>
                  <p>by @{item.owner?.username}</p>
                </div>
                <span className={`flag-level-badge flag-${item.flagLevel}`}>
                  {item.flagLevel.toUpperCase()}
                </span>
              </div>

              <p className="flag-description">{item.description.substring(0, 150)}...</p>

              <div className="flag-reasons">
                <strong>Flagging Reasons:</strong>
                <ul>
                  {item.flags?.map((flag, idx) => (
                    <li key={idx}>• {flag.reason}</li>
                  ))}
                </ul>
              </div>

              <div className="card-actions">
                <button
                  onClick={() => handleApprove(item._id)}
                  className="btn btn-success"
                >
                  ✅ Approve & Publish
                </button>
                <button
                  onClick={() => handleReject(item._id)}
                  className="btn btn-danger"
                >
                  ❌ Reject & Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

// ==================== ACTIVITY LOGS ====================
function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/activity-logs?page=${page}&limit=20`);
      setLogs(res.data.logs);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to fetch logs' });
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('suspend')) return '🚫';
    if (action.includes('delete')) return '🗑️';
    if (action.includes('promote')) return '👑';
    if (action.includes('remove')) return '❌';
    if (action.includes('approve')) return '✅';
    return '📝';
  };

  return (
    <div className="admin-section">
      <h2>Activity Logs</h2>

      {loading ? (
        <div className="loading">Loading logs...</div>
      ) : (
        <div className="logs-timeline">
          {logs.map(log => (
            <div key={log._id} className="log-item">
              <div className="log-icon">{getActionIcon(log.action)}</div>
              <div className="log-content">
                <strong>{log.admin?.username}</strong>
                <p className="log-action">{log.action.replace(/_/g, ' ').toUpperCase()}</p>
                {log.details && (
                  <small className="log-details">
                    {JSON.stringify(log.details).substring(0, 100)}...
                  </small>
                )}
              </div>
              <div className="log-time">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}
