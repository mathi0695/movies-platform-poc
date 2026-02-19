import express from 'express';
import {
  getShowSeats,
  lockSeats,
  createBooking,
  confirmBooking,
  getUserBookings,
  cancelBooking,
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/show/:showId/seats', getShowSeats);
router.post('/seats/lock', authenticate, lockSeats);
router.post('/', authenticate, createBooking);
router.post('/confirm', authenticate, confirmBooking);
router.get('/my-bookings', authenticate, getUserBookings);
router.delete('/:bookingId', authenticate, cancelBooking);

export default router;
