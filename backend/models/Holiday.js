import mongoose from 'mongoose';

/**
 * Holiday Schema
 * Company-wide holidays for attendance and payroll calculation.
 */
const holidaySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Holiday name is required'],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'Holiday date is required'],
        },
        type: {
            type: String,
            enum: ['Public', 'Company', 'Optional', 'Restricted'],
            default: 'Public',
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// One holiday per date
holidaySchema.index({ date: 1 }, { unique: true });

const Holiday = mongoose.model('Holiday', holidaySchema);
export default Holiday;
