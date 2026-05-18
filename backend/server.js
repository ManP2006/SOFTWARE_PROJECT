/**
 * ============================================
 * PPS Payroll — Server Entry Point
 * ============================================
 * Loads environment, validates config, connects
 * to the database, and starts the Express server.
 */
import 'dotenv/config';
import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import app from './app.js';
import connectDB from './database/connection.js';
import validateEnv from './config/env.js';
import logger from './utils/logger.js';

// ── Validate environment ──
validateEnv();

// ── Connect to database ──
await connectDB();

// ── Start server ──
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    logger.info(`✅ PPS Server  →  http://localhost:${PORT}`);
    logger.info(`📡 API v1      →  http://localhost:${PORT}/api/v1`);
    logger.info(`📡 API Legacy  →  http://localhost:${PORT}/api`);
});

// ── Unhandled Rejections ──
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});