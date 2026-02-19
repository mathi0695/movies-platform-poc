import React, { useState, useEffect } from 'react';
import { Container, Card, Typography, Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services';
import { theme } from '../styles/theme';

export const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      setError('Failed to delete user');
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: theme.primary, fontWeight: 'bold' }}>
          👥 Manage Users
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
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Joined Date</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell sx={{ color: theme.text }}>{user.name}</TableCell>
                    <TableCell sx={{ color: theme.text }}>{user.email}</TableCell>
                    <TableCell sx={{ color: theme.text }}>{user.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography sx={{ color: theme.primary, fontWeight: 'bold' }}>
                        {user.role}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: theme.text }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDeleteUser(user._id)}
                        sx={{ color: theme.error, borderColor: theme.error }}
                      >
                        Delete
                      </Button>
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
