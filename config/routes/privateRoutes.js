const privateRoutes = {
  'GET /users': 'AuthController.index',
  'GET /user/:id': 'AuthController.show',
  'PUT user/:id/update': 'AuthController.updateUser',
  'DELETE /user/:id/destroy': 'AuthController.destroyUser',


  'POST /vehicle': 'VehicleController.add',
  'GET /vehicle': 'VehicleController.index',
  'DELETE /vehicle/:id/destroy': 'VehicleController.deleteVehicle',
  'PUT /vehicle/:id/update': 'VehicleController.updateVehicle',
  'GET /vehicle/:id': 'VehicleController.show',

  'POST /station': 'StationController.add',
  'GET /station': 'StationController.index',
  'DELETE /station/:id/destroy': 'StationController.deleteStation',
  'PUT /station/:id/update': 'StationController.updateStation',
  'GET /station/:id': 'StationController.show',

  'POST /personalExpense': 'PersonalExpenseController.add',
  'GET /personalExpense': 'PersonalExpenseController.index',
  'DELETE /personalExpense/:id/destroy': 'PersonalExpenseController.deletePersonalExpense',
  'PUT /personalExpense/:id/update': 'PersonalExpenseController.updatePersonalExpense',
  'GET /personalExpense/:id': 'PersonalExpenseController.show',

  'POST /profit': 'ProfitController.add',
  'GET /profit': 'ProfitController.index',
  'GET /profit/:date': 'ProfitController.getProfit',
  'GET /profitById/:id': 'ProfitController.getProfitById',
  'PUT /profit/:id/update': 'ProfitController.updateProfit',
  'DELETE /profit/:id/destroy': 'ProfitController.deleteProfit',

  'POST /fuelRecord': 'FuelRecordController.add',
  'GET /fuelRecord': 'FuelRecordController.index',
  'GET /fuelRecord/:id': 'FuelRecordController.show',
  'PUT /fuelRecord/:id/update': 'FuelRecordController.updateFuelRecord',
  'DELETE /fuelRecord/:id/destroy': 'FuelRecordController.deleteFuelRecord',

  'POST /partnerExpense': 'PartnerExpenseController.add',
  'GET /partnerExpense': 'PartnerExpenseController.index',
  'DELETE /partnerExpense/:id/destroy': 'PartnerExpenseController.deletePartnerExpense',
  'PUT /partnerExpense/:id/update': 'PartnerExpenseController.updatePartnerExpense',
  'GET /partnerExpense/:id': 'PartnerExpenseController.show',

  'GET /fuelRecordByStation/:stationId': 'StationController.fuelRecord',
  'GET /profitByStation/:stationId': 'StationController.profit',

  'GET /fuelRecordByVehicle/:vehicleId': 'VehicleController.fuelRecord',
  'GET /profitByVehicle/:vehicleId': 'VehicleController.profit',


};

module.exports = privateRoutes;
