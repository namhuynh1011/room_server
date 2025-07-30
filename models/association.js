const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');

// Đặt các mối quan hệ như trên
Conversation.belongsTo(User, { as: 'User1', foreignKey: 'user1_id' });
Conversation.belongsTo(User, { as: 'User2', foreignKey: 'user2_id' });
User.hasMany(Conversation, { foreignKey: 'user1_id', as: 'ConversationsAsUser1' });
User.hasMany(Conversation, { foreignKey: 'user2_id', as: 'ConversationsAsUser2' });

Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });
Conversation.hasMany(Message, { foreignKey: 'conversation_id' });

Message.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiver_id' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'MessagesSent' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'MessagesReceived' });

module.exports = { User, Conversation, Message };