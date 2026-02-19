import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminMovies } from './pages/AdminMovies';
import { AdminApproveTheatres } from './pages/AdminApproveTheatres';
import { AdminUsers } from './pages/AdminUsers';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';

import { theme as themeConfig } from './styles/theme';

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: themeConfig.primary,
    },
    secondary: {
      main: themeConfig.secondary,
    },
    background: {
      default: themeConfig.background,
      paper: themeConfig.surface,
    },
    text: {
      primary: themeConfig.text,
      secondary: themeConfig.textSecondary,
    },
    success: {
      main: themeConfig.success,
    },
    warning: {
      main: themeConfig.warning,
    },
    error: {
      main: themeConfig.error,
    },
    info: {
      main: themeConfig.info,
    },
  },
  typography: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
});

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: themeConfig.background,
      }}>
        <div style={{ color: themeConfig.primary, fontSize: '24px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute user={user}>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute user={user} requiredRole={['owner', 'admin']}>
                <OwnerDashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} requiredRole={['admin']}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/movies"
            element={
              <ProtectedRoute user={user} requiredRole={['admin']}>
                <AdminMovies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/approve-theatres"
            element={
              <ProtectedRoute user={user} requiredRole={['admin']}>
                <AdminApproveTheatres />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute user={user} requiredRole={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
