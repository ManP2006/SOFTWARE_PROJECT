import mongoose from 'mongoose';

/**
 * Settings Schema
 * Stores company-wide and application settings.
 * Singleton pattern — only one document should exist.
 */
const settingsSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            default: 'XYZ Private Limited',
            trim: true,
        },
        companyAddress: {
            type: String,
            default: '123 Tech Hub, HITEC City, Hyderabad, 500081',
            trim: true,
        },
        companyLogo: {
            type: String, // base64 or URL
            default: '',
        },
        currency: {
            type: String,
            enum: ['INR', 'USD', 'EUR', 'GBP'],
            default: 'INR',
        },
        language: {
            type: String,
            default: 'en',
        },
        financialYearStart: {
            type: Number, // Month (1-12), default April
            default: 4,
        },
        workingDaysPerMonth: {
            type: Number,
            default: 26,
        },
        overtimeMultiplier: {
            type: Number,
            default: 1.5,
        },
        taxSlabs: {
            type: [{
                minIncome: Number,
                maxIncome: Number,
                rate: Number, // percentage
            }],
            default: [
                { minIncome: 0, maxIncome: 300000, rate: 0 },
                { minIncome: 300001, maxIncome: 600000, rate: 5 },
                { minIncome: 600001, maxIncome: 900000, rate: 10 },
                { minIncome: 900001, maxIncome: 1200000, rate: 15 },
                { minIncome: 1200001, maxIncome: 1500000, rate: 20 },
                { minIncome: 1500001, maxIncome: Infinity, rate: 30 },
            ],
        },
    },
    {
        timestamps: true,
    }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
