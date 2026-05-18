/**
 * PPS Payroll — Database Seeder
 * Seeds the MongoDB database with realistic sample data.
 * Run: node seed/seedData.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { Admin, Employee, LeaveType, Holiday, Settings } from '../models/index.js';

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected!');

        // --- 1. Seed Admin ---
        const existingAdmin = await Admin.findOne({ email: 'man@pps.com' });
        if (!existingAdmin) {
            await Admin.create({
                name: 'MAN PATEL',
                email: 'man@pps.com',
                password: 'MAN@1234',
                phone: '+91 9876543210',
                role: 'Administrator',
                gender: 'Male',
            });
            console.log('✅ Admin seeded (man@pps.com / MAN@1234)');
        } else {
            console.log('⏭️  Admin already exists');
        }

        // --- 2. Seed Employees ---
        const existingCount = await Employee.countDocuments();
        if (existingCount === 0) {
            const employeeData = [
                { employeeId: 'PPS001', name: 'MAN', email: 'manpatel@pps.com', password: 'man@1234', role: 'Software Developer', dept: 'Engineering', status: 'Active', ctc: 800000, monthlySalary: 58000, dailyWage: 2200, assignedTasks: 5, completedTasks: 4 },
                { employeeId: 'PPS002', name: 'Ishaan Gupta', email: 'ishaan@pps.com', password: 'password123', role: 'Backend Developer', dept: 'Engineering', status: 'Active', ctc: 750000, monthlySalary: 54348, dailyWage: 2091, assignedTasks: 4, completedTasks: 3 },
                { employeeId: 'PPS003', name: 'Ananya Iyer', email: 'ananya@pps.com', password: 'password123', role: 'UI/UX Designer', dept: 'Design', status: 'Active', ctc: 700000, monthlySalary: 50725, dailyWage: 1951, assignedTasks: 6, completedTasks: 6 },
                { employeeId: 'PPS004', name: 'Vihaan Reddy', email: 'vihaan@pps.com', password: 'password123', role: 'Data Analyst', dept: 'Analytics', status: 'Active', ctc: 650000, monthlySalary: 47101, dailyWage: 1812, assignedTasks: 3, completedTasks: 2 },
                { employeeId: 'PPS005', name: 'Saanvi Malhotra', email: 'saanvi@pps.com', password: 'password123', role: 'Marketing Manager', dept: 'Marketing', status: 'Active', ctc: 900000, monthlySalary: 65217, dailyWage: 2508, assignedTasks: 4, completedTasks: 4 },
                { employeeId: 'PPS006', name: 'Advait Joshi', email: 'advait@pps.com', password: 'password123', role: 'DevOps Engineer', dept: 'Engineering', status: 'Active', ctc: 850000, monthlySalary: 61594, dailyWage: 2369, assignedTasks: 5, completedTasks: 3 },
                { employeeId: 'PPS007', name: 'Kyra Nair', email: 'kyra@pps.com', password: 'password123', role: 'Product Manager', dept: 'Product', status: 'Active', ctc: 1000000, monthlySalary: 72464, dailyWage: 2787, assignedTasks: 7, completedTasks: 5 },
                { employeeId: 'PPS008', name: 'Reyansh Patel', email: 'reyansh@pps.com', password: 'password123', role: 'Full Stack Developer', dept: 'Engineering', status: 'Active', ctc: 820000, monthlySalary: 59420, dailyWage: 2285, assignedTasks: 4, completedTasks: 4 },
                { employeeId: 'PPS009', name: 'Diya Menon', email: 'diya@pps.com', password: 'password123', role: 'QA Engineer', dept: 'Engineering', status: 'Active', ctc: 600000, monthlySalary: 43478, dailyWage: 1672, assignedTasks: 5, completedTasks: 4 },
                { employeeId: 'PPS010', name: 'Arjun Kapoor', email: 'arjun@pps.com', password: 'password123', role: 'System Administrator', dept: 'IT', status: 'Active', ctc: 700000, monthlySalary: 50725, dailyWage: 1951, assignedTasks: 3, completedTasks: 3 },
            ];

            await Employee.insertMany(employeeData);
            console.log(`✅ ${employeeData.length} employees seeded`);
        } else {
            console.log(`⏭️  ${existingCount} employees already exist`);
        }

        // --- 3. Seed Leave Types ---
        const existingLeaveTypes = await LeaveType.countDocuments();
        if (existingLeaveTypes === 0) {
            await LeaveType.insertMany([
                { name: 'Privilege Leave', description: 'Annual earned leave', maxDaysPerYear: 15, isPaid: true, carryForward: true, color: '#6366f1' },
                { name: 'Sick Leave', description: 'For medical issues', maxDaysPerYear: 12, isPaid: true, carryForward: false, color: '#ef4444' },
                { name: 'Casual Leave', description: 'For personal contingencies', maxDaysPerYear: 10, isPaid: true, carryForward: false, color: '#f59e0b' },
                { name: 'Loss of Pay', description: 'Leave without pay', maxDaysPerYear: 365, isPaid: false, carryForward: false, color: '#64748b' },
            ]);
            console.log('✅ Leave types seeded');
        } else {
            console.log('⏭️  Leave types already exist');
        }

        // --- 4. Seed Holidays ---
        const existingHolidays = await Holiday.countDocuments();
        if (existingHolidays === 0) {
            const year = new Date().getFullYear();
            await Holiday.insertMany([
                { name: 'Republic Day', date: new Date(year, 0, 26), type: 'Public' },
                { name: 'Holi', date: new Date(year, 2, 14), type: 'Public' },
                { name: 'Good Friday', date: new Date(year, 3, 18), type: 'Public' },
                { name: 'Independence Day', date: new Date(year, 7, 15), type: 'Public' },
                { name: 'Gandhi Jayanti', date: new Date(year, 9, 2), type: 'Public' },
                { name: 'Diwali', date: new Date(year, 9, 20), type: 'Public' },
                { name: 'Christmas', date: new Date(year, 11, 25), type: 'Public' },
            ]);
            console.log('✅ Holidays seeded');
        } else {
            console.log('⏭️  Holidays already exist');
        }

        // --- 5. Seed Settings ---
        const existingSettings = await Settings.findOne();
        if (!existingSettings) {
            await Settings.create({
                companyName: 'XYZ Private Limited',
                companyAddress: '123 Tech Hub, HITEC City, Hyderabad, 500081',
                currency: 'INR',
                language: 'en',
            });
            console.log('✅ Settings seeded');
        } else {
            console.log('⏭️  Settings already exist');
        }

        console.log('\n🎉 Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
