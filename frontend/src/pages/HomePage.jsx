import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { movieService } from '../services';
import { theme } from '../styles/theme';

export const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAll({
        status: 'running',
        search: searchTerm,
        genre: selectedGenre,
        language: selectedLanguage,
      });
      setMovies(response.data.movies);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMovies();
  };

  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.secondary} 0%, rgba(255,184,0,0.1) 100%)`,
          borderRadius: '12px',
          p: 4,
          mb: 4,
          border: `2px solid ${theme.primary}`,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: theme.primary,
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          🎬 Book Your Movie Tickets
        </Typography>
        <Typography variant="h6" sx={{ color: theme.textSecondary, mb: 3 }}>
          Discover and book tickets for the latest movies in your city
        </Typography>
      </Box>

      {/* Filter Section */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: theme.surface,
          border: `1px solid ${theme.primary}20`,
        }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.primary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSearch}
              sx={{
                backgroundColor: theme.primary,
                color: theme.secondary,
                fontWeight: 'bold',
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: theme.text, mb: 1 }}>
            Genre:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {genres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                sx={{
                  backgroundColor: selectedGenre === genre ? theme.primary : theme.secondary,
                  color: selectedGenre === genre ? theme.secondary : theme.text,
                  border: `2px solid ${theme.primary}`,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ color: theme.text, mb: 1 }}>
            Language:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {languages.map((lang) => (
              <Chip
                key={lang}
                label={lang}
                onClick={() => setSelectedLanguage(selectedLanguage === lang ? '' : lang)}
                sx={{
                  backgroundColor: selectedLanguage === lang ? theme.primary : theme.secondary,
                  color: selectedLanguage === lang ? theme.secondary : theme.text,
                  border: `2px solid ${theme.primary}`,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </Box>
      </Card>

      {/* Movies Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : movies.length === 0 ? (
        <Alert severity="info" sx={{ backgroundColor: `${theme.primary}20`, color: theme.text }}>
          No movies found. Try adjusting your filters.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {movies? movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
              <Card
                sx={{
                  backgroundColor: theme.surface,
                  border: `2px solid ${theme.primary}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 8px 24px rgba(255, 184, 0, 0.3)`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '250px',
                    backgroundColor: `${theme.primary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography sx={{ color: theme.textSecondary }}>🎬 No Poster</Typography>
                  )}
                </Box>

                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ color: theme.text, fontWeight: 'bold', mb: 1 }}>
                    {movie.name}
                  </Typography>

                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={movie.certification}
                      size="small"
                      sx={{ backgroundColor: theme.primary, color: theme.secondary }}
                    />
                    <Chip
                      label={`${movie.durationMinutes}m`}
                      size="small"
                      sx={{ backgroundColor: `${theme.primary}40`, color: theme.text }}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                    {movie.genre.join(', ')}
                  </Typography>

                  <Typography variant="caption" sx={{ color: theme.textSecondary, display: 'block', mt: 1 }}>
                    {movie.language.join(', ')}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: theme.primary,
                      color: theme.secondary,
                      fontWeight: 'bold',
                      mt: 2,
                      '&:hover': { backgroundColor: `${theme.primary}CC` },
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          )):null}
        </Grid>
      )}
    </Container>
  );
};
