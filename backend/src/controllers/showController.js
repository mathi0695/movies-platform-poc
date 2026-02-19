import Show from '../models/Show.js';
import ShowSeat from '../models/ShowSeat.js';
import SeatTemplate from '../models/SeatTemplate.js';

export const createShow = async (req, res) => {
  try {
    const { movieId, theatreId, screenId, showDate, startTime, endTime, showType, bookingOpenTime, bookingCloseTime, seatPricingOverride } = req.body;

    if (!movieId || !theatreId || !screenId || !showDate || !startTime || !endTime || !showType || !bookingOpenTime || !bookingCloseTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for overlapping shows
    const existingShow = await Show.findOne({
      screenId,
      showDate: new Date(showDate),
      status: 'active',
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (existingShow) {
      return res.status(400).json({ message: 'Overlapping show already exists' });
    }

    const show = new Show({
      movieId,
      theatreId,
      screenId,
      showDate: new Date(showDate),
      startTime,
      endTime,
      showType,
      bookingOpenTime: new Date(bookingOpenTime),
      bookingCloseTime: new Date(bookingCloseTime),
      seatPricingOverride,
    });

    await show.save();

    // Copy seat template to show seats
    const seatTemplates = await SeatTemplate.find({ screenId });
    const showSeats = seatTemplates.map((template) => ({
      showId: show._id,
      seatTemplateId: template._id,
      rowLabel: template.rowLabel,
      seatNumber: template.seatNumber,
      seatType: template.seatType,
      price: seatPricingOverride?.[template.seatType] || template.basePrice,
      status: 'available',
    }));

    await ShowSeat.insertMany(showSeats);

    res.status(201).json({ message: 'Show created successfully', show });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create show', error: error.message });
  }
};

export const getShows = async (req, res) => {
  try {
    const { city, movieId, theatreId, date, language, showType } = req.query;
    const filter = { status: 'active' };

    if (movieId) filter.movieId = movieId;
    if (theatreId) filter.theatreId = theatreId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.showDate = { $gte: startDate, $lt: endDate };
    }
    if (showType) filter.showType = showType;

    const shows = await Show.find(filter)
      .populate('movieId', 'name duration_minutes certification language genre')
      .populate('theatreId', 'name city address')
      .populate('screenId', 'name screenType')
      .sort({ showDate: 1 });

    res.json({ shows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shows', error: error.message });
  }
};

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json({ show });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch show', error: error.message });
  }
};

export const updateShow = async (req, res) => {
  try {
    const { startTime, endTime, bookingOpenTime, bookingCloseTime, seatPricingOverride, status } = req.body;

    const show = await Show.findByIdAndUpdate(
      req.params.id,
      { startTime, endTime, bookingOpenTime, bookingCloseTime, seatPricingOverride, status },
      { new: true }
    );

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json({ message: 'Show updated successfully', show });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update show', error: error.message });
  }
};

export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json({ message: 'Show cancelled successfully', show });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete show', error: error.message });
  }
};

export const getShowsByTheatreOwner = async (req, res) => {
  try {
    const shows = await Show.find({ theatreId: req.params.theatreId })
      .populate('movieId')
      .populate('screenId')
      .sort({ showDate: 1 });

    res.json({ shows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shows', error: error.message });
  }
};
