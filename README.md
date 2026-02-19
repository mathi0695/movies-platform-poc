# 🎬 Movie Ticket Booking Platform

A comprehensive full-stack application for booking movie tickets online. Built with React + Vite (Frontend), Express.js + Node.js (Backend), and MongoDB (Database).

## 📋 Features Implemented

### ✅ Core Features
- **User Authentication**: Register, login, profile management
- **Movie Management**: Browse, filter movies by genre, language, status
- **Theatre Management**: Theatre owners can register and manage theatres
- **Screen Management**: Manage multiple screens per theatre
- **Show Management**: Create and manage shows with seat assignments
- **Booking System**: Lock seats, calculate prices, confirm bookings
- **Ticket Generation**: Generate unique ticket codes with QR codes
- **Ticket Validation**: Validate and mark tickets as used
- **Admin Dashboard**: Manage users, approve theatres, view analytics

### ✅ Technical Features
- JWT authentication with secure token handling
- Password hashing with bcrypt
- Seat locking mechanism (5-minute auto-unlock)
- Real-time seat status management
- Automatic price calculation with taxes and convenience fees
- Role-based access control (Customer, Owner, Admin)
- Responsive Material-UI design
- Dark theme inspired by the provided screenshot

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **UI Library**: Material-UI 5.14
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Styling**: Material-UI + Custom CSS
- **QR Code**: qrcode.react

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **QR Generation**: qrcode
- **Validation**: express-validator
- **Utilities**: uuid

## 📁 Project Structure

```
movie-ticket-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and configuration
│   │   ├── controllers/      # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth and other middleware
│   │   ├── utils/           # Helper functions
│   │   └── services/        # Service layer
│   ├── server.js            # Main entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── context/        # React context (Auth)
│   │   ├── styles/         # Theme and global styles
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # React root
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── package.json
│
└── Prd.md                  # Product Requirements Document
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB (local or cloud - MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (`.env` already created):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movie-ticket-platform
   JWT_SECRET=your-super-secret-key-change-in-production-12345
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```
   - For MongoDB Atlas: Replace `MONGODB_URI` with your connection string
   - Change `JWT_SECRET` to a strong secret in production

4. **Start MongoDB**:
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - If using MongoDB Atlas, ensure your IP is whitelisted

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:5000`
   - API endpoints available at `http://localhost:5000/api`
   - Health check: `http://localhost:5000/api/health`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:3000`
   - Auto-opens in default browser

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Movies
- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Theatres
- `GET /api/theatres` - Get all theatres
- `GET /api/theatres/:id` - Get theatre details
- `POST /api/theatres` - Create theatre (Owner)
- `PUT /api/theatres/:id` - Update theatre (Owner/Admin)
- `DELETE /api/theatres/:id` - Delete theatre (Owner/Admin)
- `GET /api/theatres/owner/my-theatres` - Get user's theatres

### Shows
- `GET /api/shows` - Get shows (with filters)
- `GET /api/shows/:id` - Get show details
- `POST /api/shows` - Create show (Owner)
- `PUT /api/shows/:id` - Update show (Owner)
- `DELETE /api/shows/:id` - Cancel show (Owner)

### Bookings
- `GET /api/bookings/show/:showId/seats` - Get show seats
- `POST /api/bookings/seats/lock` - Lock seats (5 min)
- `POST /api/bookings` - Create booking
- `POST /api/bookings/confirm` - Confirm booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `DELETE /api/bookings/:bookingId` - Cancel booking

### Tickets
- `POST /api/tickets/validate` - Validate ticket
- `POST /api/tickets/mark-used` - Mark ticket as used
- `GET /api/tickets/booking/:bookingId` - Get booking ticket
- `GET /api/tickets/:ticketId/scans` - Get ticket scan history

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/deactivate` - Deactivate user
- `GET /api/admin/theatres/pending` - Get pending theatres
- `PUT /api/admin/theatres/:theatreId/approve` - Approve theatre
- `GET /api/admin/dashboard/stats` - Get dashboard stats

## 🎯 User Roles & Permissions

### Customer
- Browse movies and shows
- Book tickets
- View booking history
- Manage profile

### Theatre Owner
- Register and manage theatres
- Create and manage screens
- Publish and manage shows
- View booking statistics
- Validate tickets

### Admin
- Manage all movies
- Approve/reject theatres
- Manage user roles
- View platform analytics
- System management

## 🔐 Security Features

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Different permissions per role
- **Input Validation**: express-validator on backend
- **Seat Locking**: Prevents double-booking with 5-minute expiry
- **Token Refresh**: Automatic token handling in API client

## 💾 Database Schema

### Collections Created
1. **Users** - User accounts and authentication
2. **Movies** - Movie catalog with metadata
3. **Theatres** - Theatre information
4. **Screens** - Cinema screens
5. **SeatTemplates** - Seating layout templates
6. **Shows** - Movie shows/screenings
7. **ShowSeats** - Runtime seat mapping per show
8. **Bookings** - User ticket bookings
9. **Tickets** - Generated ticket information
10. **TicketScans** - Ticket validation logs

## 🧪 Testing the Application

### Test User Credentials
Use these for testing:
- **Mobile**: 9999999999
- **Email**: user@example.com
- **Password**: password123

### Testing Workflow

1. **Register** a new user at `/register`
2. **Login** with credentials at `/login`
3. **Browse movies** on home page
4. **Create theatre** (if Owner role)
5. **Manage shows** and **view bookings**

## 📝 Notes

- MongoDB must be running before starting the backend
- Frontend connects to backend at `http://localhost:5000`
- Seat locks auto-expire after 5 minutes
- Tax is calculated as 5% of seat price
- Convenience fee is ₹50 per booking
- QR codes are generated in Base64 format

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas for production
4. Use environment variables for all sensitive data
5. Deploy to services like Heroku, Render, or AWS

### Frontend
1. Run `npm run build`
2. Deploy `dist` folder to services like Vercel, Netlify, or AWS S3
3. Update API base URL for production

## 📞 Support

For issues or questions:
1. Check the PRD.md for feature specifications
2. Review API endpoint documentation above
3. Check browser console for frontend errors
4. Check server logs for backend errors

## 📄 License

This project is built as per PRD specifications for a Movie Ticket Booking Platform.

---

**Happy Booking! 🎬🎫**
# movies-platform-poc
