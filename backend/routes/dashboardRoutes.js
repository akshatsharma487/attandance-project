import express from 'express';
import {
  getAdminDashboard,
  getManagerDashboard,
  getEmployeeDashboard,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/manager', authorize('manager'), getManagerDashboard);
router.get('/employee', authorize('employee'), getEmployeeDashboard);

export default router;
