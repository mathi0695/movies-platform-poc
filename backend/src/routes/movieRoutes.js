import express from 'express';
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', authenticate, authorize('admin'), createMovie);
router.put('/:id', authenticate, authorize('admin'), updateMovie);
router.delete('/:id', authenticate, authorize('admin'), deleteMovie);

export default router;
