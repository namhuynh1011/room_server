const sequelize = require('../models/index');
const Conversation = require('../models/Conversation');

async function syncDB() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối thành công!');
    await Conversation.sync({ alter: true }); // Tạo hoặc cập nhật bảng
    console.log('Bảng conversations đã được tạo/cập nhật!');
    await sequelize.close();
  } catch (err) {
    console.error('Lỗi:', err);
  }
}

syncDB();