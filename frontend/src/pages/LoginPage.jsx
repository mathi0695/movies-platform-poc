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
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    if (!formData.mobile && !formData.email) {
      setError('Mobile number or Email is required');
      setLoading(false);
      return;
    }

    const result = await login(formData.mobile, formData.email, formData.password);

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
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: theme.text,
                '& fieldset': { borderColor: theme.primary },
                '&:hover fieldset': { borderColor: theme.primary },
              },
              '& .MuiInputBase-input::placeholder': { color: theme.textSecondary },
            }}
          />

          <Typography sx={{ color: theme.textSecondary, textAlign: 'center' }}>OR</Typography>

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
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>

          <Typography sx={{ color: theme.textSecondary, textAlign: 'center' }}>
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{
                color: theme.primary,
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              Register
            </span>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};
