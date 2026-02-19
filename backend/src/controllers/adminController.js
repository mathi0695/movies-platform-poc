import User from '../models/User.js';
import Theatre from '../models/Theatre.js';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['customer', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to deactivate user', error: error.message });
  }
};

export const approvePendingTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find({ status: 'pending' });
    res.json({ theatres });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending theatres', error: error.message });
  }
};

export const approveTheatre = async (req, res) => {
  try {
    const { theatreId, status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const theatre = await Theatre.findByIdAndUpdate(req.params.theatreId, { status }, { new: true });

    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    res.json({ message: 'Theatre status updated successfully', theatre });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve theatre', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalMovies,
        totalTheatres,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};
