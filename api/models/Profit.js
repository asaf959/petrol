const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const { Vehicle } = require('./Vehicle');
const { Station } = require('./Station');


const tableName = 'profits';
const Profit = sequelize.define('Profit', {
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  driver_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rent: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  fuel_expense: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  driver_expense: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  expense: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

}, { tableName });

Profit.belongsTo(Vehicle, { as: 'vehicle', foreignKey: 'vehicle_id' });
Profit.belongsTo(Station, { as: 'station', foreignKey: 'station_id' });

module.exports = { Profit };
