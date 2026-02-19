import Ticket from '../models/Ticket.js';
import TicketScan from '../models/TicketScan.js';

export const validateTicket = async (req, res) => {
  try {
    const { ticketCode } = req.body;

    const ticket = await Ticket.findOne({ ticketCode }).populate('bookingId');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found', status: 'invalid' });
    }

    if (ticket.status === 'used') {
      return res.json({ message: 'Ticket already used', status: 'already_used', ticket });
    }

    if (ticket.status === 'cancelled') {
      return res.json({ message: 'Ticket is cancelled', status: 'invalid', ticket });
    }

    res.json({ message: 'Ticket is valid', status: 'valid', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate ticket', error: error.message });
  }
};

export const markTicketAsUsed = async (req, res) => {
  try {
    const { ticketCode } = req.body;

    const ticket = await Ticket.findOne({ ticketCode });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status !== 'active') {
      return res.status(400).json({ message: 'Ticket cannot be marked as used' });
    }

    ticket.status = 'used';
    await ticket.save();

    // Log the scan
    const scan = new TicketScan({
      ticketId: ticket._id,
      scannedBy: req.user._id,
      status: 'valid',
    });
    await scan.save();

    res.json({ message: 'Ticket marked as used successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark ticket as used', error: error.message });
  }
};

export const getTicketByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const ticket = await Ticket.findOne({ bookingId });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ticket', error: error.message });
  }
};

export const getTicketScans = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const scans = await TicketScan.find({ ticketId }).populate('scannedBy', 'name email mobile');

    res.json({ scans });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch scans', error: error.message });
  }
};
