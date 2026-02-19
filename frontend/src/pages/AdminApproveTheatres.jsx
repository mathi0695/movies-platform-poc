import React, { useState, useEffect } from 'react';
import { Container, Card, Typography, Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theatreService } from '../services';
import { theme } from '../styles/theme';

export const AdminApproveTheatres = () => {
  const navigate = useNavigate();
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const response = await theatreService.getAllTheatres();
      setTheatres(response.data || []);
    } catch (error) {
      setError('Failed to fetch theatres');
      console.error('Failed to fetch theatres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (theatreId) => {
    try {
      await theatreService.approveTheatre(theatreId);
      fetchTheatres();
    } catch (error) {
      setError('Failed to approve theatre');
      console.error('Failed to approve theatre:', error);
    }
  };

  const handleReject = async (theatreId) => {
    if (!window.confirm('Are you sure you want to reject this theatre?')) return;
    try {
      await theatreService.rejectTheatre(theatreId);
      fetchTheatres();
    } catch (error) {
      setError('Failed to reject theatre');
      console.error('Failed to reject theatre:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: theme.primary, fontWeight: 'bold' }}>
          🎭 Approve Theatres
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : (
        <Card sx={{ backgroundColor: theme.surface, borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.primary }}>
                <TableRow>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Theatre Name</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Owner</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>City</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {theatres.map((theatre) => (
                  <TableRow key={theatre._id}>
                    <TableCell sx={{ color: theme.text }}>{theatre.name}</TableCell>
                    <TableCell sx={{ color: theme.text }}>{theatre.ownerName}</TableCell>
                    <TableCell sx={{ color: theme.text }}>{theatre.city}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: theatre.isApproved ? theme.success : theme.warning,
                          fontWeight: 'bold',
                        }}
                      >
                        {theatre.isApproved ? 'Approved' : 'Pending'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {!theatre.isApproved && (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleApprove(theatre._id)}
                            sx={{ color: theme.success, borderColor: theme.success, mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleReject(theatre._id)}
                            sx={{ color: theme.error, borderColor: theme.error }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Container>
  );
};
