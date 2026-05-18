/**
 * PPS Payroll — Leave Controller
 */
import { LeaveRequest, LeaveType, Employee } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

// ── Leave Requests ──
export const getLeaveRequests = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.employeeId) filter.employeeId = req.query.employeeId;
    const requests = await LeaveRequest.find(filter).sort({ createdAt: -1 });
    ApiResponse.ok('Leave requests fetched', requests).send(res);
});

export const getEmployeeLeaves = asyncHandler(async (req, res) => {
    const { empId } = req.params;
    const requests = await LeaveRequest.find({ employeeId: empId }).sort({ createdAt: -1 });
    ApiResponse.ok('Employee leave requests fetched', requests).send(res);
});

export const createLeaveRequest = asyncHandler(async (req, res) => {
    if (req.body.employeeId && !req.body.employee) {
        const emp = await Employee.findOne({ employeeId: req.body.employeeId });
        if (emp) req.body.employee = emp._id;
    }
    const leave = await LeaveRequest.create(req.body);
    ApiResponse.created('Leave request submitted', leave).send(res);
});

export const updateLeaveStatus = asyncHandler(async (req, res) => {
    const { status, rejectionReason, reviewedBy } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, { status, rejectionReason, reviewedBy, reviewedAt: new Date() }, { new: true, runValidators: true });
    if (!leave) throw ApiError.notFound('Leave request not found');
    ApiResponse.ok('Leave status updated', leave).send(res);
});

export const deleteLeaveRequest = asyncHandler(async (req, res) => {
    await LeaveRequest.findByIdAndDelete(req.params.id);
    ApiResponse.ok('Leave request deleted').send(res);
});

// ── Leave Types ──
export const getLeaveTypes = asyncHandler(async (req, res) => {
    const types = await LeaveType.find({ isActive: true }).sort({ name: 1 });
    ApiResponse.ok('Leave types fetched', types).send(res);
});

export const createLeaveType = asyncHandler(async (req, res) => {
    const type = await LeaveType.create(req.body);
    ApiResponse.created('Leave type created', type).send(res);
});

export const updateLeaveType = asyncHandler(async (req, res) => {
    const type = await LeaveType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!type) throw ApiError.notFound('Leave type not found');
    ApiResponse.ok('Leave type updated', type).send(res);
});

export const deleteLeaveType = asyncHandler(async (req, res) => {
    await LeaveType.findByIdAndDelete(req.params.id);
    ApiResponse.ok('Leave type deleted').send(res);
});
