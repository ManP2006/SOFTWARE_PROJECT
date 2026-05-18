import mongoose from 'mongoose';

/**
 * BonusDeduction Schema
 * Represents an individual bonus or deduction entry for an employee.
 * Frontend: Bonuses & Deductions module.
 */
const bonusDeductionSchema = new mongoose.Schema(
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
        employeeName: {
            type: String,
            required: true,
            trim: true,
        },

        // -- Type --
        type: {
            type: String,
            enum: ['Bonus', 'Deduction'],
            required: true,
        },
        category: {
            type: String,
            // Bonus: "Performance", "Festival", "Referral", "Retention", "Other"
            // Deduction: "Loan Recovery", "Advance", "Disciplinary", "Late Fine", "Other"
            trim: true,
            default: 'Other',
        },

        // -- Amount --
        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        // -- Period --
        month: {
            type: Number, // 1–12
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },

        // -- Details --
        description: {
            type: String,
            trim: true,
            default: '',
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },

        // -- Approval --
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Approved',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const BonusDeduction = mongoose.model('BonusDeduction', bonusDeductionSchema);
export default BonusDeduction;
