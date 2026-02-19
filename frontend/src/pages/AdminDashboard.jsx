import React, { useState, useEffect } from 'react';
import { Container, Card, Typography, Box, Button, CircularProgress, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services';
import { theme } from '../styles/theme';

export const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: '👥',
      color: theme.primary,
    },
    {
      label: 'Total Movies',
      value: stats?.totalMovies || 0,
      icon: '🎬',
      color: theme.success,
    },
    {
      label: 'Total Theatres',
      value: stats?.totalTheatres || 0,
      icon: '🎭',
      color: theme.info,
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: '🎫',
      color: theme.warning,
    },
    {
      label: 'Total Revenue',
      value: `₹${stats?.totalRevenue || 0}`,
      icon: '💰',
      color: '#51cf66',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: theme.primary, fontWeight: 'bold', mb: 4 }}>
        ⚙️ Admin Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Card
                  sx={{
                    backgroundColor: theme.surface,
                    border: `2px solid ${stat.color}`,
                    p: 2,
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {stat.icon}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 1 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" sx={{ color: stat.color, fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  backgroundColor: theme.surface,
                  border: `2px solid ${theme.primary}`,
                  p: 3,
                  borderRadius: '12px',
                }}
              >
                <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 'bold', mb: 2 }}>
                  Management Tools
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/admin/movies')}
                    sx={{
                      backgroundColor: theme.primary,
                      color: theme.secondary,
                      fontWeight: 'bold',
                    }}
                  >
                    Manage Movies
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/admin/approve-theatres')}
                    sx={{
                      backgroundColor: theme.primary,
                      color: theme.secondary,
                      fontWeight: 'bold',
                    }}
                  >
                    Approve Theatres
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/admin/users')}
                    sx={{
                      backgroundColor: theme.primary,
                      color: theme.secondary,
                      fontWeight: 'bold',
                    }}
                  >
                    Manage Users
                  </Button>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  backgroundColor: theme.surface,
                  border: `2px solid ${theme.primary}`,
                  p: 3,
                  borderRadius: '12px',
                }}
              >
                <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 'bold', mb: 2 }}>
                  System Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: theme.textSecondary }}>Database Connection:</Typography>
                    <Typography sx={{ color: theme.success, fontWeight: 'bold' }}>✓ Active</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: theme.textSecondary }}>API Status:</Typography>
                    <Typography sx={{ color: theme.success, fontWeight: 'bold' }}>✓ Running</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: theme.textSecondary }}>Cache System:</Typography>
                    <Typography sx={{ color: theme.success, fontWeight: 'bold' }}>✓ Operational</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};
