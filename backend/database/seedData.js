/**
 * PPS Payroll — Database Seeder
 * Seeds MongoDB with realistic sample data.
 * Run: node database/seedData.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { Admin, Employee, LeaveType, Holiday, Settings } from '../models/index.js';
import logger from '../utils/logger.js';

async function seed() {
    try {
        logger.info('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('Connected!');

        // 1. Admin
        const existingAdmin = await Admin.findOne({ email: 'admin@pps.com' });
        if (!existingAdmin) {
            await Admin.create({ name: 'Admin User', email: 'admin@pps.com', password: 'admin123', phone: '+91 9876543210', role: 'Administrator', gender: 'Male' });
            logger.info('Admin seeded (admin@pps.com / admin123)');
        } else { logger.info('Admin already exists — skipping'); }

        // 2. Leave Types
        if ((await LeaveType.countDocuments()) === 0) {
            await LeaveType.insertMany([
                { name: 'Privilege Leave', description: 'Annual earned leave', maxDaysPerYear: 15, isPaid: true, carryForward: true, color: '#6366f1' },
                { name: 'Sick Leave', description: 'For medical issues', maxDaysPerYear: 12, isPaid: true, carryForward: false, color: '#ef4444' },
                { name: 'Casual Leave', description: 'For personal contingencies', maxDaysPerYear: 10, isPaid: true, carryForward: false, color: '#f59e0b' },
                { name: 'Loss of Pay', description: 'Leave without pay', maxDaysPerYear: 365, isPaid: false, carryForward: false, color: '#64748b' },
            ]);
            logger.info('Leave types seeded');
        }

        // 3. Holidays
        if ((await Holiday.countDocuments()) === 0) {
            const y = new Date().getFullYear();
            await Holiday.insertMany([
                { name: 'Republic Day', date: new Date(y,0,26), type: 'Public' },
                { name: 'Holi', date: new Date(y,2,14), type: 'Public' },
                { name: 'Good Friday', date: new Date(y,3,18), type: 'Public' },
                { name: 'Independence Day', date: new Date(y,7,15), type: 'Public' },
                { name: 'Gandhi Jayanti', date: new Date(y,9,2), type: 'Public' },
                { name: 'Diwali', date: new Date(y,9,20), type: 'Public' },
                { name: 'Christmas', date: new Date(y,11,25), type: 'Public' },
            ]);
            logger.info('Holidays seeded');
        }

        // 4. Settings
        if (!(await Settings.findOne())) {
            await Settings.create({ companyName: 'XYZ Private Limited', companyAddress: '123 Tech Hub, HITEC City, Hyderabad, 500081', currency: 'INR' });
            logger.info('Settings seeded');
        }

        logger.info('🎉 Database seeding complete!');
        process.exit(0);
    } catch (err) {
        logger.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
