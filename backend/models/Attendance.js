import mongoose from 'mongoose';

/**
 * Attendance Schema
 * Monthly attendance record for a single employee.
 * Matches the daily attendance tracking in the frontend Attendance module.
 */
const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        employeeId: {
            type: String,
            required: true,
            trim: true,
        },

        // -- Record Date --
        date: {
            type: Date,
            required: true,
        },
        month: {
            type: Number, // 1–12
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },

        // -- Status for that day --
        status: {
            type: String,
            enum: ['Present', 'Late', 'Absent', 'Half Day', 'Paid Leave', 'Unpaid Leave', 'Sick Leave', 'WFH', 'Holiday', 'Weekend'],
            required: true,
            default: 'Present',
        },

        // -- Optional time tracking --
        checkIn: {
            type: String, // "09:15 AM"
            default: '',
        },
        checkOut: {
            type: String, // "06:30 PM"
            default: '',
        },
        hoursWorked: {
            type: Number,
            default: 0,
        },

        remarks: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for workHours (frontend compatibility)
attendanceSchema.virtual('workHours').get(function () {
    return this.hoursWorked;
});

// Virtual for overtimeHours (> 8 hours is overtime)
attendanceSchema.virtual('overtimeHours').get(function () {
    return this.hoursWorked > 8 ? this.hoursWorked - 8 : 0;
});

// One attendance record per employee per date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
