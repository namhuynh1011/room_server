const Payment = require('../models/Payment');
module.exports = async function PaymentTable() {
  await Payment.sync({ alter: true });
  console.log('Bảng payments đã được tạo/cập nhật!');
}
