/**
 * PPS Payroll — Task Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/taskController.js';

const router = Router();

router.get('/', ctrl.getTasks);
router.get('/employee/:empId', ctrl.getEmployeeTasks);
router.post('/', ctrl.createTask);
router.patch('/:id/complete', ctrl.completeTask);
router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

export default router;
