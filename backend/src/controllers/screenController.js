import Screen from '../models/Screen.js';
import SeatTemplate from '../models/SeatTemplate.js';

export const createScreen = async (req, res) => {
  try {
    const { theatreId, name, screenType, soundType, videoFormat, totalSeats } = req.body;

    if (!theatreId || !name || !screenType || !totalSeats) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const screen = new Screen({
      theatreId,
      name,
      screenType,
      soundType,
      videoFormat,
      totalSeats,
    });

    await screen.save();
    res.status(201).json({ message: 'Screen created successfully', screen });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create screen', error: error.message });
  }
};

export const getScreensByTheatre = async (req, res) => {
  try {
    const screens = await Screen.find({ theatreId: req.params.theatreId });
    res.json({ screens });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch screens', error: error.message });
  }
};

export const updateScreen = async (req, res) => {
  try {
    const { name, screenType, soundType, videoFormat, totalSeats } = req.body;
    const screen = await Screen.findByIdAndUpdate(
      req.params.id,
      { name, screenType, soundType, videoFormat, totalSeats },
      { new: true }
    );

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    res.json({ message: 'Screen updated successfully', screen });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update screen', error: error.message });
  }
};

export const deleteScreen = async (req, res) => {
  try {
    const screen = await Screen.findByIdAndDelete(req.params.id);
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }
    res.json({ message: 'Screen deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete screen', error: error.message });
  }
};

export const createSeatingLayout = async (req, res) => {
  try {
    const { screenId, layout } = req.body;

    if (!screenId || !layout) {
      return res.status(400).json({ message: 'Screen ID and layout are required' });
    }

    // Delete existing seats for this screen
    await SeatTemplate.deleteMany({ screenId });

    // Create new seats from layout
    const seats = [];
    layout.forEach((row) => {
      row.seats.forEach((seat) => {
        seats.push({
          screenId,
          rowLabel: row.row,
          seatNumber: seat.seatNumber,
          seatType: seat.seatType,
          basePrice: seat.basePrice,
          status: 'active',
        });
      });
    });

    await SeatTemplate.insertMany(seats);
    res.status(201).json({ message: 'Seating layout created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create seating layout', error: error.message });
  }
};

export const getSeatingLayout = async (req, res) => {
  try {
    const seats = await SeatTemplate.find({ screenId: req.params.screenId }).sort({ rowLabel: 1, seatNumber: 1 });

    // Group by row
    const layout = {};
    seats.forEach((seat) => {
      if (!layout[seat.rowLabel]) {
        layout[seat.rowLabel] = [];
      }
      layout[seat.rowLabel].push(seat);
    });

    res.json({ layout });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seating layout', error: error.message });
  }
};
