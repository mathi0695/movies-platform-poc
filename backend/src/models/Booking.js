import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Booking extends Model {}

Booking.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Shows', key: 'id' },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    convenienceFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    taxAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    bookingStatus: {
      type: DataTypes.ENUM('pending', 'confirmed', 'failed', 'expired', 'cancelled'),
      defaultValue: 'pending',
    },
    seats: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Booking',
    timestamps: true,
  }
);

export default Booking;
