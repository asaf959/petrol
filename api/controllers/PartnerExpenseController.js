const { PartnerExpense } = require('../models');

const PartnerExpenseController = () => {
  // To show all partner expenses
  const index = async (req, res) => res.status(200)
    .json({
      isValid: true,
      data: await PartnerExpense.findAll(),
    });
  // To create a new partnerExpense
  const add = async (req, res) => {
    const {
      date,
      name,
      amount,
    } = req.body;
    try {
      await PartnerExpense.create({
        date,
        name,
        amount,

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
  const updatePartnerExpense = async (req, res) => {
    const {
      date,
      name,
      amount,
    } = req.body;
    try {
      const partnerExpense = await PartnerExpense.findByPk(req.params.id);
      if (partnerExpense) {
        await partnerExpense.update({
          date,
          name,
          amount,

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
  const deletePartnerExpense = async (req, res) => {
    try {
      const partnerExpense = await PartnerExpense.findByPk(req.params.id);
      if (partnerExpense) {
        partnerExpense.destroy();

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
      const partnerExpense = await PartnerExpense.findByPk(req.params.id);
      if (partnerExpense) {
        return res.status(200)
          .json({ isValid: true, data: partnerExpense });
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
    deletePartnerExpense,
    updatePartnerExpense,
    show,
  };
};
module.exports = PartnerExpenseController;
