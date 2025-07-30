const { Sequelize } = require('sequelize');

// Thay thông tin kết nối bằng của bạn
const sequelize = new Sequelize('manager_room', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;