import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Admin Schema
 * Represents a system administrator who manages the payroll system.
 */
const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Admin name is required'],
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
            select: false, // Never return password by default
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        address: {
            type: String,
            trim: true,
            default: '',
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
            type: String, // base64 or URL
            default: '',
        },
        role: {
            type: String,
            default: 'Administrator',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // adds createdAt, updatedAt
    }
);

// Hash password before saving
adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
