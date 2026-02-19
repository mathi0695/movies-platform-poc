import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class SeatTemplate extends Model {}

SeatTemplate.init(
  {
    screenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Screens', key: 'id' },
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
    basePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'disabled'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'SeatTemplate',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['screenId', 'rowLabel', 'seatNumber'],
      },
    ],
  }
);

export default SeatTemplate;
