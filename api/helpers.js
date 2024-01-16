
// Calcualte total expense
const totalExpense = (data) => data.map((singleObj) => {
  let final = 0;
  final = singleObj.expense + singleObj.driver_expense + singleObj.fuel_expense;
  return final;
});
// Calcualte total rent
const totalRent = (data) => data.map((singleObj) => {
  let final = 0;
  final = singleObj.rent;
  return final;
});
// reducer to add arrays
const reducer = (previousValue, currentValue) => previousValue + currentValue;
// calculate total profit
const calculateProfit = async (data) => {
  let totalExpenseData = totalExpense(data);
  let totalRentData = totalRent(data);
  if (Array.isArray(totalExpenseData) && totalExpenseData.length >= 1) {
    totalExpenseData = totalExpenseData.reduce(reducer);
  }
  if (Array.isArray(totalRentData) && totalRentData.length >= 1) {
    totalRentData = totalRentData.reduce(reducer);
  }
  if (totalExpenseData && totalRentData) {
    return totalExpenseData - totalRentData;
  }
};

module.exports = calculateProfit;
