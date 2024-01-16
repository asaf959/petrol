const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'vehicles';
const Vehicle = sequelize.define('Vehicle', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  plate_number: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  model: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  total_fuel: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

}, { tableName });
module.exports = { Vehicle };
