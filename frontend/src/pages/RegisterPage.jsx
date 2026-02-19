import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.mobile || !formData.password) {
      setError('Name, mobile, and password are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.mobile, formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
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
          Create Account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: theme.text,
                '& fieldset': { borderColor: theme.primary },
                '&:hover fieldset': { borderColor: theme.primary },
              },
            }}
          />

          <TextField
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: theme.text,
                '& fieldset': { borderColor: theme.primary },
                '&:hover fieldset': { borderColor: theme.primary },
              },
            }}
          />

          <TextField
            label="Email (Optional)"
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
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: theme.text,
                '& fieldset': { borderColor: theme.primary },
                '&:hover fieldset': { borderColor: theme.primary },
              },
            }}
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: theme.text,
                '& fieldset': { borderColor: theme.primary },
                '&:hover fieldset': { borderColor: theme.primary },
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isOwner}
                onChange={(e) => setIsOwner(e.target.checked)}
                sx={{ color: theme.primary }}
              />
            }
            label="Register as Theatre Owner"
            sx={{ color: theme.text }}
          />

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
              '&:hover': { backgroundColor: `${theme.primary}CC` },
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>

          <Typography sx={{ color: theme.textSecondary, textAlign: 'center' }}>
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{
                color: theme.primary,
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              Login
            </span>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};
