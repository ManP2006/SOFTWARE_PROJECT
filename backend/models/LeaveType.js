import mongoose from 'mongoose';

/**
 * LeaveType Schema
 * Admin-configurable leave types (e.g. "Sick Leave", "Casual Leave").
 * Frontend: Leave Management module — Add/Edit Leave Type.
 */
const leaveTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Leave type name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        maxDaysPerYear: {
            type: Number,
            required: true,
            min: 0,
            default: 12,
        },
        isPaid: {
            type: Boolean,
            default: true,
        },
        carryForward: {
            type: Boolean,
            default: false,
        },
        applicableFor: {
            type: String,
            enum: ['All', 'Admin', 'Employee'],
            default: 'All',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        color: {
            type: String, // For calendar display, e.g. "#ef4444"
            default: '#6366f1',
        },
    },
    {
        timestamps: true,
    }
);

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);
export default LeaveType;
