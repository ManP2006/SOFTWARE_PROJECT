/**
 * PPS Payroll — Bonus/Deduction Controller
 */
import { BonusDeduction } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getAll = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.employeeId) filter.employeeId = req.query.employeeId;
    if (req.query.month) filter.month = Number(req.query.month);
    if (req.query.year) filter.year = Number(req.query.year);
    const records = await BonusDeduction.find(filter).sort({ createdAt: -1 });
    ApiResponse.ok('Records fetched', records).send(res);
});

export const create = asyncHandler(async (req, res) => {
    if (req.body.employeeId && !req.body.employee) {
        const { Employee } = await import('../models/index.js');
        const emp = await Employee.findOne({ employeeId: req.body.employeeId });
        if (emp) {
            req.body.employee = emp._id;
            req.body.employeeName = emp.name;
        }
    }
    const record = await BonusDeduction.create(req.body);
    ApiResponse.created('Record created', record).send(res);
});

export const update = asyncHandler(async (req, res) => {
    const record = await BonusDeduction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) throw ApiError.notFound('Record not found');
    ApiResponse.ok('Record updated', record).send(res);
});

export const remove = asyncHandler(async (req, res) => {
    await BonusDeduction.findByIdAndDelete(req.params.id);
    ApiResponse.ok('Record deleted').send(res);
});
