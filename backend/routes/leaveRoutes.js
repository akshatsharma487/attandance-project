import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getTeamLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);
router.get('/team', authorize('manager', 'admin'), getTeamLeaves);
router.get('/all', authorize('admin'), getAllLeaves);
router.put('/:id/approve', authorize('manager', 'admin'), approveLeave);
router.put('/:id/reject', authorize('manager', 'admin'), rejectLeave);

export default router;
