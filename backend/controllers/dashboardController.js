/**
 * PPS Payroll — Dashboard Controller
 */
import { Employee, Payroll, Attendance, LeaveRequest } from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const onLeaveEmployees = await Employee.countDocuments({ status: 'On Leave' });
    const inactiveEmployees = await Employee.countDocuments({ status: 'Inactive' });
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    const presentToday = await Attendance.countDocuments({ date: { $gte: today, $lt: tomorrow }, status: 'Present' });
    const pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });
    const perfResult = await Employee.aggregate([{ $match: { assignedTasks: { $gt: 0 } } }, { $project: { perfScore: { $multiply: [{ $divide: ['$completedTasks','$assignedTasks'] }, 100] } } }, { $group: { _id: null, avgScore: { $avg: '$perfScore' } } }]);
    const avgPerformance = perfResult.length > 0 ? perfResult[0].avgScore.toFixed(1) : '0.0';
    const cm = new Date().getMonth()+1, cy = new Date().getFullYear();
    const mp = await Payroll.aggregate([{ $match: { month: cm, year: cy } }, { $group: { _id: null, totalGross: { $sum: '$grossEarnings' }, totalDeductions: { $sum: '$totalDeductions' }, totalNet: { $sum: '$netPay' }, count: { $sum: 1 } } }]);

    ApiResponse.ok('Dashboard stats', { totalEmployees, activeEmployees, onLeaveEmployees, inactiveEmployees, presentToday, pendingLeaves, avgPerformance, monthlyPayroll: mp[0] || { totalGross: 0, totalDeductions: 0, totalNet: 0, count: 0 } }).send(res);
});

export const getPayrollChart = asyncHandler(async (req, res) => {
    const now = new Date();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
        const m = d.getMonth()+1, y = d.getFullYear();
        const r = await Payroll.aggregate([{ $match: { month: m, year: y } }, { $group: { _id: null, total: { $sum: '$netPay' } } }]);
        chartData.push({ label: monthNames[m-1], month: m, year: y, total: r.length > 0 ? r[0].total : 0 });
    }
    ApiResponse.ok('Payroll chart data', chartData).send(res);
});
