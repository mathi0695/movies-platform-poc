import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Ticket extends Model {}

Ticket.init(
  {
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Bookings', key: 'id' },
    },
    ticketCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    qrCodeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'used', 'cancelled'),
      defaultValue: 'active',
    },
    movieName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    theatreName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    screenName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    showDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seatDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Ticket',
    timestamps: true,
  }
);

export default Ticket;
