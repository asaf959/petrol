const publicRoutes = {
  'POST /login': 'AuthController.login',
  'POST /create': 'AuthController.register',
  'POST /validate': 'AuthController.validate',
};

module.exports = publicRoutes;
