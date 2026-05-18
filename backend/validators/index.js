/**
 * PPS Payroll — Validators Index
 */

/** Validate login fields */
export const validateLogin = (body) => {
    const errors = [];
    if (!body.email) errors.push({ field: 'email', message: 'Email is required' });
    if (!body.password) errors.push({ field: 'password', message: 'Password is required' });
    return { valid: errors.length === 0, errors };
};

/** Validate employee creation */
export const validateEmployee = (body) => {
    const errors = [];
    if (!body.name || body.name.trim().length < 2) errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    if (!body.email) errors.push({ field: 'email', message: 'Email is required' });
    if (!body.employeeId) errors.push({ field: 'employeeId', message: 'Employee ID is required' });
    return { valid: errors.length === 0, errors };
};

/** Validate payroll run */
export const validatePayrollRun = (body) => {
    const errors = [];
    if (!body.month || body.month < 1 || body.month > 12) errors.push({ field: 'month', message: 'Valid month (1-12) is required' });
    if (!body.year || body.year < 2020) errors.push({ field: 'year', message: 'Valid year is required' });
    return { valid: errors.length === 0, errors };
};

/** Validate leave request */
export const validateLeaveRequest = (body) => {
    const errors = [];
    if (!body.employeeId) errors.push({ field: 'employeeId', message: 'Employee ID is required' });
    if (!body.leaveType) errors.push({ field: 'leaveType', message: 'Leave type is required' });
    if (!body.fromDate) errors.push({ field: 'fromDate', message: 'From date is required' });
    if (!body.toDate) errors.push({ field: 'toDate', message: 'To date is required' });
    return { valid: errors.length === 0, errors };
};
