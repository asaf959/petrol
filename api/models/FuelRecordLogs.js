const Sequelize = require('sequelize');
const sequelize = require('../../config/database');


const tableName = 'fuel_record_logs';
const FuelRecordLogs = sequelize.define('FuelRecordLogs', {
  amount_paid: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  amount_remaining: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

}, { tableName });
module.exports = { FuelRecordLogs };
