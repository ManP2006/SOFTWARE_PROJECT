/**
 * PPS Payroll — Holiday Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/holidayController.js';

const router = Router();

router.get('/', ctrl.getHolidays);
router.post('/', ctrl.createHoliday);
router.put('/:id', ctrl.updateHoliday);
router.delete('/:id', ctrl.deleteHoliday);

export default router;
