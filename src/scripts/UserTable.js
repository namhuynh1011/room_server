const User = require('../models/User');
module.exports = async function UserTable() {
  await User.sync({ alter: true });
  console.log('Bảng users đã được tạo/cập nhật!');
}