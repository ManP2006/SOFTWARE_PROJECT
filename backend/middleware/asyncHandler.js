/**
 * ============================================
 * PPS Payroll — Async Handler Wrapper
 * ============================================
 * Wraps async route handlers to catch errors
 * and pass them to the global error handler.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
