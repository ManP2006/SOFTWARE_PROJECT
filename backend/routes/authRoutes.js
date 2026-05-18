/**
 * ============================================
 * PPS Payroll — Auth Routes
 * ============================================
 *
 * POST /auth/register         — Register new user (admin/employee)
 * POST /auth/login            — Unified login (auto-detects role)
 * POST /auth/admin/login      — Admin-specific login
 * POST /auth/employee/login   — Employee-specific login
 * GET  /auth/profile          — Get authenticated user profile (protected)
 * PUT  /auth/change-password  — Change password (protected)
 */
import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import * as authCtrl from '../controllers/authController.js';

const router = Router();

// ── Public Routes ──────────────────────────
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/admin/login', authCtrl.adminLogin);
router.post('/employee/login', authCtrl.employeeLogin);

// ── Protected Routes ───────────────────────
router.get('/profile', authenticate, authCtrl.getProfile);
router.put('/profile', authenticate, authCtrl.updateProfile);
router.put('/change-password', authenticate, authCtrl.changePassword);

export default router;
