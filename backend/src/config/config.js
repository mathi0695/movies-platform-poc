import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  postgresUri: "postgres://postgres:example@localhost:5431/batch05",
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-ticket-platform',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};
