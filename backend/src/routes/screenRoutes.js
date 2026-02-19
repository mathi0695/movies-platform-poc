import express from 'express';
import {
  createScreen,
  getScreensByTheatre,
  updateScreen,
  deleteScreen,
  createSeatingLayout,
  getSeatingLayout,
} from '../controllers/screenController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('owner'), createScreen);
router.get('/theatre/:theatreId', getScreensByTheatre);
router.put('/:id', authenticate, authorize('owner'), updateScreen);
router.delete('/:id', authenticate, authorize('owner'), deleteScreen);
router.post('/seating/layout', authenticate, authorize('owner'), createSeatingLayout);
router.get('/seating/layout/:screenId', getSeatingLayout);

export default router;
