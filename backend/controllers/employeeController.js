/**
 * ============================================
 * PPS Payroll — Employee Controller
 * ============================================
 */
import * as employeeService from '../services/employeeService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * GET /api/v1/employees
 * Supports query params: page, limit, search, status, dept, role, sortBy, sortOrder
 */
export const getAllEmployees = asyncHandler(async (req, res) => {
    const { employees, meta } = await employeeService.getEmployees(req.query);
    
    // Maintain backward compatibility by putting total count in the root meta and count property
    ApiResponse.ok('Employees fetched', employees, { 
        ...meta,
        count: meta.total // specific for existing frontend usage
    }).send(res);
});

/**
 * GET /api/v1/employees/:id
 */
export const getEmployee = asyncHandler(async (req, res) => {
    const employee = await employeeService.getEmployeeByIdOrEmpId(req.params.id);
    ApiResponse.ok('Employee fetched', employee).send(res);
});

/**
 * POST /api/v1/employees
 */
export const createEmployee = asyncHandler(async (req, res) => {
    // Map fields from user request format if necessary, keeping backward compatibility
    const employeeData = {
        ...req.body,
        name: req.body.fullName || req.body.name,
        dept: req.body.department || req.body.dept,
        role: req.body.designation || req.body.role,
        monthlySalary: req.body.salary || req.body.monthlySalary,
        location: req.body.address || req.body.location,
    };

    const newEmployee = await employeeService.createEmployee(employeeData);
    
    // Some frontend components might expect the full list back after creation
    const { employees, meta } = await employeeService.getEmployees({ limit: 1000 });

    ApiResponse.created('Employee created successfully', employees, {
        ...meta,
        count: meta.total,
        newEmployee // include the newly created employee separately if needed
    }).send(res);
});

/**
 * PUT /api/v1/employees/:id
 */
export const updateEmployee = asyncHandler(async (req, res) => {
    // Map fields from user request format if necessary
    const updateData = { ...req.body };
    if (updateData.fullName) updateData.name = updateData.fullName;
    if (updateData.department) updateData.dept = updateData.department;
    if (updateData.designation) updateData.role = updateData.designation;
    if (updateData.salary !== undefined) updateData.monthlySalary = updateData.salary;
    if (updateData.address) updateData.location = updateData.address;

    const updatedEmployee = await employeeService.updateEmployee(req.params.id, updateData);
    ApiResponse.ok('Employee updated successfully', updatedEmployee).send(res);
});

/**
 * DELETE /api/v1/employees/:id
 */
export const deleteEmployee = asyncHandler(async (req, res) => {
    await employeeService.deleteEmployee(req.params.id);
    
    // Frontend expects the full list back
    const { employees, meta } = await employeeService.getEmployees({ limit: 1000 });
    
    ApiResponse.ok('Employee deleted successfully', employees, {
        ...meta,
        count: meta.total
    }).send(res);
});
