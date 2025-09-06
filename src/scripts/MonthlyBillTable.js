const MonthlyBill = require('../models/MonthlyBill');
module.exports = async function MonthlyBillTable() {
  await MonthlyBill.sync({ alter: true });
  console.log('Bảng monthly_bills đã được tạo/cập nhật!');
}