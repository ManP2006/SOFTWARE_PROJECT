/**
 * PPS Payroll — Settings Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/settingsController.js';

const router = Router();

router.get('/', ctrl.getSettings);
router.put('/', ctrl.updateSettings);

export default router;
