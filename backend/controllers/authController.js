/**
 * ============================================
 * PPS Payroll — Auth Controller
 * ============================================
 * Handles HTTP layer for authentication.
 * All business logic delegated to authService.
 *
 * Endpoints:
 *   POST /api/v1/auth/register      — Register (admin or employee)
 *   POST /api/v1/auth/login         — Unified login
 *   POST /api/v1/auth/admin/login   — Admin-specific login
 *   POST /api/v1/auth/employee/login — Employee-specific login
 *   GET  /api/v1/auth/profile       — Get authenticated user profile
 *   PUT  /api/v1/auth/change-password — Change password
 */
import * as authService from '../services/authService.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

// ─────────────────────────────────────────────
// POST /api/v1/auth/register
// ─────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, employeeId, dept, phone, gender, ...rest } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
        throw ApiError.validationError('Validation failed', [
            { field: 'name', message: 'Name is required' },
        ]);
    }
    if (!email || !email.trim()) {
        throw ApiError.validationError('Validation failed', [
            { field: 'email', message: 'Email is required' },
        ]);
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw ApiError.validationError('Validation failed', [
            { field: 'email', message: 'Please enter a valid email address' },
        ]);
    }
    if (!password || password.length < 6) {
        throw ApiError.validationError('Validation failed', [
            { field: 'password', message: 'Password must be at least 6 characters' },
        ]);
    }

    let result;

    if (role === 'admin') {
        result = await authService.registerAdmin({ name, email, password, phone, gender });
    } else {
        // Default to employee registration
        if (!employeeId) {
            throw ApiError.validationError('Validation failed', [
                { field: 'employeeId', message: 'Employee ID is required for employee registration' },
            ]);
        }
        result = await authService.registerEmployee({
            name, email, password, employeeId, dept,
            role: rest.jobTitle || rest.position || '',
            phone, gender, ...rest,
        });
    }

    ApiResponse.created('Registration successful', {
        token: result.token,
        user: result.user,
    }).send(res);
});

// ─────────────────────────────────────────────
// POST /api/v1/auth/login (unified)
// ─────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        throw ApiError.validationError('Validation failed', [
            ...(!email ? [{ field: 'email', message: 'Email is required' }] : []),
            ...(!password ? [{ field: 'password', message: 'Password is required' }] : []),
        ]);
    }

    const result = await authService.loginUser(email, password, role || null);

    ApiResponse.ok('Login successful', {
        token: result.token,
        user: result.user,
    }).send(res);
});

// ─────────────────────────────────────────────
// POST /api/v1/auth/admin/login
// ─────────────────────────────────────────────
export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
    }

    const result = await authService.loginAdmin(email, password);

    ApiResponse.ok('Admin login successful', {
        token: result.token,
        user: result.user,
    }).send(res);
});

// ─────────────────────────────────────────────
// POST /api/v1/auth/employee/login
// ─────────────────────────────────────────────
export const employeeLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw ApiError.badRequest('Email and password are required');
    }

    const result = await authService.loginEmployee(email, password);

    ApiResponse.ok('Employee login successful', {
        token: result.token,
        user: result.user,
    }).send(res);
});

// ─────────────────────────────────────────────
// GET /api/v1/auth/profile (Protected)
// ─────────────────────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
    const { id, role } = req.user; // Set by auth middleware
    const user = await authService.getUserProfile(id, role);

    ApiResponse.ok('Profile fetched', user).send(res);
});

// ─────────────────────────────────────────────
// PUT /api/v1/auth/profile (Protected)
// ─────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
    const { id, role } = req.user;
    const { name, email, phone, address } = req.body;
    let user;

    const { Admin, Employee } = await import('../models/index.js');
    if (role === 'admin') {
        user = await Admin.findByIdAndUpdate(id, { name, email, phone, address }, { new: true });
    } else {
        user = await Employee.findByIdAndUpdate(id, { name, email, phone, address }, { new: true });
    }

    if (!user) throw ApiError.notFound('User not found');
    ApiResponse.ok('Profile updated', user).send(res);
});

// ─────────────────────────────────────────────
// PUT /api/v1/auth/change-password (Protected)
// ─────────────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
    const { id, role } = req.user;
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(id, role, currentPassword, newPassword);

    ApiResponse.ok('Password changed successfully').send(res);
});
