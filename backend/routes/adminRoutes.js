/**
 * PPS Payroll — Admin Routes
 */
import { Router } from 'express';
import * as ctrl from '../controllers/adminController.js';

const router = Router();

router.get('/profile/:id', ctrl.getProfile);
router.put('/profile/:id', ctrl.updateProfile);
router.post('/register', ctrl.registerAdmin);

export default router;
