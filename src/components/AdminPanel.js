import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import useNotifications from '../hooks/useNotifications';
import NotificationContainer from './Notification';
import './AdminPanel.css';

const AdminPanel = ({ onClose }) => {
    const notifications = useNotifications();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        source: 'all',
        page: 1
    });

    // Login form state
    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    });

    // Review form state
    const [reviewForm, setReviewForm] = useState({
        status: 'approved',
        feedback: '',
        adminNotes: ''
    });

    // Detailed view modal state
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingSubmission, setEditingSubmission] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [submissionsData, statsData] = await Promise.all([
                apiService.getSubmissions(filters),
                apiService.getAdminStats()
            ]);
            setSubmissions(submissionsData.submissions);
            setStats(statsData.stats);
        } catch (error) {
            console.error('Error loading data:', error);
            if (error.message.includes('Unauthorized')) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsLoggedIn(true);
            loadData();
        }
    }, [loadData]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await apiService.login(loginForm.username, loginForm.password);
            setIsLoggedIn(true);
            setUser(response.user);
            localStorage.setItem('adminToken', 'logged-in');
            loadData();
        } catch (error) {
            notifications.showError('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setSubmissions([]);
        setStats({});
        localStorage.removeItem('adminToken');
    };

    const handleReview = async (submissionId) => {
        try {
            setLoading(true);
            await apiService.reviewSubmission(
                submissionId,
                reviewForm.status,
                reviewForm.feedback,
                reviewForm.adminNotes
            );
            notifications.showSuccess(`Submission ${reviewForm.status} successfully!`);
            setReviewForm({ status: 'approved', feedback: '', adminNotes: '' });
            loadData();
        } catch (error) {
            notifications.showError('Review failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (submissionId) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                setLoading(true);
                await apiService.deleteSubmission(submissionId);
                notifications.showSuccess('Submission deleted successfully!');
                loadData();
            } catch (error) {
                notifications.showError('Delete failed: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    // New functions for detailed view
    const openDetailModal = async (submission) => {
        try {
            setLoading(true);
            // Get full submission details
            const response = await apiService.getSubmission(submission.id);
            setSelectedSubmission(response.submission);
            setEditingSubmission({ ...response.submission });
            setShowDetailModal(true);
        } catch (error) {
            notifications.showError('Error loading submission details: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedSubmission(null);
        setEditingSubmission(null);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setEditingSubmission({ ...selectedSubmission });
        }
    };

    const handleEditChange = (field, value) => {
        setEditingSubmission(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            // Filter out datetime fields that should be handled by the backend
            const { updated_at, created_at, reviewed_at, ...updateData } = editingSubmission;
            await apiService.updateSubmission(editingSubmission.id, updateData);
            notifications.showSuccess('Changes saved successfully!');
            setSelectedSubmission(editingSubmission);
            setIsEditing(false);
            loadData(); // Refresh the list
        } catch (error) {
            notifications.showError('Error saving changes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveFromDetail = async () => {
        try {
            setLoading(true);
            await apiService.reviewSubmission(
                selectedSubmission.id,
                'approved',
                reviewForm.feedback,
                reviewForm.adminNotes
            );
            notifications.showSuccess('Submission approved successfully!');
            closeDetailModal();
            loadData();
        } catch (error) {
            notifications.showError('Approval failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectFromDetail = async () => {
        try {
            setLoading(true);
            await apiService.reviewSubmission(
                selectedSubmission.id,
                'rejected',
                reviewForm.feedback,
                reviewForm.adminNotes
            );
            notifications.showSuccess('Submission rejected successfully!');
            closeDetailModal();
            loadData();
        } catch (error) {
            notifications.showError('Rejection failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            loadData();
        }
    }, [isLoggedIn, loadData]);

    if (!isLoggedIn) {
        return (
            <div className="admin-login">
                <div className="login-card">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-info">
                    <span>Welcome, {user?.username}!</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                    {onClose && (
                        <button onClick={onClose} className="close-btn">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Submissions</h3>
                    <p>{stats.total_submissions || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Review</h3>
                    <p>{stats.pending || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Approved</h3>
                    <p>{stats.approved || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Rejected</h3>
                    <p>{stats.rejected || 0}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters">
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
                <select
                    value={filters.source}
                    onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                    <option value="all">All Sources</option>
                    <option value="ultra">Ultra</option>
                    <option value="general">General</option>
                    <option value="funding">Funding</option>
                    <option value="job">Job</option>
                </select>
            </div>

            {/* Submissions List */}
            <div className="submissions-list">
                <h2>Submissions</h2>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : submissions.length === 0 ? (
                    <div className="no-submissions">No submissions found.</div>
                ) : (
                    submissions.map(submission => (
                        <div key={submission.id} className="submission-card">
                            <div className="submission-header">
                                <div className="submission-title-section">
                                    <h3>{submission.title}</h3>
                                    <div className="submission-meta">
                                        <span className={`status ${submission.status}`}>
                                            {submission.status}
                                        </span>
                                        <span className="source">{submission.source}</span>
                                        <span className="date">
                                            {new Date(submission.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="submission-actions-compact">
                                    <button
                                        onClick={() => openDetailModal(submission)}
                                        className="view-details-btn"
                                        disabled={loading}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(submission.id)}
                                        className="delete-btn"
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            
                            <div className="submission-details-compact">
                                <div className="detail-row">
                                    <span className="detail-label">Company:</span>
                                    <span className="detail-value">{submission.company}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Description:</span>
                                    <span className="detail-value">{submission.description}</span>
                                </div>
                                {submission.location && (
                                    <div className="detail-row">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{submission.location}</span>
                                    </div>
                                )}
                                {submission.compensation && (
                                    <div className="detail-row">
                                        <span className="detail-label">Compensation:</span>
                                        <span className="detail-value">{submission.compensation}</span>
                                    </div>
                                )}
                            </div>

                            {submission.status === 'pending' && (
                                <div className="review-form-compact">
                                    <div className="review-controls">
                                        <select
                                            value={reviewForm.status}
                                            onChange={(e) => setReviewForm(prev => ({ ...prev, status: e.target.value }))}
                                            className="review-select"
                                        >
                                            <option value="approved">Approve</option>
                                            <option value="rejected">Reject</option>
                                        </select>
                                        <button
                                            onClick={() => handleReview(submission.id)}
                                            disabled={loading}
                                            className="review-submit-btn"
                                        >
                                            {loading ? 'Processing...' : 'Submit Review'}
                                        </button>
                                    </div>
                                    <div className="review-fields">
                                        <input
                                            type="text"
                                            placeholder="Quick feedback (optional)"
                                            value={reviewForm.feedback}
                                            onChange={(e) => setReviewForm(prev => ({ ...prev, feedback: e.target.value }))}
                                            className="review-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Admin notes (optional)"
                                            value={reviewForm.adminNotes}
                                            onChange={(e) => setReviewForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                                            className="review-input"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Detailed View Modal */}
            {showDetailModal && selectedSubmission && (
                <div className="modal-overlay" onClick={closeDetailModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Submission Details</h2>
                            <button className="modal-close" onClick={closeDetailModal}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            {isEditing ? (
                                // Edit Form
                                <div className="edit-form">
                                    <div className="form-section">
                                        <h3>Basic Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Title:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.title || ''}
                                                    onChange={(e) => handleEditChange('title', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Company:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.company || ''}
                                                    onChange={(e) => handleEditChange('company', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Description:</label>
                                            <textarea
                                                value={editingSubmission.description || ''}
                                                onChange={(e) => handleEditChange('description', e.target.value)}
                                                rows="4"
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Location:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.location || ''}
                                                    onChange={(e) => handleEditChange('location', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Type:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.type || ''}
                                                    onChange={(e) => handleEditChange('type', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h3>Requirements & Details</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>GPA Requirement:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.gpa_requirement || ''}
                                                    onChange={(e) => handleEditChange('gpa_requirement', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Grade Levels:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.grade_levels || ''}
                                                    onChange={(e) => handleEditChange('grade_levels', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Skills:</label>
                                            <textarea
                                                value={editingSubmission.skills || ''}
                                                onChange={(e) => handleEditChange('skills', e.target.value)}
                                                rows="3"
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Compensation:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.compensation || ''}
                                                    onChange={(e) => handleEditChange('compensation', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Application Deadline:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.application_deadline || ''}
                                                    onChange={(e) => handleEditChange('application_deadline', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h3>Company Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Company Website:</label>
                                                <input
                                                    type="url"
                                                    value={editingSubmission.company_website || ''}
                                                    onChange={(e) => handleEditChange('company_website', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Company Size:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.company_size || ''}
                                                    onChange={(e) => handleEditChange('company_size', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Industry:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.industry || ''}
                                                    onChange={(e) => handleEditChange('industry', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Company Location:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.company_location || ''}
                                                    onChange={(e) => handleEditChange('company_location', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h3>Application Information</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Application Link:</label>
                                                <input
                                                    type="url"
                                                    value={editingSubmission.application_link || ''}
                                                    onChange={(e) => handleEditChange('application_link', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Application Method:</label>
                                                <input
                                                    type="text"
                                                    value={editingSubmission.application_method || ''}
                                                    onChange={(e) => handleEditChange('application_method', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Application Instructions:</label>
                                            <textarea
                                                value={editingSubmission.application_instructions || ''}
                                                onChange={(e) => handleEditChange('application_instructions', e.target.value)}
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Read-only View
                                <div className="detail-view">
                                    <div className="detail-section">
                                        <h3>Basic Information</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Title:</label>
                                                <span>{selectedSubmission.title}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Company:</label>
                                                <span>{selectedSubmission.company}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Description:</label>
                                                <span>{selectedSubmission.description}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Location:</label>
                                                <span>{selectedSubmission.location || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Type:</label>
                                                <span>{selectedSubmission.type || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Requirements & Details</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>GPA Requirement:</label>
                                                <span>{selectedSubmission.gpa_requirement || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Grade Levels:</label>
                                                <span>{selectedSubmission.grade_levels || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Skills:</label>
                                                <span>{selectedSubmission.skills || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Compensation:</label>
                                                <span>{selectedSubmission.compensation || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Application Deadline:</label>
                                                <span>{selectedSubmission.application_deadline || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Company Information</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Company Website:</label>
                                                <span>
                                                    {selectedSubmission.company_website ? (
                                                        <a href={selectedSubmission.company_website} target="_blank" rel="noopener noreferrer">
                                                            {selectedSubmission.company_website}
                                                        </a>
                                                    ) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Company Size:</label>
                                                <span>{selectedSubmission.company_size || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Industry:</label>
                                                <span>{selectedSubmission.industry || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Company Location:</label>
                                                <span>{selectedSubmission.company_location || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Application Information</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Application Link:</label>
                                                <span>
                                                    {selectedSubmission.application_link ? (
                                                        <a href={selectedSubmission.application_link} target="_blank" rel="noopener noreferrer">
                                                            {selectedSubmission.application_link}
                                                        </a>
                                                    ) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Application Method:</label>
                                                <span>{selectedSubmission.application_method || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Application Instructions:</label>
                                                <span>{selectedSubmission.application_instructions || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Submitter Information</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Submitter Name:</label>
                                                <span>{selectedSubmission.submitter_name || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Submitter Email:</label>
                                                <span>{selectedSubmission.submitter_email || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Submitter Phone:</label>
                                                <span>{selectedSubmission.submitter_phone || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Submitter Role:</label>
                                                <span>{selectedSubmission.submitter_role || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>Submission Metadata</h3>
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Status:</label>
                                                <span className={`status ${selectedSubmission.status}`}>
                                                    {selectedSubmission.status}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Source:</label>
                                                <span className="source">{selectedSubmission.source}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Created:</label>
                                                <span>{new Date(selectedSubmission.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Updated:</label>
                                                <span>{selectedSubmission.updated_at ? new Date(selectedSubmission.updated_at).toLocaleString() : 'N/A'}</span>
                                            </div>
                                            {selectedSubmission.reviewed_by && (
                                                <div className="detail-item">
                                                    <label>Reviewed By:</label>
                                                    <span>{selectedSubmission.reviewed_by}</span>
                                                </div>
                                            )}
                                            {selectedSubmission.reviewed_at && (
                                                <div className="detail-item">
                                                    <label>Reviewed At:</label>
                                                    <span>{new Date(selectedSubmission.reviewed_at).toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveChanges}
                                        className="save-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        className="cancel-btn"
                                        disabled={loading}
                                    >
                                        Cancel Edit
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleEditToggle}
                                        className="edit-btn"
                                        disabled={loading}
                                    >
                                        Edit Submission
                                    </button>
                                    {selectedSubmission.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={handleApproveFromDetail}
                                                className="approve-btn"
                                                disabled={loading}
                                            >
                                                {loading ? 'Processing...' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={handleRejectFromDetail}
                                                className="reject-btn"
                                                disabled={loading}
                                            >
                                                {loading ? 'Processing...' : 'Reject'}
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                            <button
                                onClick={closeDetailModal}
                                className="close-btn"
                                disabled={loading}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Notification Container */}
            <NotificationContainer 
                notifications={notifications.notifications} 
                onClose={notifications.removeNotification} 
            />
        </div>
    );
};

export default AdminPanel; 