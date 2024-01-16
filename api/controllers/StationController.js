const { Station } = require('../models');
const { FuelRecord } = require('../models');
const { FuelRecordLogs } = require('../models');
const { Vehicle } = require('../models');
const { Profit } = require('../models');


const StationController = () => {
  // To show all stations
  const index = async (req, res) => res.status(200)
    .json({
      isValid: true,
      data: await Station.findAll(),
    });
  // To create a new station
  const add = async (req, res) => {
    const {
      name,
      number,
      address,
      contact,
    } = req.body;
    try {
      await Station.create({
        name,
        number,
        address,
        contact,

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
  const updateStation = async (req, res) => {
    const {
      name,
      number,
      address,
      contact,
    } = req.body;
    try {
      const station = await Station.findByPk(req.params.id);
      if (station) {
        await station.update({
          name,
          number,
          address,
          contact,

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
  // To delete a resource
  const deleteStation = async (req, res) => {
    try {
      const station = await Station.findByPk(req.params.id);
      if (station) {
        station.destroy();

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

  // To show a resource
  const show = async (req, res) => {
    try {
      const station = await Station.findByPk(req.params.id);
      if (station) {
        return res.status(200)
          .json({
            isValid: true,
            data: station,
          });
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
          station_id: req.params.stationId,
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
          station_id: req.params.stationId,
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
    deleteStation,
    updateStation,
    show,
    fuelRecord,
    profit,
  };
};
module.exports = StationController;
