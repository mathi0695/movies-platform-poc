import express from 'express';
import {
  getAllTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
  getTheatresByOwner,
} from '../controllers/theatreController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllTheatres);
router.get('/:id', getTheatreById);
router.post('/', authenticate, authorize('owner'), createTheatre);
router.put('/:id', authenticate, authorize('owner', 'admin'), updateTheatre);
router.delete('/:id', authenticate, authorize('owner', 'admin'), deleteTheatre);
router.get('/owner/my-theatres', authenticate, authorize('owner'), getTheatresByOwner);

export default router;
