const messageService = require('../services/messageService');
const { successResponse, errorResponse } = require('../utils/response');

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const { id: senderId } = req.user;
    
    if (!receiverId || !content) {
      return errorResponse(res, 'Missing required fields', 400);
    }
    
    const message = await messageService.sendMessage(senderId, receiverId, content);
    return successResponse(res, message, 'Message sent successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const messages = await messageService.getChatMessages(id, userId);
    return successResponse(res, messages, 'Messages found successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 404);
  }
};

const getMyChats = async (req, res) => {
  try {
    const { id } = req.user;
    const chats = await messageService.getMyChats(id);
    return successResponse(res, chats, 'Chats found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const markChatAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const result = await messageService.markChatAsRead(id, userId);
    return successResponse(res, result, 'Chat marked as read');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 404);
  }
};

module.exports = {
  sendMessage,
  getChatMessages,
  getMyChats,
  markChatAsRead
};
