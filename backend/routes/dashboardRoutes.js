/**
 * PPS Payroll — Dashboard Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/dashboardController.js';

const router = Router();

router.get('/stats', ctrl.getStats);
router.get('/payroll-chart', ctrl.getPayrollChart);

export default router;
