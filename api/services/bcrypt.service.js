const bcrypt = require('bcrypt-nodejs');

const bcryptService = () => {
  const password = (user) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);

    return hash;
  };
  const createPassword = (pass) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(pass, salt);

    return hash;
  };

  const comparePassword = (pw, hash) => (
    bcrypt.compareSync(pw, hash)
  );

  return {
    password,
    comparePassword,
    createPassword,
  };
};

module.exports = bcryptService;
