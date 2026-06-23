import express from 'express';
import {
  getAllRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllRoles);
router.get('/:id', getRole);
router.post('/', authorize('admin'), createRole);
router.put('/:id', authorize('admin'), updateRole);
router.delete('/:id', authorize('admin'), deleteRole);

export default router;
