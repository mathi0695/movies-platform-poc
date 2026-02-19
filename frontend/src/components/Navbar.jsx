import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`,
        boxShadow: `0 4px 20px rgba(255, 184, 0, 0.2)`,
        borderBottom: `2px solid ${theme.primary}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold',
              color: theme.primary,
              '&:hover': { opacity: 0.8 },
            }}
            onClick={() => navigate('/')}
          >
            🎬 CINEHUB
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!user ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: theme.primary,
                    fontSize: '16px',
                    fontWeight: '500',
                    '&:hover': { backgroundColor: `${theme.primary}20` },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    backgroundColor: theme.primary,
                    color: theme.secondary,
                    fontSize: '16px',
                    fontWeight: '600',
                    '&:hover': { backgroundColor: `${theme.primary}CC` },
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/browse')}
                  sx={{
                    color: theme.text,
                    fontSize: '16px',
                    fontWeight: '500',
                    '&:hover': { color: theme.primary },
                  }}
                >
                  Browse Movies
                </Button>
                {user.role === 'owner' && (
                  <Button
                    color="inherit"
                    onClick={() => navigate('/owner/dashboard')}
                    sx={{
                      color: theme.text,
                      fontSize: '16px',
                      fontWeight: '500',
                      '&:hover': { color: theme.primary },
                    }}
                  >
                    Dashboard
                  </Button>
                )}
                {user.role === 'admin' && (
                  <Button
                    color="inherit"
                    onClick={() => navigate('/admin/dashboard')}
                    sx={{
                      color: theme.text,
                      fontSize: '16px',
                      fontWeight: '500',
                      '&:hover': { color: theme.primary },
                    }}
                  >
                    Admin
                  </Button>
                )}
                <Box onClick={handleMenuOpen} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ backgroundColor: theme.primary, color: theme.secondary, fontWeight: 'bold' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/bookings'); handleMenuClose(); }}>
                    My Bookings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
