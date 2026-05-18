/**
 * ============================================
 * PPS Payroll — Admin Controller
 * ============================================
 */
import { Admin } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/v1/admin/profile/:id
 */
export const getProfile = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if (!admin) throw ApiError.notFound('Admin not found');
    ApiResponse.ok('Admin profile fetched', admin).send(res);
});

/**
 * PUT /api/v1/admin/profile/:id
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { password, ...updateData } = req.body;
    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!admin) throw ApiError.notFound('Admin not found');
    ApiResponse.ok('Admin profile updated', admin).send(res);
});

/**
 * POST /api/v1/admin/register
 */
export const registerAdmin = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) throw ApiError.conflict('An admin with this email already exists');

    const admin = await Admin.create(req.body);
    const { password: _, ...adminData } = admin.toObject();
    ApiResponse.created('Admin registered successfully', adminData).send(res);
});
