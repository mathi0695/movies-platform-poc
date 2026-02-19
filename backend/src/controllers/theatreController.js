import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';
import SeatTemplate from '../models/SeatTemplate.js';

export const getAllTheatres = async (req, res) => {
  try {
    const { city, status, search } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const theatres = await Theatre.find(filter).populate('ownerId', 'name email mobile');
    res.json({ theatres });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch theatres', error: error.message });
  }
};

export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id).populate('ownerId', 'name email mobile');
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }
    res.json({ theatre });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch theatre', error: error.message });
  }
};

export const createTheatre = async (req, res) => {
  try {
    const { name, address, city, latitude, longitude, contactEmail, contactPhone, totalScreens } = req.body;

    if (!name || !address || !city || !contactEmail || !contactPhone || !totalScreens) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const theatre = new Theatre({
      ownerId: req.user._id,
      name,
      address,
      city,
      latitude,
      longitude,
      contactEmail,
      contactPhone,
      totalScreens,
    });

    await theatre.save();
    res.status(201).json({ message: 'Theatre created successfully', theatre });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create theatre', error: error.message });
  }
};

export const updateTheatre = async (req, res) => {
  try {
    const { name, address, city, latitude, longitude, contactEmail, contactPhone, totalScreens, status } = req.body;

    const theatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      { name, address, city, latitude, longitude, contactEmail, contactPhone, totalScreens, status },
      { new: true }
    );

    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    res.json({ message: 'Theatre updated successfully', theatre });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update theatre', error: error.message });
  }
};

export const deleteTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }
    res.json({ message: 'Theatre deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete theatre', error: error.message });
  }
};

export const getTheatresByOwner = async (req, res) => {
  try {
    const theatres = await Theatre.find({ ownerId: req.user._id });
    res.json({ theatres });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch theatres', error: error.message });
  }
};
