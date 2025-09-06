const Conversation = require('../models/Conversation');
module.exports = async function ConversationTable() {
  await Conversation.sync({ alter: true });
  console.log('Bảng conversations đã được tạo/cập nhật!');
}