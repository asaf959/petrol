const { Station } = require('../models');
const { FuelRecord } = require('../models');
const { FuelRecordLogs } = require('../models');
const { Vehicle } = require('../models');
const { Profit } = require('../models');

const VehicleController = () => {
  // To show all vehicles
  const index = async (req, res) => res.status(200)
    .json({
      isValid: true,
      data: await Vehicle.findAll(),
    });
  // To create a new vehicle
  const add = async (req, res) => {
    const {
      name,
      plateNumber,
      model,
      totalFuel,
    } = req.body;
    try {
      await Vehicle.create({
        name,
        plate_number: plateNumber,
        model,
        total_fuel: totalFuel,

      });
      return res.status(200)
        .json({ isValid: true });
    } catch (e) {
      const errors = e.errors.map((item) => item.message);
      return res.status(500)
        .json({
          isValid: false,
          data: errors,
        });
    }
  };
  // To update a resource
  const updateVehicle = async (req, res) => {
    const {
      name,
      plateNumber,
      model,
      totalFuel,
    } = req.body;
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (vehicle) {
        await vehicle.update({
          name,
          plate_number: plateNumber,
          model,
          total_fuel: totalFuel,

        });

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
  // To detle a resoruce
  const deleteVehicle = async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (vehicle) {
        vehicle.destroy();

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

  // To show a resoruce
  const show = async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (vehicle) {
        return res.status(200)
          .json({ isValid: true, data: vehicle });
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
  const fuelRecord = async (req, res) => {
    try {
      const fuelRecord = await FuelRecord.findAll({
        where: {
          vehicle_id: req.params.vehicleId,
        },
        include: [
          {
            model: FuelRecordLogs,
            as: 'fuel_record_logs',
          },
          {
            model: Vehicle,
            as: 'vehicle',
          },
          {
            model: Station,
            as: 'station',
          },
        ],
      });

      if (fuelRecord) {
        return res.status(200)
          .json({
            isValid: true,
            data: fuelRecord,
          });
      }
    } catch (e) {
      const errors = e.errors.map((item) => item.message);
      return res.status(500)
        .json({
          isValid: false,
          data: errors,
        });
    }
  };

  const profit = async (req, res) => {
    try {
      const profit = await Profit.findAll({
        where: {
          vehicle_id: req.params.vehicleId,
        },
        include: [
          {
            model: Vehicle, as: 'vehicle',
          },
          {
            model: Station, as: 'station',
          },
        ],
      });

      if (fuelRecord) {
        return res.status(200)
          .json({
            isValid: true,
            data: profit,
          });
      }
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
    deleteVehicle,
    updateVehicle,
    show,
    profit,
    fuelRecord,
  };
};
module.exports = VehicleController;
