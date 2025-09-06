const Room = require('../models/Room');
module.exports = async function RoomTable() {
  await Room.sync({ alter: true });
  console.log('Bảng rooms đã được tạo/cập nhật!');
}