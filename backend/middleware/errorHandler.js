/**
 * ============================================
 * PPS Payroll — Global Error Handler Middleware
 * ============================================
 * Catches all errors thrown/forwarded from routes,
 * formats them into a consistent JSON response.
 * Must be registered LAST in the middleware chain.
 */
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let code = err.code || 'INTERNAL_ERROR';
    let errors = err.errors || [];

    // ── Mongoose Validation Error ──
    if (err.name === 'ValidationError') {
        statusCode = 422;
        code = 'VALIDATION_ERROR';
        message = 'Validation failed';
        errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
            value: e.value,
        }));
    }

    // ── Mongoose Cast Error (bad ObjectId) ──
    if (err.name === 'CastError') {
        statusCode = 400;
        code = 'INVALID_ID';
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // ── Mongoose Duplicate Key Error ──
    if (err.code === 11000) {
        statusCode = 409;
        code = 'DUPLICATE_KEY';
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for '${field}': '${err.keyValue[field]}'`;
    }

    // ── JWT Errors ──
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = 'INVALID_TOKEN';
        message = 'Invalid authentication token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = 'TOKEN_EXPIRED';
        message = 'Authentication token has expired';
    }

    // ── Log Error ──
    if (statusCode >= 500) {
        logger.error(`[${req.method}] ${req.originalUrl} → ${statusCode} ${message}`);
        if (process.env.NODE_ENV !== 'production') {
            logger.error(err.stack);
        }
    } else {
        logger.warn(`[${req.method}] ${req.originalUrl} → ${statusCode} ${message}`);
    }

    // ── Send Response ──
    const response = {
        success: false,
        statusCode,
        code,
        message,
    };

    if (errors.length > 0) response.errors = errors;

    // Include stack trace in development only
    if (process.env.NODE_ENV !== 'production' && err.stack) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
