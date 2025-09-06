const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Tạo hoặc lấy cuộc trò chuyện giữa 2 user
router.post('/conversation', auth, chatController.createOrGetConversation);

// Lấy danh sách cuộc trò chuyện của 1 user
router.get('/conversation/:userId', auth, chatController.getConversations);

// Gửi tin nhắn
router.post('/message', auth, chatController.sendMessage);

// Lấy tin nhắn của 1 cuộc trò chuyện
router.get('/message/:conversationId', auth, chatController.getMessages);

module.exports = router;