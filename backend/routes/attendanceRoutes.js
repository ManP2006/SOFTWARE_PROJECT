/**
 * PPS Payroll — Attendance Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/attendanceController.js';

const router = Router();

router.get('/', ctrl.getAttendance);
router.get('/today', ctrl.getTodayAttendance);
router.get('/summary', ctrl.getAttendanceSummary);
router.post('/checkin', ctrl.checkIn);
router.post('/checkout', ctrl.checkOut);
router.post('/', ctrl.markAttendance);
router.post('/bulk', ctrl.bulkMarkAttendance);
router.put('/:id', ctrl.updateAttendance);

export default router;
