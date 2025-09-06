const sequelize = require('../config/db');
const ConversationTable = require('./ConversationTable');
const MessageTable = require('./MessageTable');
const RoomTable = require('./RoomTable');
const UserTable = require('./UserTable');
const ContractTable = require('./ContractTable');
const MonthlyBillTable = require('./MonthlyBillTable');
const PaymentTable = require('./PaymentTable');
const UtilityReadingTable = require('./UtilityReadingTable');
const tables = [
  ConversationTable,
  MessageTable,
  RoomTable,
  UserTable,
  ContractTable,
  UtilityReadingTable,
  MonthlyBillTable,
  PaymentTable,
];

(async () => {
  for (const syncTable of tables) {
    try {
      await syncTable();
      console.log(`✅ Synced: ${syncTable.name}`);
    } catch (err) {
      console.error(`❌ Error syncing ${syncTable.name}:`, err);
    }
  }
  await sequelize.close(); // Đóng kết nối 1 lần duy nhất!
  process.exit();
})();