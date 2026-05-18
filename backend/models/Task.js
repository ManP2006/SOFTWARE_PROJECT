import mongoose from 'mongoose';

/**
 * Task Schema
 * Represents a task assigned to an employee by an admin.
 */
const taskSchema = new mongoose.Schema(
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
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        completed: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Database Optimizations
taskSchema.index({ employee: 1, status: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
