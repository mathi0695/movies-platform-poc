import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class ShowSeat extends Model {}

ShowSeat.init(
  {
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Shows', key: 'id' },
    },
    seatTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'SeatTemplates', key: 'id' },
    },
    rowLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seatType: {
      type: DataTypes.ENUM('Gold', 'Silver', 'Platinum', 'Recliner'),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('available', 'locked', 'booked'),
      defaultValue: 'available',
    },
    lockedByUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
    },
    lockExpiryTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'ShowSeat',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['showId', 'rowLabel', 'seatNumber'],
      },
    ],
  }
);

export default ShowSeat;
