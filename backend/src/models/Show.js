import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Show extends Model {}

Show.init(
  {
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Movies', key: 'id' },
    },
    theatreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Theatres', key: 'id' },
    },
    screenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Screens', key: 'id' },
    },
    showDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    showType: {
      type: DataTypes.ENUM('Morning', 'Matinee', 'Evening', 'Night'),
      allowNull: false,
    },
    bookingOpenTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bookingCloseTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'cancelled'),
      defaultValue: 'active',
    },
    seatPricingOverride: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'Show',
    timestamps: true,
  }
);

export default Show;
