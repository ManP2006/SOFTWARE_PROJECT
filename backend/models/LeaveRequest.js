import mongoose from 'mongoose';

/**
 * LeaveRequest Schema
 * Represents a single leave application by an employee.
 */
const leaveRequestSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        employeeId: {
            type: String, // Denormalized for quick lookup
            required: true,
            trim: true,
        },
        employeeName: {
            type: String,
            required: true,
            trim: true,
        },

        // -- Leave Details --
        leaveType: {
            type: String,
            required: true,
            trim: true,
            // e.g. 'Sick Leave', 'Paid Leave', 'Casual Leave', etc.
        },
        fromDate: {
            type: Date,
            required: true,
        },
        toDate: {
            type: Date,
            required: true,
        },
        totalDays: {
            type: Number,
            required: true,
            min: 0.5,
        },
        isHalfDay: {
            type: Boolean,
            default: false,
        },
        reason: {
            type: String,
            trim: true,
            default: '',
        },

        // -- Approval Workflow --
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
            default: 'Pending',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
        rejectionReason: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);
// Database Optimizations
leaveRequestSchema.index({ employee: 1, status: 1 });
leaveRequestSchema.index({ status: 1 });

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
