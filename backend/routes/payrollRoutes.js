/**
 * PPS Payroll — Payroll Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/payrollController.js';

const router = Router();

router.get('/', ctrl.getAllPayroll);
router.get('/summary', ctrl.getPayrollSummary);
router.get('/:id', ctrl.getPayrollById);
router.post('/run', ctrl.runPayroll);
router.post('/', ctrl.createPayroll);
router.put('/:id', ctrl.updatePayroll);
router.delete('/:id', ctrl.deletePayroll);

export default router;
