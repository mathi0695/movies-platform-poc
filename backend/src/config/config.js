import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  postgresUri: 'postgres://postgres:GLgfst629%25%5E@landscor.chuai446a4du.ap-south-1.rds.amazonaws.com:5432/batch05',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-ticket-platform',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};
