const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            credentials: 'include', // Include cookies for session authentication
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                // Handle rate limiting specifically
                if (response.status === 429) {
                    throw new Error(data.message || 'Rate limit exceeded. Please wait before submitting again.');
                }
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Get submission statistics for rate limiting feedback
    async getSubmissionStats() {
        return this.request('/submission/stats');
    }

    // Authentication
    async login(username, password) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    async logout() {
        return this.request('/logout', {
            method: 'POST',
        });
    }

    // Form submissions
    async submitUltra(formData) {
        const url = `${this.baseURL}/submit/ultra`;
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include', // Include cookies for session authentication
            body: formData, // FormData for file uploads
        });
        
        if (!response.ok) {
            const error = await response.json();
            // Handle rate limiting specifically
            if (response.status === 429) {
                throw new Error(error.message || 'Rate limit exceeded. Please wait before submitting again.');
            }
            throw new Error(error.message || 'Submission failed');
        }
        
        return response.json();
    }

    async submitGeneral(formData) {
        const url = `${this.baseURL}/submit/general`;
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include', // Include cookies for session authentication
            body: formData,
        });
        
        if (!response.ok) {
            const error = await response.json();
            // Handle rate limiting specifically
            if (response.status === 429) {
                throw new Error(error.message || 'Rate limit exceeded. Please wait before submitting again.');
            }
            throw new Error(error.message || 'Submission failed');
        }
        
        return response.json();
    }

    async submitFunding(formData) {
        const url = `${this.baseURL}/submit/funding`;
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include', // Include cookies for session authentication
            body: formData,
        });
        
        if (!response.ok) {
            const error = await response.json();
            // Handle rate limiting specifically
            if (response.status === 429) {
                throw new Error(error.message || 'Rate limit exceeded. Please wait before submitting again.');
            }
            throw new Error(error.message || 'Submission failed');
        }
        
        return response.json();
    }

    async submitJob(formData) {
        const url = `${this.baseURL}/submit/job`;
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include', // Include cookies for session authentication
            body: formData,
        });
        
        if (!response.ok) {
            const error = await response.json();
            // Handle rate limiting specifically
            if (response.status === 429) {
                throw new Error(error.message || 'Rate limit exceeded. Please wait before submitting again.');
            }
            throw new Error(error.message || 'Submission failed');
        }
        
        return response.json();
    }

    // Admin panel
    async getSubmissions(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/admin/submissions?${params}`);
    }

    async getSubmission(id) {
        return this.request(`/admin/submissions/${id}`);
    }

    async reviewSubmission(id, status, feedback = '', adminNotes = '') {
        return this.request(`/admin/submissions/${id}/review`, {
            method: 'POST',
            body: JSON.stringify({ status, feedback, admin_notes: adminNotes }),
        });
    }

    async updateSubmission(id, data) {
        return this.request(`/admin/submissions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteSubmission(id) {
        return this.request(`/admin/submissions/${id}`, {
            method: 'DELETE',
        });
    }

    async getAdminStats() {
        return this.request('/admin/stats');
    }

    // Public opportunities
    async getOpportunities(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/opportunities?${params}`);
    }

    async getOpportunity(id) {
        return this.request(`/opportunities/${id}`);
    }

    // Helper method to create FormData from object
    createFormData(data) {
        const formData = new FormData();
        
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else {
                    formData.append(key, data[key].toString());
                }
            }
        });
        
        return formData;
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 