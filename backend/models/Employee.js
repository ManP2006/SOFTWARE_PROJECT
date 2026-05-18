import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Employee Schema
 * Represents a company employee — matches the frontend defaultEmployees structure.
 */
const employeeSchema = new mongoose.Schema(
    {
        // -- Identity --
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            // e.g. "PPS001"
        },
        name: {
            type: String,
            required: [true, 'Employee name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        location: {
            type: String,
            trim: true,
            default: '',
        },
        joiningDate: {
            type: Date,
            default: null,
        },
        dob: {
            type: Date,
            default: null,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', ''],
            default: '',
        },
        profileImage: {
            type: String,
            default: '',
        },

        // -- Job Details --
        role: {
            type: String, // Job title e.g. "Software Developer"
            trim: true,
            default: '',
        },
        dept: {
            type: String, // Department e.g. "Engineering"
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'On Leave'],
            default: 'Active',
        },

        // -- Salary --
        dailyWage: {
            type: Number,
            default: 0,
            min: 0,
        },
        monthlySalary: {
            type: Number,
            default: 0,
            min: 0,
        },
        ctc: {
            type: Number, // Cost to Company (annual)
            default: 0,
            min: 0,
        },

        // -- Attendance (current month counters) --
        present: { type: Number, default: 0 },
        absent: { type: Number, default: 0 },
        halfDay: { type: Number, default: 0 },
        paidLeave: { type: Number, default: 0 },
        unpaidLeave: { type: Number, default: 0 },
        sickLeave: { type: Number, default: 0 },
        wfh: { type: Number, default: 0 },
        totalWorking: { type: Number, default: 26 },
        holidays: { type: Number, default: 4 },

        // -- Task Metrics --
        assignedTasks: { type: Number, default: 0 },
        completedTasks: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
employeeSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare password
employeeSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Database Optimizations: Indexes for faster search and filtering
employeeSchema.index({ dept: 1, status: 1 });
employeeSchema.index({ role: 1 });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
