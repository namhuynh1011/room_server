const { User } = require('../models/User');
const { Op } = require('sequelize');
const {Conversation} = require('../models/Conversation');
const {Message} = require('../models/Message');
// Tạo hoặc lấy cuộc trò chuyện giữa 2 user
exports.createOrGetConversation = async (req, res) => {
  const { user1_id, user2_id } = req.body;
  // req.user chứa thông tin user từ token, có thể kiểm tra user1_id === req.user.id nếu muốn
  try {
    let convo = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id }
        ]
      }
    });
    if (!convo) {
      convo = await Conversation.create({ user1_id, user2_id });
    }
    res.json(convo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy danh sách cuộc trò chuyện của 1 user
exports.getConversations = async (req, res) => {
  const userId = req.params.userId;
  try {
    const convos = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      },
      include: [
        { model: User, as: 'User1' },
        { model: User, as: 'User2' }
      ],
      order: [['updated_at', 'DESC']]
    });
    res.json(convos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Gửi tin nhắn
exports.sendMessage = async (req, res) => {
  const { conversation_id, sender_id, receiver_id, content, type } = req.body;
  try {
    // Thêm kiểm tra bảo mật
    if (sender_id !== req.user.id) {
      return res.status(403).json({ error: 'Không có quyền gửi tin nhắn với tư cách người này' });
    }
    
    // Kiểm tra cuộc trò chuyện tồn tại
    const conversation = await Conversation.findByPk(conversation_id);
    if (!conversation) {
      return res.status(404).json({ error: 'Cuộc trò chuyện không tồn tại' });
    }
    
    // Kiểm tra người gửi phải thuộc về cuộc trò chuyện
    if (conversation.user1_id !== sender_id && conversation.user2_id !== sender_id) {
      return res.status(403).json({ error: 'Người gửi không thuộc về cuộc trò chuyện này' });
    }
    
    const msg = await Message.create({
      conversation_id,
      sender_id,
      receiver_id,
      content,
      type
    });
    
    // Cập nhật thời gian của cuộc trò chuyện
    await conversation.update({ updated_at: new Date() });
    
    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tin nhắn của 1 cuộc trò chuyện
exports.getMessages = async (req, res) => {
  const conversationId = req.params.conversationId;
  try {
    // Kiểm tra quyền truy cập cuộc trò chuyện
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Cuộc trò chuyện không tồn tại' });
    }
    
    // Đảm bảo người dùng hiện tại là một phần của cuộc trò chuyện
    if (conversation.user1_id !== req.user.id && conversation.user2_id !== req.user.id) {
      return res.status(403).json({ error: 'Bạn không có quyền xem cuộc trò chuyện này' });
    }
    
    const msgs = await Message.findAll({
      where: { conversation_id: conversationId },
      order: [['created_at', 'ASC']],
      include: [
        { model: User, as: 'Sender' },
        { model: User, as: 'Receiver' }
      ]
    });
    res.json(msgs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};