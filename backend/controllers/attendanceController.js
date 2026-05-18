/**
 * ============================================
 * PPS Payroll — Attendance Controller
 * ============================================
 */
import { Attendance, Employee } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/v1/attendance
 */
export const getAttendance = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.employeeId) filter.employeeId = req.query.employeeId;
    if (req.query.month) filter.month = Number(req.query.month);
    if (req.query.year) filter.year = Number(req.query.year);
    
    const records = await Attendance.find(filter).sort({ date: -1 });
    
    // Calculate summary statistics for the frontend
    const summary = {
        present: records.filter(r => r.status === 'Present' || r.status === 'WFH').length,
        absent: records.filter(r => r.status === 'Absent').length,
        late: records.filter(r => r.status === 'Late').length,
    };

    ApiResponse.ok('Attendance records fetched', {
        records,
        summary
    }).send(res);
});

/**
 * GET /api/v1/attendance/today
 */
export const getTodayAttendance = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const records = await Attendance.find({
        date: { $gte: today, $lt: tomorrow },
    }).sort({ employeeId: 1 });

    ApiResponse.ok('Today attendance fetched', records).send(res);
});

/**
 * GET /api/v1/attendance/summary
 */
export const getAttendanceSummary = asyncHandler(async (req, res) => {
    const { month, year, employeeId } = req.query;
    const match = {};
    if (month) match.month = Number(month);
    if (year) match.year = Number(year);
    if (employeeId) match.employeeId = employeeId;

    const summary = await Attendance.aggregate([
        { $match: match },
        {
            $group: {
                _id: '$employeeId',
                present: { $sum: { $cond: [{ $in: ['$status', ['Present', 'WFH']] }, 1, 0] } },
                absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } },
                halfDay: { $sum: { $cond: [{ $eq: ['$status', 'Half Day'] }, 1, 0] } },
                paidLeave: { $sum: { $cond: [{ $eq: ['$status', 'Paid Leave'] }, 1, 0] } },
                unpaidLeave: { $sum: { $cond: [{ $eq: ['$status', 'Unpaid Leave'] }, 1, 0] } },
                sickLeave: { $sum: { $cond: [{ $eq: ['$status', 'Sick Leave'] }, 1, 0] } },
                wfh: { $sum: { $cond: [{ $eq: ['$status', 'WFH'] }, 1, 0] } },
                totalRecords: { $sum: 1 },
                totalHours: { $sum: '$hoursWorked' },
            },
        },
    ]);

    ApiResponse.ok('Attendance summary fetched', summary).send(res);
});

/**
 * POST /api/v1/attendance/checkin
 */
export const checkIn = asyncHandler(async (req, res) => {
    const { employeeId } = req.body;
    if (!employeeId) throw ApiError.badRequest('employeeId is required');

    const emp = await Employee.findOne({ employeeId });
    if (!emp) throw ApiError.notFound('Employee not found');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const existing = await Attendance.findOne({ employeeId, date: today });

    if (existing && existing.checkIn) {
        throw ApiError.conflict('Already checked in today');
    }

    const checkInTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Determine status (Late if after 9:30 AM)
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isLate = (hours > 9) || (hours === 9 && minutes > 30);
    const status = isLate ? 'Late' : 'Present';

    if (existing) {
        existing.checkIn = checkInTime;
        existing.status = status;
        await existing.save();
        return ApiResponse.ok('Check-in updated', existing).send(res);
    }

    const record = await Attendance.create({
        employee: emp._id,
        employeeId,
        date: today,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        status: status,
        checkIn: checkInTime,
    });

    ApiResponse.created('Checked in successfully', record).send(res);
});

/**
 * POST /api/v1/attendance/checkout
 */
export const checkOut = asyncHandler(async (req, res) => {
    const { employeeId } = req.body;
    if (!employeeId) throw ApiError.badRequest('employeeId is required');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const record = await Attendance.findOne({ employeeId, date: today });

    if (!record) throw ApiError.notFound('No check-in record found for today');
    if (record.checkOut) throw ApiError.conflict('Already checked out today');

    record.checkOut = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Calculate hours worked
    if (record.checkIn) {
        const parseTime = (timeStr) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours !== 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };
        const checkInMin = parseTime(record.checkIn);
        const checkOutMin = parseTime(record.checkOut);
        record.hoursWorked = Math.round(((checkOutMin - checkInMin) / 60) * 100) / 100;
    }

    await record.save();
    ApiResponse.ok('Checked out successfully', record).send(res);
});

/**
 * POST /api/v1/attendance
 */
export const markAttendance = asyncHandler(async (req, res) => {
    if (req.body.employeeId && !req.body.employee) {
        const emp = await Employee.findOne({ employeeId: req.body.employeeId });
        if (emp) req.body.employee = emp._id;
    }
    const record = await Attendance.create(req.body);
    ApiResponse.created('Attendance marked', record).send(res);
});

/**
 * POST /api/v1/attendance/bulk
 */
export const bulkMarkAttendance = asyncHandler(async (req, res) => {
    const { records } = req.body;
    for (const record of records) {
        if (record.employeeId && !record.employee) {
            const emp = await Employee.findOne({ employeeId: record.employeeId });
            if (emp) record.employee = emp._id;
        }
    }
    const result = await Attendance.insertMany(records, { ordered: false });
    ApiResponse.created('Bulk attendance marked', null, { inserted: result.length }).send(res);
});

/**
 * PUT /api/v1/attendance/:id
 */
export const updateAttendance = asyncHandler(async (req, res) => {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) throw ApiError.notFound('Attendance record not found');
    ApiResponse.ok('Attendance updated', record).send(res);
});
