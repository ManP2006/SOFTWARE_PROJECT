/**
 * ============================================
 * PPS Payroll — Standardized API Response
 * ============================================
 * Ensures ALL API responses follow the same shape:
 * { success, statusCode, message, data, meta }
 */
class ApiResponse {
    /**
     * @param {number}  statusCode - HTTP status code
     * @param {string}  message    - Human-readable message
     * @param {*}       [data]     - Response payload
     * @param {Object}  [meta]     - Pagination, counts, etc.
     */
    constructor(statusCode, message, data = null, meta = null) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        if (meta) this.meta = meta;
    }

    // --- Factory Methods ---

    static ok(message = 'Success', data = null, meta = null) {
        return new ApiResponse(200, message, data, meta);
    }

    static created(message = 'Created successfully', data = null) {
        return new ApiResponse(201, message, data);
    }

    static noContent(message = 'No content') {
        return new ApiResponse(204, message);
    }

    /**
     * Send the response via Express res object
     * @param {import('express').Response} res
     */
    send(res) {
        const body = {
            success: this.success,
            message: this.message,
        };
        if (this.data !== null && this.data !== undefined) body.data = this.data;
        if (this.meta) body.meta = this.meta;

        return res.status(this.statusCode).json(body);
    }
}

export default ApiResponse;
