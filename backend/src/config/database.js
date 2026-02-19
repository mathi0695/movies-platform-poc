
import { Sequelize } from 'sequelize';
import { config } from './config.js';

export const sequelize = new Sequelize(config.postgresUri, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Postgres connected successfully');
  } catch (error) {
    console.error('✗ Postgres connection error:', error.message);
    process.exit(1);
  }
};
