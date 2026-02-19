import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Screen extends Model {}

Screen.init(
  {
    theatreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Theatres', key: 'id' },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    screenType: {
      type: DataTypes.ENUM('IMAX', '3D', '2D', 'Dolby'),
      allowNull: false,
    },
    soundType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoFormat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Screen',
    timestamps: true,
  }
);

export default Screen;
