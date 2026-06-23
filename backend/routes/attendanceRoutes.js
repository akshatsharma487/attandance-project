import express from 'express';
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAttendanceHistory,
  getAllAttendance,
  getTeamAttendance,
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/today', getTodayAttendance);
router.get('/my-history', getMyAttendanceHistory);
router.get('/team', authorize('manager', 'admin'), getTeamAttendance);
router.get('/all', authorize('admin'), getAllAttendance);

export default router;
