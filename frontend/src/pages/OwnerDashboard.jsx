import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { theatreService, screenService, showService } from '../services';
import { theme } from '../styles/theme';

export const OwnerDashboard = ({ user }) => {
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [openTheatreDialog, setOpenTheatreDialog] = useState(false);
  const [openScreenDialog, setOpenScreenDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);

  const [theatreForm, setTheatreForm] = useState({
    name: '',
    address: '',
    city: '',
    contactEmail: '',
    contactPhone: '',
    totalScreens: '',
  });

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const response = await theatreService.getMyTheatres();
      setTheatres(response.data.theatres);
    } catch (error) {
      console.error('Failed to fetch theatres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTheatre = async () => {
    try {
      await theatreService.create(theatreForm);
      setOpenTheatreDialog(false);
      setTheatreForm({
        name: '',
        address: '',
        city: '',
        contactEmail: '',
        contactPhone: '',
        totalScreens: '',
      });
      fetchTheatres();
    } catch (error) {
      console.error('Failed to create theatre:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: theme.primary, fontWeight: 'bold' }}>
          🎭 Theatre Owner Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenTheatreDialog(true)}
          sx={{
            backgroundColor: theme.primary,
            color: theme.secondary,
            fontWeight: 'bold',
          }}
        >
          + Add Theatre
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : theatres.length === 0 ? (
        <Alert severity="info" sx={{ backgroundColor: `${theme.primary}20` }}>
          No theatres added yet. Create your first theatre to get started!
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {theatres.map((theatre) => (
            <Card
              key={theatre._id}
              sx={{
                backgroundColor: theme.surface,
                border: `2px solid ${theatre.status === 'approved' ? theme.primary : theme.warning}`,
                p: 3,
                borderRadius: '12px',
              }}
            >
              <Typography variant="h6" sx={{ color: theme.text, fontWeight: 'bold', mb: 1 }}>
                {theatre.name}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 1 }}>
                📍 {theatre.city}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.textSecondary, mb: 2 }}>
                Screens: {theatre.totalScreens}
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  backgroundColor: theatre.status === 'approved' ? `${theme.success}40` : `${theme.warning}40`,
                  borderRadius: '20px',
                  mb: 2,
                }}
              >
                <Typography variant="caption" sx={{ color: theatre.status === 'approved' ? theme.success : theme.warning }}>
                  {theatre.status.charAt(0).toUpperCase() + theatre.status.slice(1)}
                </Typography>
              </Box>
              {theatre.status === 'approved' && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: theme.primary,
                      color: theme.secondary,
                      flex: 1,
                    }}
                  >
                    Manage
                  </Button>
                  <Button size="small" variant="outlined" sx={{ flex: 1, color: theme.primary, borderColor: theme.primary }}>
                    Shows
                  </Button>
                </Box>
              )}
            </Card>
          ))}
        </Box>
      )}

      {/* Create Theatre Dialog */}
      <Dialog open={openTheatreDialog} onClose={() => setOpenTheatreDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ backgroundColor: theme.surface, p: 3 }}>
          <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 'bold', mb: 2 }}>
            Create New Theatre
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Theatre Name"
              value={theatreForm.name}
              onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <TextField
              label="Address"
              value={theatreForm.address}
              onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <TextField
              label="City"
              value={theatreForm.city}
              onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <TextField
              label="Contact Email"
              value={theatreForm.contactEmail}
              onChange={(e) => setTheatreForm({ ...theatreForm, contactEmail: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <TextField
              label="Contact Phone"
              value={theatreForm.contactPhone}
              onChange={(e) => setTheatreForm({ ...theatreForm, contactPhone: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <TextField
              label="Total Screens"
              type="number"
              value={theatreForm.totalScreens}
              onChange={(e) => setTheatreForm({ ...theatreForm, totalScreens: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateTheatre}
                sx={{
                  backgroundColor: theme.primary,
                  color: theme.secondary,
                  fontWeight: 'bold',
                }}
              >
                Create
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenTheatreDialog(false)}
                sx={{ color: theme.primary, borderColor: theme.primary }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};
