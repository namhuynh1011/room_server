const sequelize = require('../models/index');
const User = require('../models/User');

async function syncDB() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối thành công!');
    await User.sync({ alter: true }); // Tạo hoặc cập nhật bảng
    console.log('Bảng users đã được tạo/cập nhật!');
    await sequelize.close();
  } catch (err) {
    console.error('Lỗi:', err);
  }
}

syncDB();