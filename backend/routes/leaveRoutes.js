/**
 * PPS Payroll — Leave Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/leaveController.js';

const router = Router();

// Leave Requests
router.get('/', ctrl.getLeaveRequests);
router.get('/employee/:empId', ctrl.getEmployeeLeaves);
router.post('/', ctrl.createLeaveRequest);
router.patch('/:id/status', ctrl.updateLeaveStatus);
router.delete('/:id', ctrl.deleteLeaveRequest);

// Leave Types
router.get('/types', ctrl.getLeaveTypes);
router.post('/types', ctrl.createLeaveType);
router.put('/types/:id', ctrl.updateLeaveType);
router.delete('/types/:id', ctrl.deleteLeaveType);

export default router;
