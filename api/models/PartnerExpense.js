const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'partner_expenses';
const PartnerExpense = sequelize.define('PartnerExpense', {
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

}, { tableName });
module.exports = { PartnerExpense };
