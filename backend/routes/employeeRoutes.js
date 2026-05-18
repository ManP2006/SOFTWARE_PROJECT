/**
 * PPS Payroll — Employee Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/employeeController.js';

const router = Router();

router.get('/', ctrl.getAllEmployees);
router.get('/:id', ctrl.getEmployee);
router.post('/', ctrl.createEmployee);
router.put('/:id', ctrl.updateEmployee);
router.delete('/:id', ctrl.deleteEmployee);

export default router;
