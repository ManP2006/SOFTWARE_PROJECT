/**
 * ============================================
 * PPS Payroll — Employee Service
 * ============================================
 * Handles business logic for Employee Management:
 * - CRUD operations
 * - Advanced search, filtering, and pagination
 */
import { Employee } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Get all employees with pagination, filtering, and search
 */
export const getEmployees = async (query = {}) => {
    // 1. Pagination
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 100; // default large limit to not break old frontend
    const skip = (page - 1) * limit;

    // 2. Filtering & Search
    const filter = {};
    
    // Search by name, email, or employeeId
    if (query.search) {
        const searchRegex = new RegExp(query.search, 'i');
        filter.$or = [
            { name: searchRegex },
            { email: searchRegex },
            { employeeId: searchRegex }
        ];
    }

    // Exact matches for filtering
    if (query.status) filter.status = query.status;
    if (query.dept) filter.dept = query.dept;
    if (query.role) filter.role = query.role;

    // 3. Sorting
    const sortField = query.sortBy || 'employeeId';
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortOrder };

    // 4. Query Database
    const employees = await Employee.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Employee.countDocuments(filter);

    return {
        employees,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    };
};

/**
 * Get single employee by MongoDB _id or employeeId
 */
export const getEmployeeByIdOrEmpId = async (id) => {
    let employee = await Employee.findById(id).catch(() => null);
    if (!employee) {
        employee = await Employee.findOne({ employeeId: id });
    }
    if (!employee) {
        throw ApiError.notFound('Employee not found');
    }
    return employee;
};

/**
 * Create a new employee
 */
export const createEmployee = async (employeeData) => {
    // Check if employeeId or email already exists
    const existing = await Employee.findOne({
        $or: [
            { email: employeeData.email.toLowerCase().trim() },
            { employeeId: employeeData.employeeId.trim() }
        ]
    });

    if (existing) {
        if (existing.email === employeeData.email.toLowerCase().trim()) {
            throw ApiError.conflict('Employee with this email already exists');
        }
        throw ApiError.conflict('Employee with this Employee ID already exists');
    }

    const employee = await Employee.create({
        ...employeeData,
        name: employeeData.name?.trim(),
        email: employeeData.email?.toLowerCase().trim(),
        employeeId: employeeData.employeeId?.trim(),
        password: employeeData.password || 'emp12345', // Default password
    });

    logger.info(`Created new employee: ${employee.employeeId}`);
    return employee;
};

/**
 * Update employee
 */
export const updateEmployee = async (id, updateData) => {
    let employee = await getEmployeeByIdOrEmpId(id);

    // If updating email or employeeId, check for duplicates
    if (updateData.email || updateData.employeeId) {
        const query = { _id: { $ne: employee._id }, $or: [] };
        if (updateData.email) query.$or.push({ email: updateData.email.toLowerCase().trim() });
        if (updateData.employeeId) query.$or.push({ employeeId: updateData.employeeId.trim() });
        
        if (query.$or.length > 0) {
            const existing = await Employee.findOne(query);
            if (existing) {
                throw ApiError.conflict('Email or Employee ID already in use by another employee');
            }
        }
    }

    // Prepare safe update body
    const safeBody = { ...updateData };
    if (safeBody.name) safeBody.name = safeBody.name.trim();
    if (safeBody.email) safeBody.email = safeBody.email.toLowerCase().trim();
    if (safeBody.employeeId) safeBody.employeeId = safeBody.employeeId.trim();

    // Do not allow updating password through this endpoint
    delete safeBody.password;

    Object.assign(employee, safeBody);
    await employee.save();

    logger.info(`Updated employee: ${employee.employeeId}`);
    return employee;
};

/**
 * Delete employee
 */
export const deleteEmployee = async (id) => {
    const employee = await getEmployeeByIdOrEmpId(id);
    await Employee.findByIdAndDelete(employee._id);
    logger.info(`Deleted employee: ${employee.employeeId}`);
    return employee;
};

export default {
    getEmployees,
    getEmployeeByIdOrEmpId,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};
