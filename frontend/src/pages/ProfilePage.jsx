import React, { useState, useContext } from 'react';
import { Container, Card, TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services';
import { theme } from '../styles/theme';

export const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.updateProfile({
        name: formData.name,
        email: formData.email,
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card
        sx={{
          p: 4,
          backgroundColor: theme.surface,
          border: `2px solid ${theme.primary}`,
          borderRadius: '12px',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.primary,
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center',
          }}
        >
          👤 My Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: theme.text,
                '& fieldset': { borderColor: theme.primary },
                '&:hover fieldset': { borderColor: theme.primary },
              },
            }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: theme.text,
                '& fieldset': { borderColor: theme.primary },
                '&:hover fieldset': { borderColor: theme.primary },
              },
            }}
          />

          <TextField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            disabled
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: theme.textSecondary,
                '& fieldset': { borderColor: theme.primary },
              },
            }}
          />

          <Box sx={{ backgroundColor: `${theme.primary}20`, p: 2, borderRadius: '8px', mt: 2 }}>
            <Typography variant="body2" sx={{ color: theme.text, mb: 1 }}>
              <strong>Account Type:</strong> {user?.role.toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.textSecondary }}>
              Member since: {new Date(user?.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: theme.primary,
              color: theme.secondary,
              fontWeight: 'bold',
              py: 1.5,
              fontSize: '16px',
              mt: 2,
              '&:hover': { backgroundColor: `${theme.primary}CC` },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>

          <Button
            fullWidth
            onClick={logout}
            sx={{
              color: theme.error,
              fontWeight: 'bold',
              py: 1.5,
              fontSize: '16px',
              border: `2px solid ${theme.error}`,
            }}
          >
            Logout
          </Button>
        </Box>
      </Card>
    </Container>
  );
};
