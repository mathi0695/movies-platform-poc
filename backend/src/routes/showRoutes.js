import express from 'express';
import {
  createShow,
  getShows,
  getShowById,
  updateShow,
  deleteShow,
  getShowsByTheatreOwner,
} from '../controllers/showController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getShows);
router.get('/:id', getShowById);
router.post('/', authenticate, authorize('owner'), createShow);
router.put('/:id', authenticate, authorize('owner'), updateShow);
router.delete('/:id', authenticate, authorize('owner'), deleteShow);
router.get('/theatre/:theatreId', getShowsByTheatreOwner);

export default router;
