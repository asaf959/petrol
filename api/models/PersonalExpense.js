const Sequelize = require('sequelize');
const sequelize = require('../../config/database');

const tableName = 'personal_expenses';
const PersonalExpense = sequelize.define('PersonalExpense', {
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
  type: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },

}, { tableName });
module.exports = { PersonalExpense };
