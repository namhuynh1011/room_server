const sequelize = require('../models/index');
const Message = require('../models/Message');

async function syncDB() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối thành công!');
    await Message.sync({ alter: true }); // Tạo hoặc cập nhật bảng
    console.log('Bảng messages đã được tạo/cập nhật!');
    await sequelize.close();
  } catch (err) {
    console.error('Lỗi:', err);
  }
}

syncDB();