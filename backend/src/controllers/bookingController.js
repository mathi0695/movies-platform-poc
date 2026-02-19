import ShowSeat from '../models/ShowSeat.js';
import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';
import { generateTicketCode, generateQRCode } from '../utils/ticket.js';

const SEAT_LOCK_DURATION = 5 * 60 * 1000; // 5 minutes
const CONVENIENCE_FEE = 50;
const TAX_PERCENTAGE = 5; // 5% tax

export const getShowSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const seats = await ShowSeat.find({ showId }).sort({ rowLabel: 1, seatNumber: 1 });

    // Group by row
    const layout = {};
    seats.forEach((seat) => {
      if (!layout[seat.rowLabel]) {
        layout[seat.rowLabel] = [];
      }
      layout[seat.rowLabel].push({
        id: seat._id,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        price: seat.price,
        status: seat.status,
      });
    });

    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seats', error: error.message });
  }
};

export const lockSeats = async (req, res) => {
  try {
    const { showId, seatIds } = req.body;

    if (!showId || !seatIds || seatIds.length === 0) {
      return res.status(400).json({ message: 'Show ID and seat IDs are required' });
    }

    // Check seat availability
    const seats = await ShowSeat.find({ _id: { $in: seatIds }, showId });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({ message: 'Some seats not found' });
    }

    const unavailableSeats = seats.filter((s) => s.status !== 'available');
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: 'Some seats are not available' });
    }

    // Lock seats
    const lockExpiryTime = new Date(Date.now() + SEAT_LOCK_DURATION);
    await ShowSeat.updateMany(
      { _id: { $in: seatIds } },
      {
        status: 'locked',
        lockedByUserId: req.user._id,
        lockExpiryTime,
      }
    );

    res.json({ message: 'Seats locked successfully', lockExpiryTime });
  } catch (error) {
    res.status(500).json({ message: 'Failed to lock seats', error: error.message });
  }
};

export const unlockExpiredSeats = async () => {
  try {
    const now = new Date();
    await ShowSeat.updateMany(
      {
        status: 'locked',
        lockExpiryTime: { $lt: now },
      },
      {
        status: 'available',
        lockedByUserId: null,
        lockExpiryTime: null,
      }
    );
  } catch (error) {
    console.error('Error unlocking expired seats:', error);
  }
};

export const createBooking = async (req, res) => {
  try {
    const { showId, seatIds } = req.body;

    if (!showId || !seatIds || seatIds.length === 0) {
      return res.status(400).json({ message: 'Show ID and seat IDs are required' });
    }

    // Unlock expired seats
    await unlockExpiredSeats();

    // Verify seats are locked by current user
    const seats = await ShowSeat.find({ _id: { $in: seatIds }, showId });

    const lockedByOtherUser = seats.filter(
      (s) => s.status !== 'locked' || s.lockedByUserId.toString() !== req.user._id.toString()
    );

    if (lockedByOtherUser.length > 0) {
      return res.status(400).json({ message: 'Seats are not locked or locked by another user' });
    }

    // Calculate total price
    const totalSeatsPrice = seats.reduce((sum, seat) => sum + seat.price, 0);
    const taxAmount = Math.round(totalSeatsPrice * (TAX_PERCENTAGE / 100));
    const totalAmount = totalSeatsPrice + CONVENIENCE_FEE + taxAmount;

    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      showId,
      totalAmount,
      convenienceFee: CONVENIENCE_FEE,
      taxAmount,
      bookingStatus: 'pending',
      seats: seats.map((seat) => ({
        showSeatId: seat._id,
        rowLabel: seat.rowLabel,
        seatNumber: seat.seatNumber,
        price: seat.price,
      })),
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        totalAmount: booking.totalAmount,
        convenienceFee: booking.convenienceFee,
        taxAmount: booking.taxAmount,
        bookingStatus: booking.bookingStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update booking status
    booking.bookingStatus = 'confirmed';
    await booking.save();

    // Update seats to booked
    await ShowSeat.updateMany(
      { _id: { $in: booking.seats.map((s) => s.showSeatId) } },
      {
        status: 'booked',
        lockedByUserId: null,
        lockExpiryTime: null,
      }
    );

    // Generate ticket
    const show = await Show.findById(booking.showId).populate('movieId').populate('theatreId').populate('screenId');

    const ticketCode = generateTicketCode();
    const qrCodeData = {
      ticketCode,
      bookingId: booking._id,
      showId: show._id,
      seats: booking.seats,
    };
    const qrCodeUrl = await generateQRCode(qrCodeData);

    const seatDetails = booking.seats
      .map((s) => `${s.rowLabel}${s.seatNumber}`)
      .join(', ');

    const ticket = new Ticket({
      bookingId: booking._id,
      ticketCode,
      qrCodeUrl,
      movieName: show.movieId.name,
      theatreName: show.theatreId.name,
      screenName: show.screenId.name,
      showDate: show.showDate,
      startTime: show.startTime,
      seatDetails,
    });

    await ticket.save();

    res.json({
      message: 'Booking confirmed and ticket generated',
      booking,
      ticket: {
        id: ticket._id,
        ticketCode: ticket.ticketCode,
        qrCodeUrl: ticket.qrCodeUrl,
        movieName: ticket.movieName,
        theatreName: ticket.theatreName,
        screenName: ticket.screenName,
        showDate: ticket.showDate,
        startTime: ticket.startTime,
        seatDetails: ticket.seatDetails,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to confirm booking', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('showId', 'movieId theatreId screenId showDate startTime endTime')
      .sort({ createdAt: -1 });

    const bookingsWithTickets = await Promise.all(
      bookings.map(async (booking) => {
        const ticket = await Ticket.findOne({ bookingId: booking._id });
        return { ...booking.toObject(), ticket };
      })
    );

    res.json({ bookings: bookingsWithTickets });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Release seats
    await ShowSeat.updateMany(
      { _id: { $in: booking.seats.map((s) => s.showSeatId) } },
      { status: 'available', lockedByUserId: null, lockExpiryTime: null }
    );

    // Cancel ticket
    await Ticket.updateOne({ bookingId: booking._id }, { status: 'cancelled' });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

// Cron job to unlock expired seats every minute
setInterval(unlockExpiredSeats, 60000);
