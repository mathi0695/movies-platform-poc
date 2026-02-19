import React, { useState, useEffect } from 'react';
import { Container, Card, Typography, Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, TextField, Alert, Select, MenuItem, FormControl, InputLabel, Chip, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services';
import { theme } from '../styles/theme';

export const AdminMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    certification: '',
    durationMinutes: '',
    releaseDate: '',
    language: [],
    genre: [],
    synopsis: '',
    posterUrl: '',
    crew: [],
    status: 'upcoming',
    rating: 0,
  });
  const [crewInput, setCrewInput] = useState({ name: '', role: '' });
  const [languageInput, setLanguageInput] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getAllMovies();
      setMovies(response.data.movies || []);
    } catch (error) {
      setError('Failed to fetch movies');
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData(movie);
    } else {
      setEditingMovie(null);
      setFormData({
        name: '',
        certification: '',
        durationMinutes: '',
        releaseDate: '',
        language: [],
        genre: [],
        synopsis: '',
        posterUrl: '',
        crew: [],
        status: 'upcoming',
        rating: 0,
      });
    }
    setCrewInput({ name: '', role: '' });
    setLanguageInput('');
    setGenreInput('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMovie(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !formData.language.includes(languageInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        language: [...prev.language, languageInput.trim()],
      }));
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (lang) => {
    setFormData((prev) => ({
      ...prev,
      language: prev.language.filter((l) => l !== lang),
    }));
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        genre: [...prev.genre, genreInput.trim()],
      }));
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (g) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.filter((gen) => gen !== g),
    }));
  };

  const handleAddCrew = () => {
    if (crewInput.name.trim() && crewInput.role.trim()) {
      setFormData((prev) => ({
        ...prev,
        crew: [...prev.crew, { ...crewInput }],
      }));
      setCrewInput({ name: '', role: '' });
    }
  };

  const handleRemoveCrew = (index) => {
    setFormData((prev) => ({
      ...prev,
      crew: prev.crew.filter((_, i) => i !== index),
    }));
  };

  const handleSaveMovie = async () => {
    try {
      if (editingMovie) {
        await movieService.updateMovie(editingMovie._id, formData);
      } else {
        await movieService.createMovie(formData);
      }
      fetchMovies();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save movie');
      console.error('Failed to save movie:', error);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await movieService.deleteMovie(movieId);
      fetchMovies();
    } catch (error) {
      setError('Failed to delete movie');
      console.error('Failed to delete movie:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: theme.primary, fontWeight: 'bold' }}>
          🎬 Manage Movies
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: theme.primary,
            color: theme.secondary,
            fontWeight: 'bold',
          }}
        >
          Add New Movie
        </Button>
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
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Genre</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Duration</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Language</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Release Date</TableCell>
                  <TableCell sx={{ color: theme.secondary, fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies && movies.length>0?movies.map((movie) => (
                  <TableRow key={movie._id}>
                    <TableCell sx={{ color: theme.text }}>{movie.name}</TableCell>
                    <TableCell sx={{ color: theme.text }}>{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</TableCell>
                    <TableCell sx={{ color: theme.text }}>{movie.durationMinutes} min</TableCell>
                    <TableCell sx={{ color: theme.text }}>{Array.isArray(movie.language) ? movie.language.join(', ') : movie.language}</TableCell>
                    <TableCell sx={{ color: theme.text }}>{new Date(movie.releaseDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenDialog(movie)}
                        sx={{ color: theme.primary, borderColor: theme.primary, mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDeleteMovie(movie._id)}
                        sx={{ color: theme.error, borderColor: theme.error }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )):null}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3, backgroundColor: theme.surface, maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ color: theme.primary, fontWeight: 'bold', mb: 2 }}>
            {editingMovie ? 'Edit Movie' : 'Add New Movie'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Movie Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { color: theme.text }, '& fieldset': { borderColor: theme.primary } }}>
              <InputLabel sx={{ color: theme.text }}>Certification</InputLabel>
              <Select
                name="certification"
                value={formData.certification}
                onChange={handleInputChange}
                label="Certification"
                sx={{
                  color: theme.text,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },
                  '& .MuiSvgIcon-root': { color: theme.text },
                }}
              >
                <MenuItem value="">Select Certification</MenuItem>
                <MenuItem value="U">U - Unrestricted Public Exhibition</MenuItem>
                <MenuItem value="UA">UA - Restricted for Children below 12</MenuItem>
                <MenuItem value="A">A - Restricted to Adults</MenuItem>
                <MenuItem value="S">S - Restricted to Specialized Audiences</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Duration (minutes)"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleInputChange}
              fullWidth
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <TextField
              label="Release Date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <Box>
              <Typography sx={{ color: theme.text, mb: 1, fontWeight: 'bold' }}>Languages</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Language"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: theme.primary },
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddLanguage}
                  sx={{ color: theme.primary, borderColor: theme.primary }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.language.map((lang) => (
                  <Chip
                    key={lang}
                    label={lang}
                    onDelete={() => handleRemoveLanguage(lang)}
                    sx={{
                      backgroundColor: theme.primary,
                      color: theme.secondary,
                    }}
                  />
                ))}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ color: theme.text, mb: 1, fontWeight: 'bold' }}>Genres</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Add Genre"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: theme.primary },
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddGenre}
                  sx={{ color: theme.primary, borderColor: theme.primary }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.genre.map((gen) => (
                  <Chip
                    key={gen}
                    label={gen}
                    onDelete={() => handleRemoveGenre(gen)}
                    sx={{
                      backgroundColor: theme.primary,
                      color: theme.secondary,
                    }}
                  />
                ))}
              </Box>
            </Box>
            <TextField
              label="Synopsis"
              name="synopsis"
              value={formData.synopsis}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <TextField
              label="Poster URL"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleInputChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <Box>
              <Typography sx={{ color: theme.text, mb: 1, fontWeight: 'bold' }}>Crew</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                <TextField
                  label="Crew Member Name"
                  value={crewInput.name}
                  onChange={(e) => setCrewInput({ ...crewInput, name: e.target.value })}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: theme.primary },
                    },
                  }}
                />
                <TextField
                  label="Crew Member Role"
                  value={crewInput.role}
                  onChange={(e) => setCrewInput({ ...crewInput, role: e.target.value })}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.text,
                      '& fieldset': { borderColor: theme.primary },
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddCrew}
                  sx={{ color: theme.primary, borderColor: theme.primary }}
                >
                  Add Crew Member
                </Button>
              </Box>
              <Box>
                {formData.crew.map((member, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      mb: 1,
                      backgroundColor: theme.primary + '20',
                      borderRadius: '4px',
                    }}
                  >
                    <Typography sx={{ color: theme.text }}>
                      {member.name} - {member.role}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleRemoveCrew(index)}
                      sx={{ color: theme.error }}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { color: theme.text }, '& fieldset': { borderColor: theme.primary } }}>
              <InputLabel sx={{ color: theme.text }}>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
                sx={{
                  color: theme.text,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },
                  '& .MuiSvgIcon-root': { color: theme.text },
                }}
              >
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="running">Running</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              fullWidth
              type="number"
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.text,
                  '& fieldset': { borderColor: theme.primary },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={handleCloseDialog} sx={{ color: theme.textSecondary }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveMovie}
                sx={{ backgroundColor: theme.primary, color: theme.secondary }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};
