const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.get('/chats', authMiddleware, messageController.getMyChats);
router.get('/chat/:id', authMiddleware, messageController.getChatMessages);
router.post('/send', authMiddleware, messageController.sendMessage);
router.put('/chat/:id/read', authMiddleware, messageController.markChatAsRead);

module.exports = router;
