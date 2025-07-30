const express = require('express');
const router = express.Router();
const { User, Conversation, Message } = require('../models/association');
const auth = require('../middleware/auth'); // import middleware
const { Op } = require('sequelize');

// Tạo hoặc lấy cuộc trò chuyện giữa 2 user
router.post('/conversation', auth, async (req, res) => {
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
});

// Lấy danh sách cuộc trò chuyện của 1 user
router.get('/conversation/:userId', auth, async (req, res) => {
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
});
// Gửi tin nhắn
router.post('/message', auth, async (req, res) => {
  const { conversation_id, sender_id, receiver_id, content, type } = req.body;
  try {
    // Bạn có thể kiểm tra sender_id === req.user.id nếu muốn bảo mật hơn
    const msg = await Message.create({
      conversation_id,
      sender_id,
      receiver_id,
      content,
      type
    });
    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Lấy tin nhắn của 1 cuộc trò chuyện
router.get('/message/:conversationId', auth, async (req, res) => {
  const conversationId = req.params.conversationId;
  try {
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
});

module.exports = router;