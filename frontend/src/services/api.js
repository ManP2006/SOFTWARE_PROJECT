/**
 * ==============================================
 * PPS PAYROLL — Global API Client
 * ==============================================
 * 
 * Centralized HTTP client for all backend API calls.
 * All feature-level services (auth, payslip, dashboard, profile)
 * use this client for consistent error handling, headers, and base URL.
 * 
 * SETUP:
 *   - Update API_BASE_URL when deploying to production
 *   - JWT token is auto-attached from localStorage
 * 
 * USAGE:
 *   const users = await window.apiClient.get('/users');
 *   const result = await window.apiClient.post('/auth/login', { email, password });
 */

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Get the stored JWT token for authenticated requests
 */
function getAuthToken() {
    return localStorage.getItem('pps-auth-token') || '';
}

/**
 * Build standard headers for all API requests
 */
function getHeaders(contentType = 'application/json') {
    const headers = {
        'Content-Type': contentType,
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

/**
 * Centralized response handler
 * Parses JSON, handles common HTTP errors, and standardizes error shape.
 */
async function handleResponse(response) {
    if (response.status === 401) {
        // Token expired or unauthorized — clear session
        localStorage.removeItem('pps-auth-token');
        window.showToast?.('Session expired. Please sign in again.', 'warning');
        window.showLandingView?.();
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody.message || `Request failed (${response.status})`;
        throw new Error(message);
    }

    // Handle 204 No Content
    if (response.status === 204) return null;

    return response.json();
}

/**
 * Global API Client
 * Exposes RESTful methods: get, post, put, patch, delete
 */
const apiClient = {
    /**
     * GET request
     * @param {string} endpoint - API path (e.g., '/users')
     * @param {Object} [params] - Optional query parameters
     */
    get: async function (endpoint, params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}${endpoint}${query ? '?' + query : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    /**
     * POST request
     * @param {string} endpoint - API path
     * @param {Object} data - Request body
     */
    post: async function (endpoint, data = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    /**
     * PUT request (full update)
     * @param {string} endpoint - API path
     * @param {Object} data - Request body
     */
    put: async function (endpoint, data = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    /**
     * PATCH request (partial update)
     * @param {string} endpoint - API path
     * @param {Object} data - Partial update body
     */
    patch: async function (endpoint, data = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    /**
     * DELETE request
     * @param {string} endpoint - API path
     */
    delete: async function (endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    /**
     * Upload file (multipart/form-data)
     * @param {string} endpoint - API path
     * @param {FormData} formData - Form data with file(s)
     */
    upload: async function (endpoint, formData) {
        const headers = {};
        const token = getAuthToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
        // Do NOT set Content-Type — browser sets it with boundary automatically

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });
        return handleResponse(response);
    },
};

// Expose globally for use by all feature services and scripts
window.apiClient = apiClient;

console.log('[PPS] API Client initialized — Base URL:', API_BASE_URL);
