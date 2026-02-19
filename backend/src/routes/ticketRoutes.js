import express from 'express';
import { validateTicket, markTicketAsUsed, getTicketByBooking, getTicketScans } from '../controllers/ticketController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', validateTicket);
router.post('/mark-used', authenticate, authorize('owner', 'admin'), markTicketAsUsed);
router.get('/booking/:bookingId', authenticate, getTicketByBooking);
router.get('/:ticketId/scans', authenticate, authorize('owner', 'admin'), getTicketScans);

export default router;
