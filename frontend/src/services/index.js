import apiClient from './api';

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

export const movieService = {
  getAll: (params) => apiClient.get('/movies', { params }),
  getAllMovies: () => apiClient.get('/movies'),
  getById: (id) => apiClient.get(`/movies/${id}`),
  create: (data) => apiClient.post('/movies', data),
  createMovie: (data) => apiClient.post('/movies', data),
  update: (id, data) => apiClient.put(`/movies/${id}`, data),
  updateMovie: (id, data) => apiClient.put(`/movies/${id}`, data),
  delete: (id) => apiClient.delete(`/movies/${id}`),
  deleteMovie: (id) => apiClient.delete(`/movies/${id}`),
};

export const theatreService = {
  getAll: (params) => apiClient.get('/theatres', { params }),
  getAllTheatres: () => apiClient.get('/theatres'),
  getById: (id) => apiClient.get(`/theatres/${id}`),
  create: (data) => apiClient.post('/theatres', data),
  update: (id, data) => apiClient.put(`/theatres/${id}`, data),
  delete: (id) => apiClient.delete(`/theatres/${id}`),
  getMyTheatres: () => apiClient.get('/theatres/owner/my-theatres'),
  approveTheatre: (theatreId) => apiClient.put(`/admin/theatres/${theatreId}/approve`),
  rejectTheatre: (theatreId) => apiClient.put(`/admin/theatres/${theatreId}/reject`),
};

export const screenService = {
  create: (data) => apiClient.post('/screens', data),
  getByTheatre: (theatreId) => apiClient.get(`/screens/theatre/${theatreId}`),
  update: (id, data) => apiClient.put(`/screens/${id}`, data),
  delete: (id) => apiClient.delete(`/screens/${id}`),
  createLayout: (data) => apiClient.post('/screens/seating/layout', data),
  getLayout: (screenId) => apiClient.get(`/screens/seating/layout/${screenId}`),
};

export const showService = {
  getAll: (params) => apiClient.get('/shows', { params }),
  getById: (id) => apiClient.get(`/shows/${id}`),
  create: (data) => apiClient.post('/shows', data),
  update: (id, data) => apiClient.put(`/shows/${id}`, data),
  delete: (id) => apiClient.delete(`/shows/${id}`),
  getByTheatre: (theatreId) => apiClient.get(`/shows/theatre/${theatreId}`),
};

export const bookingService = {
  getShowSeats: (showId) => apiClient.get(`/bookings/show/${showId}/seats`),
  lockSeats: (data) => apiClient.post('/bookings/seats/lock', data),
  create: (data) => apiClient.post('/bookings', data),
  confirm: (data) => apiClient.post('/bookings/confirm', data),
  getMyBookings: () => apiClient.get('/bookings/my-bookings'),
  cancel: (bookingId) => apiClient.delete(`/bookings/${bookingId}`),
};

export const ticketService = {
  validate: (data) => apiClient.post('/tickets/validate', data),
  markAsUsed: (data) => apiClient.post('/tickets/mark-used', data),
  getByBooking: (bookingId) => apiClient.get(`/tickets/booking/${bookingId}`),
  getScans: (ticketId) => apiClient.get(`/tickets/${ticketId}/scans`),
};

export const adminService = {
  getAllUsers: () => apiClient.get('/admin/users'),
  getUserById: (id) => apiClient.get(`/admin/users/${id}`),
  updateUserRole: (id, data) => apiClient.put(`/admin/users/${id}/role`, data),
  deactivateUser: (id) => apiClient.put(`/admin/users/${id}/deactivate`),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  getPendingTheatres: () => apiClient.get('/admin/theatres/pending'),
  approveTheatre: (theatreId, data) => apiClient.put(`/admin/theatres/${theatreId}/approve`, data),
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
};
