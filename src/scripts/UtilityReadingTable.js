const UtilityReading = require('../models/UtilityReading');
module.exports = async function UtilityReadingTable() {
  await UtilityReading.sync({ alter: true });
  console.log('Bảng utility_readings đã được tạo/cập nhật!');
}