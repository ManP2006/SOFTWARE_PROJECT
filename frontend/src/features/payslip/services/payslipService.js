/**
 * ==============================================
 * PPS PAYROLL — Payslip Service
 * ==============================================
 * 
 * Handles all payslip-related API calls.
 * Connected to Node.js + Express + MongoDB backend.
 * 
 * Endpoints:
 *   GET    /api/payslips            → List all payslips
 *   GET    /api/payslips/:id        → Get single payslip
 *   POST   /api/payslips            → Create payslip
 *   PUT    /api/payslips/:id        → Update payslip
 *   DELETE /api/payslips/:id        → Delete payslip
 *   POST   /api/payslips/seed       → Seed database
 */

const PayslipService = {
    /**
     * Fetch all payslips from MongoDB
     * @returns {Array} List of payslip documents
     */
    getAll: async function () {
        try {
            return await window.apiClient.get('/payslips');
        } catch (error) {
            console.warn('[PayslipService] API unavailable, using local data:', error.message);
            // Graceful fallback to local employee data if backend is down
            return this._getLocalFallback();
        }
    },

    /**
     * Fetch payslips for a specific employee
     * @param {string} empId - Employee ID (e.g., "PPS001")
     */
    getByEmployee: async function (empId) {
        try {
            const all = await window.apiClient.get('/payslips');
            return all.filter(p => p.employeeId === empId);
        } catch (error) {
            console.warn('[PayslipService] Fallback for employee:', empId);
            const all = this._getLocalFallback();
            return all.filter(p => p.employeeId === empId);
        }
    },

    /**
     * Get a single payslip by MongoDB _id
     * @param {string} payslipId - MongoDB document ID
     */
    getById: async function (payslipId) {
        try {
            return await window.apiClient.get('/payslips/' + payslipId);
        } catch (error) {
            console.warn('[PayslipService] getById failed:', error.message);
            return null;
        }
    },

    /**
     * Create a new payslip
     * @param {Object} payslipData - Payslip document fields
     */
    create: async function (payslipData) {
        return await window.apiClient.post('/payslips', payslipData);
    },

    /**
     * Update an existing payslip
     * @param {string} payslipId - MongoDB document ID
     * @param {Object} payslipData - Updated fields
     */
    update: async function (payslipId, payslipData) {
        return await window.apiClient.put('/payslips/' + payslipId, payslipData);
    },

    /**
     * Delete a payslip
     * @param {string} payslipId - MongoDB document ID
     */
    delete: async function (payslipId) {
        return await window.apiClient.delete('/payslips/' + payslipId);
    },

    /**
     * Seed the database with sample payslips
     * Call this once to populate MongoDB with test data
     */
    seed: async function () {
        return await window.apiClient.post('/payslips/seed');
    },

    /**
     * Download payslip as PDF (client-side via html2pdf.js)
     * @param {string} payslipId
     */
    downloadPdf: function (payslipId) {
        console.log('[PayslipService] PDF download for:', payslipId);
        // Client-side PDF generation handled by PayslipModal
    },

    /**
     * Local fallback when backend is unavailable
     * Uses runtime employee data from helpers.js
     * @private
     */
    _getLocalFallback: function () {
        if (typeof window.employees !== 'undefined' && window.employees) {
            return window.employees.map(emp => ({
                _id: emp.id,
                employeeId: emp.id,
                employeeName: emp.name,
                position: emp.role,
                department: emp.dept,
                period: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                earnings: [
                    { label: 'Basic Salary', amount: Math.round((emp.monthlySalary || 50000) * 0.5) },
                    { label: 'House Rent Allowance', amount: Math.round((emp.monthlySalary || 50000) * 0.2) },
                    { label: 'Special Allowance', amount: Math.round((emp.monthlySalary || 50000) * 0.3) },
                ],
                deductions: [
                    { label: 'Provident Fund', amount: Math.round((emp.monthlySalary || 50000) * 0.04) },
                    { label: 'Professional Tax', amount: 200 },
                ],
                payment: { method: 'Bank Transfer', account: 'XXXX' + emp.id.slice(-4) },
            }));
        }
        return [];
    },
};

// Expose globally
window.PayslipService = PayslipService;
