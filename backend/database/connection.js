/**
 * ============================================
 * PPS Payroll — Database Configuration
 * ============================================
 * Establishes MongoDB connection with Mongoose.
 * Includes retry logic and connection event handlers.
 */
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 2000;

const connectDB = async (retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY) => {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        logger.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }

    const mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4, // Use IPv4, skip trying IPv6
    };

    try {
        const conn = await mongoose.connect(MONGO_URI, mongooseOptions);

        logger.info(`MongoDB connected → ${conn.connection.host}/${conn.connection.name}`);

        // ── Connection Event Handlers ──
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting reconnection...');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected successfully');
        });

        // ── Graceful Shutdown ──
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed (app shutdown)');
            process.exit(0);
        });

    } catch (error) {
        logger.error(`Failed to connect to MongoDB: ${error.message}`);
        
        if (retries === 0) {
            logger.error('Max connection retries reached. Exiting...');
            process.exit(1);
        }

        logger.info(`Retrying connection in ${delay / 1000} seconds... (${retries} retries left)`);
        setTimeout(() => connectDB(retries - 1, delay * 2), delay);
    }
};

export default connectDB;
