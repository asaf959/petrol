const { PersonalExpense } = require('../models');

const PersonalExpenseController = () => {
  // To show all personal expenses
  const index = async (req, res) => res.status(200)
    .json({
      isValid: true,
      data: await PersonalExpense.findAll(),
    });
  // To create a new personalExpense
  const add = async (req, res) => {
    const {
      date,
      name,
      amount,
      type,
    } = req.body;
    try {
      await PersonalExpense.create({
        date,
        name,
        amount,
        type,

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
  const updatePersonalExpense = async (req, res) => {
    const {
      date,
      name,
      amount,
      type,
    } = req.body;
    try {
      const personalExpense = await PersonalExpense.findByPk(req.params.id);
      if (personalExpense) {
        await personalExpense.update({
          date,
          name,
          amount,
          type,

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
  const deletePersonalExpense = async (req, res) => {
    try {
      const personalExpense = await PersonalExpense.findByPk(req.params.id);
      if (personalExpense) {
        personalExpense.destroy();

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
      const personalExpense = await PersonalExpense.findByPk(req.params.id);
      if (personalExpense) {
        return res.status(200)
          .json({ isValid: true, data: personalExpense });
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
    deletePersonalExpense,
    updatePersonalExpense,
    show,
  };
};
module.exports = PersonalExpenseController;
