const Sequelize = require('sequelize');
const sequelize = require('../../config/database');
const { Vehicle } = require('./Vehicle');
const { Station } = require('./Station');
const { FuelRecordLogs } = require('./FuelRecordLogs');


// const tableName = 'fuel_records';
// const FuelRecord = sequelize.define('FuelRecord', {
//   date: {
//     type: Sequelize.DATE,
//     allowNull: false,
//   },
//   driver_name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   fuel_type: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   total_amount: {
//     type: Sequelize.FLOAT,
//     allowNull: false,
//   },
//   amount_paid: {
//     type: Sequelize.FLOAT,
//     allowNull: false,
//   },
//   amount_remaining: {
//     type: Sequelize.FLOAT,
//     allowNull: false,
//   },
//   amount_return_date: {
//     type: Sequelize.JSON,
//     allowNull: false,
//   },
//   payment_type: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   bank_name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   status: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//   },

// }, { tableName });

// FuelRecord.belongsTo(Vehicle, { as: 'vehicle', foreignKey: 'vehicle_id' });
// FuelRecord.belongsTo(Station, { as: 'station', foreignKey: 'station_id' });
// FuelRecord.hasMany(FuelRecordLogs, { as: 'fuel_record_logs', onDelete: 'cascade', hooks: true });
// module.exports = { FuelRecord };

const tableName = 'fuel_records';
const FuelRecord = sequelize.define('FuelRecord', {
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  driver_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fuel_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  total_amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  amount_paid: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  amount_remaining: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  amount_return_date: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  payment_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bank_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },

}, { tableName });

FuelRecord.belongsTo(Vehicle, { as: 'vehicle', foreignKey: 'vehicle_id' });
FuelRecord.belongsTo(Station, { as: 'station', foreignKey: 'station_id' });
FuelRecord.hasMany(FuelRecordLogs, { as: 'fuel_record_logs', onDelete: 'cascade', hooks: true });
module.exports = { FuelRecord };
