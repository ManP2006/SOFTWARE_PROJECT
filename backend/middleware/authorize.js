/**
 * ============================================
 * PPS Payroll — Role-Based Access Middleware
 * ============================================
 * Usage: router.get('/admin-only', authenticate, authorize('admin'), handler);
 */
import ApiError from '../utils/ApiError.js';

const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user || !req.user.role) {
            throw ApiError.unauthorized('Authentication required.');
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw ApiError.forbidden(
                `Access denied. Required role: ${allowedRoles.join(' or ')}`
            );
        }

        next();
    };
};

export default authorize;
