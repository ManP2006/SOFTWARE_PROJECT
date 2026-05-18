/**
 * ============================================
 * PPS Payroll — Express Application Setup
 * ============================================
 * Configures Express with all middleware, security,
 * logging, routes, and error handling.
 * Separated from server.js for testability.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import corsOptions from './config/cors.js';
import { httpLogger } from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

const app = express();

// ═══════════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════════
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Disable CSP for dev
}));
app.use(cors(corsOptions));

// Express 5 Compatibility for express-mongo-sanitize (makes req.query mutable)
app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next();
});

// NoSQL Injection Prevention
app.use(mongoSanitize());

// Rate Limiting (Global)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', globalLimiter);

// ═══════════════════════════════════════════
// PARSING MIDDLEWARE
// ═══════════════════════════════════════════
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ═══════════════════════════════════════════
// LOGGING MIDDLEWARE
// ═══════════════════════════════════════════
app.use(httpLogger);

// ═══════════════════════════════════════════
// API ROUTES — Versioned (v1) — NEW architecture
// ═══════════════════════════════════════════
app.use('/api/v1', apiRoutes);

// ═══════════════════════════════════════════
// API ROUTES — Legacy (backward compatibility)
// Frontend currently calls /api/* directly.
// Both v1 and legacy use the same controllers.
// ═══════════════════════════════════════════
app.use('/api', apiRoutes);

// ═══════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════
app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        message: '✅ PPS Payroll API is running',
        version: '1.0.0',
        endpoints: {
            v1: '/api/v1',
            legacy: '/api',
        },
    });
});

// ═══════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ═══════════════════════════════════════════
// GLOBAL ERROR HANDLER (must be last)
// ═══════════════════════════════════════════
app.use(errorHandler);

export default app;
