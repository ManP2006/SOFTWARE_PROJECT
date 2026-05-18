/**
 * ============================================
 * PPS Payroll — Application Constants
 * ============================================
 * Centralized constants for the entire backend.
 */

export const ROLES = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
};

export const EMPLOYEE_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    ON_LEAVE: 'On Leave',
};

export const ATTENDANCE_STATUS = {
    PRESENT: 'Present',
    ABSENT: 'Absent',
    HALF_DAY: 'Half Day',
    PAID_LEAVE: 'Paid Leave',
    UNPAID_LEAVE: 'Unpaid Leave',
    SICK_LEAVE: 'Sick Leave',
    WFH: 'WFH',
    HOLIDAY: 'Holiday',
    WEEKEND: 'Weekend',
};

export const PAYROLL_STATUS = {
    PENDING: 'Pending',
    PROCESSED: 'Processed',
    PAID: 'Paid',
    CANCELLED: 'Cancelled',
};

export const LEAVE_STATUS = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
};

export const TASK_PRIORITY = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
};

export const TASK_STATUS = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};

export const SALARY_COMPONENTS = {
    BASIC_PERCENT: 0.50,
    HRA_PERCENT: 0.20,
    TA_PERCENT: 0.10,
    DA_PERCENT: 0.10,
    PF_PERCENT: 0.12,
    ESI_THRESHOLD: 21000,
    ESI_PERCENT: 0.0075,
    PROFESSIONAL_TAX_THRESHOLD: 15000,
    PROFESSIONAL_TAX_AMOUNT: 200,
    DEFAULT_WORKING_DAYS: 26,
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 25,
    MAX_LIMIT: 100,
};
