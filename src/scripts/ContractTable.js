const Contract = require('../models/Contract');
module.exports = async function ContractTable() {
  await Contract.sync({ alter: true });
  console.log('Bảng contracts đã được tạo/cập nhật!');
}