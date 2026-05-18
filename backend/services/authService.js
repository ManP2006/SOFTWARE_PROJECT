/**
 * ============================================
 * PPS Payroll — Authentication Service
 * ============================================
 * Handles all authentication business logic:
 * - Token generation & verification
 * - User registration (admin/employee)
 * - User lookup & password verification
 * - Profile retrieval
 *
 * Clean separation from controllers — controllers
 * handle HTTP, this service handles auth logic.
 */
import jwt from 'jsonwebtoken';
import { Admin, Employee } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pps-payroll-jwt-secret-2026-secure-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ═══════════════════════════════════════════
// TOKEN MANAGEMENT
// ═══════════════════════════════════════════

/**
 * Generate a signed JWT token
 * @param {string} id   - User's MongoDB _id
 * @param {string} role - 'admin' or 'employee'
 * @returns {string} Signed JWT
 */
export const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT string
 * @returns {{ id: string, role: string }} Decoded payload
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw ApiError.unauthorized('Token expired. Please sign in again.');
        }
        throw ApiError.unauthorized('Invalid authentication token.');
    }
};

// ═══════════════════════════════════════════
// USER REGISTRATION
// ═══════════════════════════════════════════

/**
 * Register a new admin
 * @param {Object} userData - { name, email, password, phone, gender }
 * @returns {{ user: Object, token: string }}
 */
export const registerAdmin = async (userData) => {
    const { name, email, password, phone, gender } = userData;

    // Validation
    if (!name || !email || !password) {
        throw ApiError.badRequest('Name, email, and password are required');
    }
    if (password.length < 6) {
        throw ApiError.badRequest('Password must be at least 6 characters');
    }

    // Check duplicate
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
        throw ApiError.conflict('An account with this email already exists');
    }

    // Also check Employee collection (prevent cross-role duplicates)
    const existingEmployee = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (existingEmployee) {
        throw ApiError.conflict('This email is already registered as an employee');
    }

    // Create admin
    const admin = await Admin.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone || '',
        gender: gender || '',
        role: 'Administrator',
    });

    const token = generateToken(admin._id, 'admin');
    const { password: _, ...adminData } = admin.toObject();

    logger.info(`New admin registered: ${email}`);
    return { user: { ...adminData, role: 'admin' }, token };
};

/**
 * Register a new employee
 * @param {Object} userData - { name, email, password, employeeId, dept, role, ... }
 * @returns {{ user: Object, token: string }}
 */
export const registerEmployee = async (userData) => {
    const { name, email, password, employeeId, dept, role: jobTitle, ...rest } = userData;

    // Validation
    if (!name || !email || !password) {
        throw ApiError.badRequest('Name, email, and password are required');
    }
    if (!employeeId) {
        throw ApiError.badRequest('Employee ID is required');
    }
    if (password.length < 6) {
        throw ApiError.badRequest('Password must be at least 6 characters');
    }

    // Check duplicates
    const existingEmp = await Employee.findOne({
        $or: [
            { email: email.toLowerCase().trim() },
            { employeeId: employeeId.trim() },
        ],
    });
    if (existingEmp) {
        if (existingEmp.email === email.toLowerCase().trim()) {
            throw ApiError.conflict('An employee with this email already exists');
        }
        throw ApiError.conflict('This Employee ID is already taken');
    }

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
        throw ApiError.conflict('This email is already registered as an admin');
    }

    // Create employee
    const employee = await Employee.create({
        ...rest,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        employeeId: employeeId.trim(),
        dept: dept || '',
        role: jobTitle || '',
        status: 'Active',
    });

    const token = generateToken(employee._id, 'employee');
    const { password: _, ...empData } = employee.toObject();

    logger.info(`New employee registered: ${email} (${employeeId})`);
    return { user: { ...empData, role: 'employee' }, token };
};

// ═══════════════════════════════════════════
// USER LOGIN
// ═══════════════════════════════════════════

