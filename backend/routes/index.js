/**
 * ============================================
 * PPS Payroll — Route Index (API Versioning)
 * ============================================
 * Central router that mounts all module routes
 * under the /api/v1 namespace.
 */
import { Router } from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import payrollRoutes from './payrollRoutes.js';
import leaveRoutes from './leaveRoutes.js';
import bonusDeductionRoutes from './bonusDeductionRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import taskRoutes from './taskRoutes.js';
import holidayRoutes from './holidayRoutes.js';

const router = Router();

// ── Public Routes ──
router.use('/auth', authRoutes);

// ── Protected Routes ──
// (Auth middleware can be applied here for all, or per-route in individual files)
router.use('/admin', adminRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/payroll', payrollRoutes);
router.use('/leaves', leaveRoutes);
router.use('/bonuses', bonusDeductionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);
router.use('/tasks', taskRoutes);
router.use('/holidays', holidayRoutes);

export default router;
