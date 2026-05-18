/**
 * ============================================
 * PPS Payroll — Logger Utility (Morgan + Console)
 * ============================================
 * Provides structured, colored console logging
 * and exports the Morgan HTTP request logger middleware.
 */
import morgan from 'morgan';

// ── Color Codes ──
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
};

// ── Timestamp Helper ──
const timestamp = () => new Date().toISOString();

/**
 * Application Logger
 * Usage: logger.info('Server started'), logger.error('Failed', err)
 */
const logger = {
    info: (message, ...args) => {
        console.log(`${colors.green}[INFO]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} ${message}`, ...args);
    },

    warn: (message, ...args) => {
        console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} ${message}`, ...args);
    },

    error: (message, ...args) => {
        console.error(`${colors.red}[ERROR]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} ${message}`, ...args);
    },

    debug: (message, ...args) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`${colors.cyan}[DEBUG]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} ${message}`, ...args);
        }
    },

    request: (message, ...args) => {
        console.log(`${colors.magenta}[HTTP]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} ${message}`, ...args);
    },
};

/**
 * Morgan HTTP Request Logger Middleware
 * Logs method, URL, status, and response time in color.
 */
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
const httpLogger = morgan(morganFormat, {
    stream: {
        write: (msg) => logger.request(msg.trim()),
    },
});

export { logger, httpLogger };
export default logger;
