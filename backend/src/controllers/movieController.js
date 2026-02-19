import Movie from '../models/Movie.js';

export const getAllMovies = async (req, res) => {
  try {
    const { status, genre, language, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (genre) filter.genre = { $in: genre.split(',') };
    if (language) filter.language = { $in: language.split(',') };
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: 'i' } }, { synopsis: { $regex: search, $options: 'i' } }];
    }

    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.json({ movies });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ movie });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movie', error: error.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    const { name, certification, durationMinutes, releaseDate, language, genre, synopsis, posterUrl, crew } = req.body;

    if (!name || !certification || !durationMinutes || !releaseDate || !language || !genre || !synopsis) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const movie = new Movie({
      name,
      certification,
      durationMinutes,
      releaseDate,
      language: Array.isArray(language) ? language : [language],
      genre: Array.isArray(genre) ? genre : [genre],
      synopsis,
      posterUrl,
      crew: crew || [],
    });

    await movie.save();
    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create movie', error: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { name, certification, durationMinutes, releaseDate, language, genre, synopsis, posterUrl, status, crew } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        name,
        certification,
        durationMinutes,
        releaseDate,
        language: Array.isArray(language) ? language : [language],
        genre: Array.isArray(genre) ? genre : [genre],
        synopsis,
        posterUrl,
        status,
        crew,
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie', error: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete movie', error: error.message });
  }
};
