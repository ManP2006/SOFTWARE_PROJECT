import mongoose from 'mongoose';

/**
 * Payroll Schema
 * Stores a monthly payroll record for one employee.
 * Matches the payslip data used in the frontend PayslipModal.
 */
const payrollSchema = new mongoose.Schema(
    {
        // Which employee
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        employeeId: {
            type: String, // Denormalized for quick lookup (e.g. "PPS001")
            required: true,
            trim: true,
        },
        employeeName: {
            type: String,
            required: true,
            trim: true,
        },

        // -- Pay Period --
        month: {
            type: Number, // 1–12
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },

        // -- Earnings --
        basicSalary: { type: Number, default: 0 },
        hra: { type: Number, default: 0 },          // House Rent Allowance
        ta: { type: Number, default: 0 },           // Travel Allowance
        da: { type: Number, default: 0 },           // Dearness Allowance
        otherAllowances: { type: Number, default: 0 },
        bonus: { type: Number, default: 0 },
        grossEarnings: { type: Number, default: 0 },

        // -- Deductions --
        pf: { type: Number, default: 0 },           // Provident Fund
        esi: { type: Number, default: 0 },          // Employee State Insurance
        tds: { type: Number, default: 0 },          // Tax Deducted at Source
        professionalTax: { type: Number, default: 0 },
        loanDeduction: { type: Number, default: 0 },
        otherDeductions: { type: Number, default: 0 },
        lossOfPay: { type: Number, default: 0 },    // Deduction for absences
        totalDeductions: { type: Number, default: 0 },

        // -- Net Pay --
        netPay: { type: Number, default: 0 },

        // -- Attendance Summary (snapshot for payslip) --
        daysWorked: { type: Number, default: 0 },
        totalWorkingDays: { type: Number, default: 26 },
        present: { type: Number, default: 0 },
        absent: { type: Number, default: 0 },
        halfDay: { type: Number, default: 0 },
        paidLeave: { type: Number, default: 0 },
        unpaidLeave: { type: Number, default: 0 },

        // -- Status --
        status: {
            type: String,
            enum: ['Pending', 'Processed', 'Paid', 'Cancelled'],
            default: 'Pending',
        },
        paidOn: {
            type: Date,
            default: null,
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for 'net' (alias for netPay)
payrollSchema.virtual('net').get(function () {
    return this.netPay;
});

// Virtual for 'financialYear'
payrollSchema.virtual('financialYear').get(function () {
    if (!this.month || !this.year) return '';
    const y = this.year;
    return this.month >= 4 ? `FY ${y}-${String(y + 1).slice(-2)}` : `FY ${y - 1}-${String(y).slice(-2)}`;
});

// Ensure one payroll record per employee per month-year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
