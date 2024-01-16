const Sequelize = require('sequelize');
const { Profit } = require('../models');
const { Station } = require('../models');
const { Vehicle } = require('../models');

const calculateProfit = require('../helpers');

const ProfitController = () => {
  // To add a new profit
  const add = async (req, res) => {
    const {
      date,
      vehicleId,
      stationId,
      rent,
      fuelExpense,
      driverExpense,
      vehicleExpense,
      expense,
      driverName,
    } = req.body;
    try {
      await Profit.create({
        date,
        vehicle_id: vehicleId,
        station_id: stationId,
        rent,
        expense,
        driver_name: driverName,
        fuel_expense: fuelExpense,
        driver_expense: driverExpense,
        vehicle_expense: vehicleExpense,

      });

      return res.status(200)
        .json({ isValid: true });
    } catch (e) {
      if (e instanceof Sequelize.ForeignKeyConstraintError) {
        return res.status(500)
          .json({
            isValid: false,
            data: { error: 'Foreign key failed' },
          });
      }

      const errors = e.errors.map((item) => item.message);
      return res.status(500)
        .json({
          isValid: false,
          data: errors,
        });
    }
  };
  // listing of profit
  const index = async (req, res) => {
    res.status(200).json({
      isValid: true,
      data: await Profit.findAll({
        include: [
          {
            model: Vehicle, as: 'vehicle',
          },
          {
            model: Station, as: 'station',
          },
        ],
      }),
    });
  };
  // get profit by date
  const getProfit = async (req, res) => {
    const { date } = req.params;
    const profit = await Profit.findAll({
      where: Sequelize.where(Sequelize.fn('date', Sequelize.col('date')), '=', date),
      include: [
        {
          model: Vehicle, as: 'vehicle',
        },
        {
          model: Station, as: 'station',
        },
      ],
    });
    if (profit) {
      const data = await calculateProfit(profit);
      return res.status(200).json({
        isValid: true,
        data: profit,
        profit: data,
      });
    }

    return res.status(404).json({
      isValid: false,
      data: { message: 'Nothing found' },
    });
  };
  // get profit by id
  const getProfitById = async (req, res) => {
    const profit = await Profit.findByPk(req.params.id, {
      include: [
        {
          model: Vehicle, as: 'vehicle',
        },
        {
          model: Station, as: 'station',
        },
      ],
    });
    if (profit) {
      return res.status(200).json({
        isValid: true,
        data: profit,
      });
    }

    return res.status(404).json({
      isValid: false,
      data: { message: 'Nothing found' },
    });
  };
  // To update a resource
  const updateProfit = async (req, res) => {
    const {
      date,
      vehicleId,
      stationId,
      rent,
      fuelExpense,
      driverExpense,
      vehicleExpense,
      expense,
      driverName,
    } = req.body;
    try {
      const profit = await Profit.findByPk(req.params.id);
      if (profit) {
        await profit.update({
          date,
          vehicle_id: vehicleId,
          station_id: stationId,
          rent,
          expense,
          driver_name: driverName,
          fuel_expense: fuelExpense,
          driver_expense: driverExpense,
          vehicle_expense: vehicleExpense,

        });

        return res.status(200)
          .json({ isValid: true });
      }
      return res.status(404)
        .json({ isValid: false });
    } catch (e) {
      if (e instanceof Sequelize.ForeignKeyConstraintError) {
        return res.status(500)
          .json({
            isValid: false,
            data: { error: 'Foreign key failed' },
          });
      }
      const errors = e.errors.map((item) => item.message);
      return res.status(500)
        .json({
          isValid: false,
          data: errors,
        });
    }
  };
  // To delete a resource
  const deleteProfit = async (req, res) => {
    try {
      const profit = await Profit.findByPk(req.params.id);
      if (profit) {
        profit.destroy();

        return res.status(200)
          .json({ isValid: true });
      }

      return res.status(404)
        .json({ isValid: false });
    } catch (e) {
      const errors = e.errors.map((item) => item.message);
      return res.status(500)
        .json({
          isValid: false,
          data: errors,
        });
    }
  };
  return {
    add,
    index,
    getProfit,
    updateProfit,
    getProfitById,
    deleteProfit,
  };
};
module.exports = ProfitController;
