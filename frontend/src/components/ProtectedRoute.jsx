import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

export const ProtectedRoute = ({ user, requiredRole, children }) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <Container sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: theme.text, mb: 2 }}>
          Please login to continue
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{
            backgroundColor: theme.primary,
            color: theme.secondary,
            fontWeight: 'bold',
          }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return (
      <Container sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: theme.text, mb: 2 }}>
          You don't have access to this page
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: theme.primary,
            color: theme.secondary,
            fontWeight: 'bold',
          }}
        >
          Go Home
        </Button>
      </Container>
    );
  }

  return children;
};
