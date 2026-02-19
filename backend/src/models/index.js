import User from './User.js';
import Movie from './Movie.js';
import Theatre from './Theatre.js';
import Screen from './Screen.js';
import Show from './Show.js';
import Booking from './Booking.js';
import SeatTemplate from './SeatTemplate.js';
import ShowSeat from './ShowSeat.js';
import Ticket from './Ticket.js';
import TicketScan from './TicketScan.js';

// Associations
Theatre.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Theatre, { foreignKey: 'ownerId', as: 'theatres' });

Screen.belongsTo(Theatre, { foreignKey: 'theatreId' });
Theatre.hasMany(Screen, { foreignKey: 'theatreId' });

Show.belongsTo(Movie, { foreignKey: 'movieId' });
Movie.hasMany(Show, { foreignKey: 'movieId' });

Show.belongsTo(Theatre, { foreignKey: 'theatreId' });
Theatre.hasMany(Show, { foreignKey: 'theatreId' });

Show.belongsTo(Screen, { foreignKey: 'screenId' });
Screen.hasMany(Show, { foreignKey: 'screenId' });

Booking.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Booking, { foreignKey: 'userId' });

Booking.belongsTo(Show, { foreignKey: 'showId' });
Show.hasMany(Booking, { foreignKey: 'showId' });

SeatTemplate.belongsTo(Screen, { foreignKey: 'screenId' });
Screen.hasMany(SeatTemplate, { foreignKey: 'screenId' });

ShowSeat.belongsTo(Show, { foreignKey: 'showId' });
Show.hasMany(ShowSeat, { foreignKey: 'showId' });

ShowSeat.belongsTo(SeatTemplate, { foreignKey: 'seatTemplateId' });
SeatTemplate.hasMany(ShowSeat, { foreignKey: 'seatTemplateId' });

ShowSeat.belongsTo(User, { foreignKey: 'lockedByUserId', as: 'lockedByUser' });
User.hasMany(ShowSeat, { foreignKey: 'lockedByUserId', as: 'lockedSeats' });

Ticket.belongsTo(Booking, { foreignKey: 'bookingId' });
Booking.hasMany(Ticket, { foreignKey: 'bookingId' });

TicketScan.belongsTo(Ticket, { foreignKey: 'ticketId' });
Ticket.hasMany(TicketScan, { foreignKey: 'ticketId' });

TicketScan.belongsTo(User, { foreignKey: 'scannedBy', as: 'scanner' });
User.hasMany(TicketScan, { foreignKey: 'scannedBy', as: 'scannedTickets' });

export {
  User,
  Movie,
  Theatre,
  Screen,
  Show,
  Booking,
  SeatTemplate,
  ShowSeat,
  Ticket,
  TicketScan,
};
