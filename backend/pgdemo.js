import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('postgres://postgres:new_password@localhost:5432/movies')

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}