/**
 * ============================================
 * PPS Payroll — Custom API Error Class
 * ============================================
 * Extends the native Error class to include
 * HTTP status codes, error codes, and stack traces.
 * Used with the global error handler middleware.
 */
class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500)
     * @param {string} message    - Human-readable error message
     * @param {string} [code]     - Machine-readable error code (e.g. 'EMPLOYEE_NOT_FOUND')
     * @param {Array}  [errors]   - Array of detailed validation errors
     */
    constructor(statusCode, message, code = null, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        this.isOperational = true; // Distinguishes from programming errors

        Error.captureStackTrace(this, this.constructor);
    }

    // --- Factory Methods ---

    static badRequest(message = 'Bad request', code = 'BAD_REQUEST') {
        return new ApiError(400, message, code);
    }

    static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
        return new ApiError(401, message, code);
    }

    static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
        return new ApiError(403, message, code);
    }

    static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
        return new ApiError(404, message, code);
    }

    static conflict(message = 'Conflict', code = 'CONFLICT') {
        return new ApiError(409, message, code);
    }

    static validationError(message = 'Validation failed', errors = []) {
        return new ApiError(422, message, 'VALIDATION_ERROR', errors);
    }

    static internal(message = 'Internal server error', code = 'INTERNAL_ERROR') {
        return new ApiError(500, message, code);
    }
}

export default ApiError;
