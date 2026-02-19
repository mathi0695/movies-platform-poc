import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Card,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  TextField,
} from '@mui/material';
import QRCode from 'qrcode.react';
import { bookingService, ticketService } from '../services';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme';

export const MyBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (booking) => {
    try {
      const response = await ticketService.getByBooking(booking._id);
      setSelectedBooking({ ...booking, ticket: response.data.ticket });
      setOpenDetailDialog(true);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancel(bookingId);
        fetchBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return theme.success;
      case 'pending':
        return theme.warning;
      case 'cancelled':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: theme.primary, fontWeight: 'bold', mb: 4 }}>
        🎫 My Bookings
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : bookings.length === 0 ? (
        <Alert severity="info" sx={{ backgroundColor: `${theme.primary}20` }}>
          No bookings yet. Start booking your movie tickets!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking._id}>
              <Card
                sx={{
                  backgroundColor: theme.surface,
                  border: `2px solid ${theme.primary}`,
                  p: 3,
                  borderRadius: '12px',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" sx={{ color: theme.text, fontWeight: 'bold', mb: 1 }}>
                      📽️ {booking.showId?.movieId?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 0.5 }}>
                      🎭 Theatre: {booking.showId?.theatreId?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 0.5 }}>
                      📅 Date: {new Date(booking.showId?.showDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 0.5 }}>
                      🕐 Time: {booking.showId?.startTime}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                      💺 Seats: {booking.seats?.map((s) => `${s.rowLabel}${s.seatNumber}`).join(', ') || 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                      <Chip
                        label={booking.bookingStatus.toUpperCase()}
                        sx={{
                          backgroundColor: `${getStatusColor(booking.bookingStatus)}40`,
                          color: getStatusColor(booking.bookingStatus),
                          fontWeight: 'bold',
                        }}
                      />
                      <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 'bold' }}>
                        ₹{booking.totalAmount}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                        Booked: {new Date(booking.createdAt).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleViewDetails(booking)}
                          sx={{
                            backgroundColor: theme.primary,
                            color: theme.secondary,
                            fontWeight: 'bold',
                          }}
                        >
                          View Ticket
                        </Button>
                        {booking.bookingStatus === 'confirmed' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleCancelBooking(booking._id)}
                            sx={{
                              color: theme.error,
                              borderColor: theme.error,
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Ticket Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ backgroundColor: theme.surface, p: 3 }}>
          {selectedBooking && selectedBooking.ticket && (
            <>
              <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 'bold', mb: 2 }}>
                🎫 Ticket Details
              </Typography>

              <Card sx={{ backgroundColor: theme.secondary, p: 2, mb: 2, borderRadius: '8px' }}>
                <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 'bold', mb: 1 }}>
                  {selectedBooking.ticket.movieName}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.text, mb: 0.5 }}>
                  📍 {selectedBooking.ticket.theatreName}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.text, mb: 0.5 }}>
                  🎬 Screen: {selectedBooking.ticket.screenName}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.text, mb: 2 }}>
                  📅 {new Date(selectedBooking.ticket.showDate).toLocaleDateString()} at {selectedBooking.ticket.startTime}
                </Typography>

                <Typography variant="h6" sx={{ color: theme.text, fontWeight: 'bold', mb: 1 }}>
                  Ticket Code: {selectedBooking.ticket.ticketCode}
                </Typography>

                <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 2 }}>
                  Seats: {selectedBooking.ticket.seatDetails}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {selectedBooking.ticket.qrCodeUrl && (
                    <img
                      src={selectedBooking.ticket.qrCodeUrl}
                      alt="QR Code"
                      style={{ width: '200px', height: '200px' }}
                    />
                  )}
                </Box>

                <Chip
                  label={selectedBooking.ticket.status.toUpperCase()}
                  sx={{
                    backgroundColor: selectedBooking.ticket.status === 'active' ? `${theme.success}40` : `${theme.error}40`,
                    color: selectedBooking.ticket.status === 'active' ? theme.success : theme.error,
                    fontWeight: 'bold',
                  }}
                />
              </Card>

              <Button
                fullWidth
                variant="contained"
                onClick={() => setOpenDetailDialog(false)}
                sx={{
                  backgroundColor: theme.primary,
                  color: theme.secondary,
                  fontWeight: 'bold',
                }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Dialog>
    </Container>
  );
};
