const Message = require('../models/Message');
module.exports = async function MessageTable() {
  await Message.sync({ alter: true });
  console.log('Bảng messages đã được tạo/cập nhật!');
}