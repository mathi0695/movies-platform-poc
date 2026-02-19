import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class TicketScan extends Model {}

TicketScan.init(
  {
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Tickets', key: 'id' },
    },
    scannedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    scannedTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('valid', 'invalid', 'already_used'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TicketScan',
    timestamps: true,
  }
);

export default TicketScan;