/**
 * Login admin by email + password
 * @param {string} email
 * @param {string} password
 * @returns {{ user: Object, token: string }}
 */
export const loginAdmin = async (email, password) => {
    if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!admin) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    if (admin.isActive === false) {
        throw ApiError.forbidden('Your account has been deactivated. Contact support.');
    }

    const token = generateToken(admin._id, 'admin');
    const { password: _, ...adminData } = admin.toObject();

    logger.info(`Admin login: ${email}`);
    return { user: { ...adminData, role: 'admin' }, token };
};

/**
 * Login employee by email + password
 * @param {string} email
 * @param {string} password
 * @returns {{ user: Object, token: string }}
 */
export const loginEmployee = async (email, password) => {
    if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
    }

    const employee = await Employee.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!employee) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    if (employee.status === 'Inactive') {
        throw ApiError.forbidden('Your account has been deactivated. Contact HR.');
    }

    const token = generateToken(employee._id, 'employee');
    const { password: _, ...empData } = employee.toObject();

    logger.info(`Employee login: ${email} (${employee.employeeId})`);
    return { user: { ...empData, role: 'employee' }, token };
};

/**
 * Unified login — auto-detects role by checking both collections
 * @param {string} email
 * @param {string} password
 * @param {string} [role] - Optional hint: 'admin' or 'employee'
 * @returns {{ user: Object, token: string }}
 */
export const loginUser = async (email, password, role = null) => {
    if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
    }

    // If role hint provided, search specific collection
    if (role === 'admin') return loginAdmin(email, password);
    if (role === 'employee') return loginEmployee(email, password);

    // Auto-detect: try admin first, then employee
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (admin) {
        const isMatch = await admin.comparePassword(password);
        if (isMatch) {
            if (admin.isActive === false) throw ApiError.forbidden('Account deactivated');
            const token = generateToken(admin._id, 'admin');
            const { password: _, ...data } = admin.toObject();
            logger.info(`Unified login (admin): ${email}`);
            return { user: { ...data, role: 'admin' }, token };
        }
    }

    const employee = await Employee.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (employee) {
        const isMatch = await employee.comparePassword(password);
        if (isMatch) {
            if (employee.status === 'Inactive') throw ApiError.forbidden('Account deactivated');
            const token = generateToken(employee._id, 'employee');
            const { password: _, ...data } = employee.toObject();
            logger.info(`Unified login (employee): ${email}`);
            return { user: { ...data, role: 'employee' }, token };
        }
    }

    throw ApiError.unauthorized('Invalid email or password');
};

// ═══════════════════════════════════════════
// USER PROFILE
// ═══════════════════════════════════════════

/**
 * Get the authenticated user's profile
 * @param {string} userId - MongoDB ObjectId
 * @param {string} role   - 'admin' or 'employee'
 * @returns {Object} User profile data
 */
export const getUserProfile = async (userId, role) => {
    let user = null;

    if (role === 'admin') {
        user = await Admin.findById(userId);
    } else if (role === 'employee') {
        user = await Employee.findById(userId);
    }

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    return { ...user.toObject(), role };
};

/**
 * Update the authenticated user's password
 * @param {string} userId - MongoDB ObjectId
 * @param {string} role   - 'admin' or 'employee'
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export const changePassword = async (userId, role, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw ApiError.badRequest('Current password and new password are required');
    }
    if (newPassword.length < 6) {
        throw ApiError.badRequest('New password must be at least 6 characters');
    }

    const Model = role === 'admin' ? Admin : Employee;
    const user = await Model.findById(userId).select('+password');
    if (!user) throw ApiError.notFound('User not found');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw ApiError.unauthorized('Current password is incorrect');
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    logger.info(`Password changed: ${user.email} (${role})`);
    return { message: 'Password changed successfully' };
};

export default {
    generateToken,
    verifyToken,
    registerAdmin,
    registerEmployee,
    loginAdmin,
    loginEmployee,
    loginUser,
    getUserProfile,
    changePassword,
};
