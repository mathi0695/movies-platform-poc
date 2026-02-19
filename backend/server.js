import express from 'express';
import cors from 'cors';
import { config } from './src/config/config.js';
import { connectDB } from './src/config/database.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import movieRoutes from './src/routes/movieRoutes.js';
import theatreRoutes from './src/routes/theatreRoutes.js';
import screenRoutes from './src/routes/screenRoutes.js';
import showRoutes from './src/routes/showRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import ticketRoutes from './src/routes/ticketRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
await connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Movie Ticket Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: config.nodeEnv === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`✓ Movie Ticket Backend Server running on http://localhost:${config.port}`);
  console.log(`✓ Environment: ${config.nodeEnv}`);
});
