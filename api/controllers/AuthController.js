const Sequelize = require('sequelize');
const { User } = require('../models');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

const AuthController = () => {
  const index = async (req, res) => res.status(200)
    .json({
      isValid: true,
      data: await User.findAll(),
    });
  const register = async (req, res) => {
    const {
      email,
      password,
      password2,
      role,
      username,
    } = req.body;

    if (password === password2) {
      try {
        if (req.body.adminSecret !== 'iamadminlnb123') {
          return res.status(403)
            .json({
              isValid: false,
              data: 'Not enough access',
            });
        }
        const user = await User.create({
          email,
          password,
          username,
          role,
        });
        const token = authService()
          .issue({ id: user.id });

        return res.status(200)
          .json({
            token,
            user,
          });
      } catch (err) {
        if (err instanceof Sequelize.DatabaseError) {
          return res.status(500)
            .json({
              isValid: false,
              data: 'Unknown Role',
            });
        }
        const errors = err.errors.map((item) => item.message);
        // console.log(err);
        return res.status(500)
          .json({
            isValid: false,
            data: errors,
            msg: 'Internal server error',
          });
      }
    }

    return res.status(400)
      .json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  const login = async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    if (email && password) {
      try {
        const user = await User.findOne({
          where: {
            email,
          },
        });

        if (!user) {
          return res.status(400)
            .json({ msg: 'Bad Request: User not found' });
        }

        if (bcryptService()
          .comparePassword(password, user.password)) {
          const token = authService()
            .issue({ id: user.id });

          return res.status(200)
            .json({
              token,
              user,
            });
        }

        return res.status(401)
          .json({ msg: 'Unauthorized' });
      } catch (err) {
        console.log(err);
        return res.status(500)
          .json({ msg: 'Internal server error' });
      }
    }

    return res.status(400)
      .json({ msg: 'Bad Request: Email and password don\'t match' });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService()
      .verify(token, (err) => {
        if (err) {
          return res.status(401)
            .json({
              isvalid: false,
              err: 'Invalid Token!',
            });
        }

        return res.status(200)
          .json({ isvalid: true });
      });
  };

  // To update a resource
  const updateUser = async (req, res) => {
    const {
      email,
      password,
      role,
      username,
    } = req.body;
    try {
      if (req.body.adminSecret !== 'iamadminlnb123') {
        return res.status(403)
          .json({
            isValid: false,
            data: 'Not enough access',
          });
      }
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.update({
          email,
          password: bcryptService()
            .createPassword(password),
          role,
          username,

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

  // To show a resource
  const show = async (req, res) => {
    try {
      const userRecord = await User.findByPk(req.params.id);
      if (userRecord) {
        return res.status(200)
          .json({
            isValid: true,
            data: userRecord,
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

  // To delete a resource
  const destroyUser = async (req, res) => {
    try {
      const userRecord = await User.findByPk(req.params.id);
      if (userRecord) {
        userRecord.destroy();
        return res.status(200)
          .json({
            isValid: true,
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
  return {
    register,
    login,
    validate,
    updateUser,
    index,
    show,
    destroyUser,
  };
};

module.exports = AuthController;
