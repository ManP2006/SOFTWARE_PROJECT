/**
 * PPS Payroll — Task Controller
 */
import { Task, Employee } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getTasks = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.employeeId) filter.employeeId = req.query.employeeId;
    if (req.query.status) filter.status = req.query.status;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    ApiResponse.ok('Tasks fetched', tasks).send(res);
});

export const getEmployeeTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ employeeId: req.params.empId }).sort({ createdAt: -1 });
    ApiResponse.ok('Employee tasks fetched', tasks).send(res);
});

export const createTask = asyncHandler(async (req, res) => {
    if (req.body.employeeId && !req.body.employee) {
        const emp = await Employee.findOne({ employeeId: req.body.employeeId });
        if (emp) req.body.employee = emp._id;
    }
    const task = await Task.create(req.body);
    if (req.body.employeeId) await Employee.findOneAndUpdate({ employeeId: req.body.employeeId }, { $inc: { assignedTasks: 1 } });
    ApiResponse.created('Task assigned', task).send(res);
});

export const completeTask = asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, { completed: true, status: 'Completed', completedAt: new Date() }, { new: true });
    if (!task) throw ApiError.notFound('Task not found');
    await Employee.findOneAndUpdate({ employeeId: task.employeeId }, { $inc: { completedTasks: 1 } });
    ApiResponse.ok('Task completed', task).send(res);
});

export const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) throw ApiError.notFound('Task not found');
    ApiResponse.ok('Task updated', task).send(res);
});

export const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) throw ApiError.notFound('Task not found');
    const inc = { assignedTasks: -1 };
    if (task.completed) inc.completedTasks = -1;
    await Employee.findOneAndUpdate({ employeeId: task.employeeId }, { $inc: inc });
    await Task.findByIdAndDelete(req.params.id);
    ApiResponse.ok('Task deleted').send(res);
});
