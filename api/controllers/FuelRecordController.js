const Sequelize = require('sequelize');
const { FuelRecord } = require('../models');
const { Station } = require('../models');
const { Vehicle } = require('../models');
const { FuelRecordLogs } = require('../models');

const FuelRecordController = () => {
  // To add a new fuel record
  const add = async (req, res) => {
    const {
      date,
      vehicleId,
      stationId,
      fuelType,
      totalAmount,
      amountPaid,
      paymentType,
      bankName,
      driverName,
      paymentStatus,
      amountRemaining,
      amountReturnDate,
    } = req.body;
    try {
      const actualAmountPaid = amountPaid;
      const fuelRecordObj = await FuelRecord.create({
        date,
        vehicle_id: vehicleId,
        station_id: stationId,
        fuel_type: fuelType,
        bank_name: bankName,
        driver_name: driverName,
        total_amount: totalAmount,
        amount_paid: actualAmountPaid,
        payment_type: paymentType,
        status: paymentStatus,
        amount_remaining: amountRemaining,
        amount_return_date: amountReturnDate,
      });
      await FuelRecordLogs.create({
        amount_paid: actualAmountPaid,
        amount_remaining: amountRemaining,
        FuelRecordId: fuelRecordObj.id,
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
  // listing of fuel record
  const index = async (req, res) => {
    res.status(200).json({
      isValid: true,
      data: await FuelRecord.findAll({
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
  // To show a resource
  const show = async (req, res) => {
    try {
      const fuelRecord = await FuelRecord.findByPk(req.params.id, {
        include: [
          {
            model: FuelRecordLogs, as: 'fuel_record_logs',
          },
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
          .json({ isValid: true, data: fuelRecord });
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
  // To update a resource
  const updateFuelRecord = async (req, res) => {
    const {
      date,
      vehicleId,
      stationId,
      fuelType,
      totalAmount,
      amountPaid,
      paymentType,
      bankName,
      driverName,
      status,
      // amountRemaining,
      amountReturnDate,
    } = req.body;
    try {
      const fuelRecord = await FuelRecord.findByPk(req.params.id);
      if (fuelRecord) {
        const updated = {
          date,
          vehicle_id: vehicleId,
          station_id: stationId,
          fuel_type: fuelType,
          bank_name: bankName,
          driver_name: driverName,
          total_amount: totalAmount,
          payment_type: paymentType,
          status,
          amount_return_date: amountReturnDate,

        };
        if (amountPaid !== fuelRecord.amount_paid && amountPaid <= fuelRecord.amount_remaining) {
          await FuelRecordLogs.create({
            amount_paid: amountPaid,
            amount_remaining: fuelRecord.amount_remaining - amountPaid,
            FuelRecordId: fuelRecord.id,
          });
          updated.amount_remaining = fuelRecord.amount_remaining - amountPaid;
          updated.amount_paid = amountPaid;
        }
        await fuelRecord.update(updated);
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
  const deleteFuelRecord = async (req, res) => {
    try {
      const fuelRecord = await FuelRecord.findByPk(req.params.id);
      if (fuelRecord) {
        // fuelRecord.removeFuelRecordLog(fuelRecord);
        fuelRecord.destroy();

        return res.status(200)
          .json({ isValid: true });
      }
      return res.status(404)
        .json({ isValid: false });
    } catch (e) {
      console.log(e);
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
    show,
    updateFuelRecord,
    deleteFuelRecord,
  };
};
module.exports = FuelRecordController;
