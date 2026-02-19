import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  approvePendingTheatres,
  approveTheatre,
  getDashboardStats,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.get('/users/:id', authenticate, authorize('admin'), getUserById);
router.put('/users/:id/role', authenticate, authorize('admin'), updateUserRole);
router.put('/users/:id/deactivate', authenticate, authorize('admin'), deactivateUser);
router.get('/theatres/pending', authenticate, authorize('admin'), approvePendingTheatres);
router.put('/theatres/:theatreId/approve', authenticate, authorize('admin'), approveTheatre);
router.get('/dashboard/stats', authenticate, authorize('admin'), getDashboardStats);

export default router;
