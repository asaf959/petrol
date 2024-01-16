const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'stations';
const Station = sequelize.define('Station', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  number: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contact: {
    type: Sequelize.STRING,
    allowNull: false,
  },

}, { tableName });
module.exports = { Station };
