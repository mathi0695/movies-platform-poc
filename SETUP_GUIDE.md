# 🚀 Quick Start Guide

## Movie Ticket Booking Platform - Setup & Run Instructions

### ⚙️ System Requirements
- **Node.js** 16.0 or higher
- **npm** 7.0 or higher
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git** (optional, for version control)

---

## 🔧 Installation Steps

### STEP 1: MongoDB Setup

#### Option A: Local MongoDB
```bash
# On macOS (using Homebrew)
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows (Command Prompt as Admin)
mongod
```

Verify connection:
```bash
mongo --eval "db.version()"
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/movie-ticket-platform`
5. Update the `MONGODB_URI` in backend `.env` file

---

### STEP 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify installation
npm list

# Check .env file (should already exist with defaults)
cat .env
```

**Backend .env Contents (should look like this):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-ticket-platform
JWT_SECRET=your-super-secret-key-change-in-production-12345
JWT_EXPIRE=7d
NODE_ENV=development
```

**For MongoDB Atlas**, update the MONGODB_URI:
```
MONGODB_URI=mongodb+srv://yourUsername:yourPassword@yourcluster.mongodb.net/movie-ticket-platform?retryWrites=true&w=majority
```

---

### STEP 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Verify installation
npm list

# Check .env file
cat .env
```

**Frontend .env Contents (should already exist):**
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🎬 Running the Application

### Option A: Run Both in Terminal Tabs (Recommended)

**Terminal Tab 1 - Backend:**
```bash
cd backend
npm run dev

# Expected output:
# ✓ MongoDB connected successfully
# ✓ Movie Ticket Backend Server running on http://localhost:5000
# ✓ Environment: development
```

**Terminal Tab 2 - Frontend:**
```bash
cd frontend
npm run dev

# Expected output:
# VITE v5.0.0 ready in XXX ms
# ➜  Local:   http://localhost:3000/
# Browser will auto-open to the application
```

### Option B: Run in Background (macOS/Linux)

```bash
# Terminal 1 - Start Backend
cd backend && npm run dev &

# Terminal 2 - Start Frontend
cd frontend && npm run dev &

# To stop:
kill %1  # Stops backend
kill %2  # Stops frontend
```

---

## ✅ Verify Everything Works

### 1. Check Backend Health
```bash
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"Movie Ticket Backend is running"}
```

### 2. Check Frontend
- Open browser to http://localhost:3000
- You should see the CineHub home page
- Should have "Login" and "Register" buttons

### 3. Test Authentication
1. Click "Register"
2. Fill form:
   - Name: John Doe
   - Mobile: 9999999999
   - Email: john@example.com
   - Password: password123
3. Click Register
4. Should be logged in and redirected to home page

---

## 📊 Testing the Platform

### Test User Account
After registering, use these credentials to login:
- **Mobile**: 9999999999
- **Email**: john@example.com
- **Password**: password123

### User Roles

#### 1. Customer (Default)
- Browse movies
- Book tickets
- View bookings
- Manage profile

**Test Path:**
1. Login as customer
2. Browse home page
3. View "Browse Movies" (will be implemented in phase 2)

#### 2. Theatre Owner
**To create owner account:**
1. Register with checkbox "Register as Theatre Owner" (in phase 2)
2. Click "Dashboard" → Add Theatre
3. Fill theatre details
4. After admin approval, manage shows and screens

**Test Path:**
1. Create a theatre (pending approval)
2. Go to Owner Dashboard
3. Create screens and seating layouts
4. Publish shows

#### 3. Admin
**To become admin:**
1. Only through database - set role to 'admin' in MongoDB:
```bash
mongo
use movie-ticket-platform
db.users.updateOne({email:"admin@example.com"}, {$set:{role:"admin"}})
```

**Admin Features:**
1. Click "Admin" in navbar
2. View dashboard stats
3. Manage movies
4. Approve theatres
5. Manage users

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify MongoDB is accessible on port 27017

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port 5000 (macOS/Linux)
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Frontend Can't Connect to Backend
```
Error: Network Error
```
**Solution:**
- Ensure backend is running on 5000
- Check VITE_API_URL in frontend `.env`
- Verify no firewall blocking port 5000

### Module Not Found Error
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Already configured in backend
- Ensure backend is running before frontend
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📁 Project Structure Reference

```
movie-ticket-platform/
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB & JWT config
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth & validation
│   │   └── utils/        # Helpers (JWT, QR codes)
│   ├── server.js         # App entry point
│   ├── .env              # Environment vars
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API calls
│   │   ├── context/      # Auth context
│   │   ├── styles/       # Theme & styles
│   │   ├── App.jsx       # Main app
│   │   └── main.jsx      # Entry point
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite config
│   ├── .env              # Environment vars
│   └── package.json
│
└── README.md             # Full documentation
```

---

## 🚀 API Testing

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "mobile": "9999999999",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9999999999",
    "password": "password123"
  }'
```

#### Get All Movies
```bash
curl http://localhost:5000/api/movies
```

#### Create Movie (requires token)
```bash
curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Avengers",
    "certification": "UA",
    "durationMinutes": 150,
    "releaseDate": "2024-01-01",
    "language": ["English"],
    "genre": ["Action", "Sci-Fi"],
    "synopsis": "Superheroes save the world"
  }'
```

---

## 📱 Frontend Routes

| Route | Description | Auth Required |
|-------|-------------|---|
| `/` | Home page | No |
| `/login` | Login page | No |
| `/register` | Register page | No |
| `/profile` | User profile | Yes |
| `/bookings` | My bookings | Yes |
| `/owner/dashboard` | Owner dashboard | Yes (Owner) |
| `/admin/dashboard` | Admin dashboard | Yes (Admin) |

---

## 🔒 Security Notes

1. **Change JWT Secret in Production**
   - Update `JWT_SECRET` in backend `.env`
   - Use a strong 32+ character secret

2. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` for git
   - Different secrets for dev/prod

3. **MongoDB Credentials**
   - Use strong passwords
   - Enable IP whitelisting (MongoDB Atlas)
   - Use connection strings with credentials

4. **CORS**
   - Currently allows all origins
   - In production, set specific domains

---

## 📚 Next Steps

1. ✅ **Complete Basic Setup** (You are here)
2. ⬜ Browse and search movies
3. ⬜ Create theatre and manage screens
4. ⬜ Create and publish shows
5. ⬜ Book tickets and generate QR codes
6. ⬜ Admin approval workflows
7. ⬜ Analytics and reporting

---

## 💡 Tips

- **Dev Mode**: Hot reload enabled for both frontend and backend
- **Database**: MongoDB stores all data persistently
- **API Testing**: Use Postman or Thunder Client for API testing
- **Browser DevTools**: F12 to check frontend errors
- **Server Logs**: Watch terminal for backend errors

---

## 🆘 Getting Help

1. Check browser console for frontend errors (F12)
2. Check terminal for backend errors
3. Verify all ports are available (5000, 3000)
4. Ensure MongoDB is running
5. Restart both services if issues persist

---

**🎬 You're all set! Enjoy building the Movie Ticket Booking Platform!**

For detailed API documentation, see [README.md](./README.md)
