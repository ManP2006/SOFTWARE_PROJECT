/**
 * PPS Payroll — Holiday Controller
 */
import { Holiday } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getHolidays = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.year) { const y = Number(req.query.year); filter.date = { $gte: new Date(y,0,1), $lt: new Date(y+1,0,1) }; }
    const holidays = await Holiday.find(filter).sort({ date: 1 });
    ApiResponse.ok('Holidays fetched', holidays).send(res);
});

export const createHoliday = asyncHandler(async (req, res) => {
    const holiday = await Holiday.create(req.body);
    ApiResponse.created('Holiday added', holiday).send(res);
});

export const updateHoliday = asyncHandler(async (req, res) => {
    const holiday = await Holiday.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!holiday) throw ApiError.notFound('Holiday not found');
    ApiResponse.ok('Holiday updated', holiday).send(res);
});

export const deleteHoliday = asyncHandler(async (req, res) => {
    await Holiday.findByIdAndDelete(req.params.id);
    ApiResponse.ok('Holiday deleted').send(res);
});
