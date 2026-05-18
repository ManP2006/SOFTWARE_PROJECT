/**
 * ============================================
 * PPS Payroll — Environment Configuration
 * ============================================
 * Validates required environment variables at startup.
 */
import logger from '../utils/logger.js';

const requiredVars = ['MONGO_URI'];

const validateEnv = () => {
    const missing = requiredVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        logger.error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }

    // Set defaults for optional variables
    process.env.PORT = process.env.PORT || '8080';
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'pps-payroll-jwt-secret-2026-secure-key';

    logger.info(`Environment: ${process.env.NODE_ENV} | Port: ${process.env.PORT}`);
};

export default validateEnv;
