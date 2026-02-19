import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Movie extends Model {}

Movie.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certification: {
      type: DataTypes.ENUM('U', 'UA', 'A', 'S'),
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    language: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posterUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    crew: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'running', 'expired'),
      defaultValue: 'upcoming',
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: { min: 0, max: 10 },
    },
  },
  {
    sequelize,
    modelName: 'Movie',
    timestamps: true,
  }
);

export default Movie;
