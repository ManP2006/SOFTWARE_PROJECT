/**
 * ============================================
 * PPS Payroll — JWT Authentication Middleware
 * ============================================
 * Verifies Bearer token from Authorization header.
 * On success: attaches req.user = { id, role }
 */
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pps-payroll-jwt-secret-2026-secure-key';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ApiError.unauthorized('Authentication required. No token provided.');
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw ApiError.unauthorized('Token expired. Please sign in again.');
        }
        throw ApiError.unauthorized('Invalid authentication token.');
    }
};

export default authenticate;
