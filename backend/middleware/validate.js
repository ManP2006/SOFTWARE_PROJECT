/**
 * ============================================
 * PPS Payroll — Request Validation Middleware
 * ============================================
 * Generic validation middleware factory.
 * Takes a validation schema function and validates req.body.
 *
 * Usage:
 *   router.post('/', validate(createEmployeeSchema), controller.create);
 */
import ApiError from '../utils/ApiError.js';

/**
 * @param {Function} schemaFn - Function that receives (body) and returns { valid: boolean, errors: [] }
 */
const validate = (schemaFn) => {
    return (req, _res, next) => {
        const result = schemaFn(req.body);
        if (!result.valid) {
            throw ApiError.validationError('Validation failed', result.errors);
        }
        next();
    };
};

export default validate;
