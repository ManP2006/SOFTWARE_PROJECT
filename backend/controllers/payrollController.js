/**
 * PPS Payroll — Payroll Controller
 */
import { Payroll, Employee, Attendance, BonusDeduction } from '../models/index.js';
import { SALARY_COMPONENTS } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getAllPayroll = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.month) filter.month = Number(req.query.month);
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.employeeId) filter.employeeId = req.query.employeeId;
    const records = await Payroll.find(filter).populate('employee', 'name employeeId dept role').sort({ year: -1, month: -1 });
    ApiResponse.ok('Payroll records fetched', records, { count: records.length }).send(res);
});

export const getPayrollSummary = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.year) filter.year = Number(req.query.year);
    const summary = await Payroll.aggregate([{ $match: filter }, { $group: { _id: null, totalGross: { $sum: '$grossEarnings' }, totalDeductions: { $sum: '$totalDeductions' }, totalNet: { $sum: '$netPay' }, count: { $sum: 1 } } }]);
    ApiResponse.ok('Payroll summary', summary[0] || { totalGross: 0, totalDeductions: 0, totalNet: 0, count: 0 }).send(res);
});

export const getPayrollById = asyncHandler(async (req, res) => {
    const record = await Payroll.findById(req.params.id).populate('employee');
    if (!record) throw ApiError.notFound('Payroll record not found');
    ApiResponse.ok('Payroll record fetched', record).send(res);
});

export const runPayroll = asyncHandler(async (req, res) => {
    const { month, year, processedBy } = req.body;
    if (!month || !year) throw ApiError.badRequest('Month and year are required');
    await Payroll.deleteMany({ month: Number(month), year: Number(year) });
    const activeEmps = await Employee.find({ status: 'Active' });
    if (!activeEmps.length) throw ApiError.badRequest('No active employees found');

    const S = SALARY_COMPONENTS;
    const payrollRecords = [];

    for (const emp of activeEmps) {
        const ms = emp.monthlySalary || Math.round(emp.ctc / 12 / 1.15);
        const basic = Math.round(ms * S.BASIC_PERCENT), hra = Math.round(ms * S.HRA_PERCENT), ta = Math.round(ms * S.TA_PERCENT), da = Math.round(ms * S.DA_PERCENT);
        const att = await Attendance.find({ employeeId: emp.employeeId, month: Number(month), year: Number(year) });
        let dW = 0, pD = 0, aD = 0, hD = 0, pL = 0, uL = 0;
        att.forEach(r => { if (['Present','WFH'].includes(r.status)){pD++;dW++;} else if(r.status==='Half Day'){hD++;dW+=0.5;} else if(r.status==='Paid Leave'){pL++;dW++;} else if(r.status==='Unpaid Leave')uL++; else if(r.status==='Absent')aD++; });
        const twd = emp.totalWorking || S.DEFAULT_WORKING_DAYS;
        const bon = await BonusDeduction.find({ employeeId: emp.employeeId, month: Number(month), year: Number(year), type: 'Bonus', status: { $in: ['Pending','Approved'] } });
        const ded = await BonusDeduction.find({ employeeId: emp.employeeId, month: Number(month), year: Number(year), type: 'Deduction', status: { $in: ['Pending','Approved'] } });
        const tBonus = bon.reduce((s,b) => s+b.amount, 0), tModDed = ded.reduce((s,d) => s+d.amount, 0);
        const gross = basic + hra + ta + da + tBonus;
        let tds = gross > 50000 ? Math.round(gross*0.10) : gross > 30000 ? Math.round(gross*0.05) : 0;
        const pf = Math.round(basic * S.PF_PERCENT), esi = gross <= S.ESI_THRESHOLD ? Math.round(gross*S.ESI_PERCENT) : 0;
        const pt = gross > S.PROFESSIONAL_TAX_THRESHOLD ? S.PROFESSIONAL_TAX_AMOUNT : 0;
        const lop = Math.round((aD + uL) * (ms / twd));
        const totalDed = tds + pf + esi + pt + lop + tModDed;

        payrollRecords.push({ employee: emp._id, employeeId: emp.employeeId, employeeName: emp.name, month: Number(month), year: Number(year), basicSalary: basic, hra, ta, da, bonus: tBonus, grossEarnings: gross, pf, esi, tds, professionalTax: pt, lossOfPay: lop, otherDeductions: tModDed, totalDeductions: totalDed, netPay: gross - totalDed, daysWorked: dW, totalWorkingDays: twd, present: pD, absent: aD, halfDay: hD, paidLeave: pL, unpaidLeave: uL, status: 'Processed', processedBy: processedBy || null });
        await BonusDeduction.updateMany({ employeeId: emp.employeeId, month: Number(month), year: Number(year), status: 'Pending' }, { $set: { status: 'Approved' } });
    }

    const inserted = await Payroll.insertMany(payrollRecords);
    ApiResponse.created(`Payroll processed for ${inserted.length} employees`, inserted, { count: inserted.length }).send(res);
});

export const createPayroll = asyncHandler(async (req, res) => {
    if (req.body.employeeId && !req.body.employee) { const emp = await Employee.findOne({ employeeId: req.body.employeeId }); if (emp) req.body.employee = emp._id; }
    const record = await Payroll.create(req.body);
    ApiResponse.created('Payroll record created', record).send(res);
});

export const updatePayroll = asyncHandler(async (req, res) => {
    const record = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) throw ApiError.notFound('Payroll record not found');
    ApiResponse.ok('Payroll updated', record).send(res);
});

export const deletePayroll = asyncHandler(async (req, res) => {
    const r = await Payroll.findByIdAndDelete(req.params.id);
    if (!r) throw ApiError.notFound('Payroll record not found');
    ApiResponse.ok('Payroll deleted').send(res);
});
