import mongoose from 'mongoose';
import 'dotenv/config';
import dns from "node:dns/promises";
import bcrypt from 'bcryptjs';

import { Admin, Employee, Payroll, Attendance, LeaveRequest } from './models/index.js';

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MOCK_PASSWORD = "password123";

async function seedDatabase() {
    try {
        console.log("Connecting securely to MongoDB Atlas 'payroll_db'...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Authenticated & Connected.");

        console.log("🧹 Clearing old database collections...");
        await Admin.deleteMany({});
        await Employee.deleteMany({});
        await Payroll.deleteMany({});
        await Attendance.deleteMany({});
        await LeaveRequest.deleteMany({});
        // Clean up the dummy table we created before
        try { await mongoose.connection.collection('systemsetups').drop(); } catch (e) {}

        console.log("🌱 Planting new full-fledged database seeds...");

        // 1. Create Admin
        const adminData = {
            name: "MAN PATEL",
            email: "man@pps.com",
            password: 'MAN@1234', // Model pre-save hook handles hashing
            role: "Administrator",
            isActive: true,
            phone: "+91 9876543210",
        };
        const newAdmin = await Admin.create(adminData);
        console.log("➜ Admin created.");

        // 2. Create Employees
        const passHash = await bcrypt.hash(MOCK_PASSWORD, 12);
        const employees = [
            {
                employeeId: 'PPS001',
                name: 'MAN',
                email: 'manpatel@pps.com',
                password: 'man@1234',
                role: 'Senior Developer',
                dept: 'Engineering',
                monthlySalary: 120000,
                ctc: 1440000,
                present: 24,
                absent: 0,
                status: 'Active'
            },
            {
                employeeId: 'PPS002',
                name: 'Priya Patel',
                email: 'priya@pps.com',
                password: MOCK_PASSWORD,
                role: 'HR Manager',
                dept: 'Human Resources',
                monthlySalary: 80000,
                ctc: 960000,
                present: 22,
                absent: 2,
                status: 'Active'
            },
            {
                employeeId: 'PPS003',
                name: 'Arjun Singh',
                email: 'arjun@pps.com',
                password: MOCK_PASSWORD,
                role: 'UI/UX Designer',
                dept: 'Design',
                monthlySalary: 75000,
                ctc: 900000,
                present: 25,
                absent: 0,
                status: 'Active'
            }
        ];

        const savedEmployees = [];
        for (const emp of employees) {
            const newEmp = new Employee(emp);
            // manually set password so it triggers pre-save
            await newEmp.save();
            savedEmployees.push(newEmp);
        }
        console.log(`➜ ${savedEmployees.length} Employees created.`);

        // 3. Payroll Data creation (For previous month)
        const date = new Date();
        const month = date.getMonth(); // 0-indexed, so getMonth() is the previous month
        const year = date.getFullYear();

        for (const emp of savedEmployees) {
            await Payroll.create({
                employee: emp._id,
                employeeId: emp.employeeId,
                employeeName: emp.name,
                month: month === 0 ? 12 : month,
                year: month === 0 ? year - 1 : year,
                basicSalary: emp.monthlySalary * 0.5,
                hra: emp.monthlySalary * 0.2,
                ta: emp.monthlySalary * 0.1,
                da: emp.monthlySalary * 0.2,
                grossEarnings: emp.monthlySalary,
                pf: 1800,
                tds: 2000,
                totalDeductions: 3800,
                netPay: emp.monthlySalary - 3800,
                daysWorked: emp.present,
                present: emp.present,
                absent: emp.absent,
                status: 'Paid',
                processedBy: newAdmin._id
            });
        }
        console.log("➜ Processed Payroll mock records created.");

        // 4. Leave Requests Data
        await LeaveRequest.create({
            employee: savedEmployees[1]._id,
            employeeId: savedEmployees[1].employeeId,
            employeeName: savedEmployees[1].name,
            leaveType: 'Sick Leave',
            fromDate: new Date(),
            toDate: new Date(new Date().getTime() + 86400000), // +1 day
            totalDays: 2,
            reason: 'Heavy fever and cold',
            status: 'Pending'
        });
        console.log("➜ Mock Leave Requests created.");

        console.log("\n🚀 FULLY FLEDGED DATABASE SEED COMPLETE!");
        console.log("Your database now has structured collections (admins, employees, payrolls, leaverequests).");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
}

seedDatabase();
