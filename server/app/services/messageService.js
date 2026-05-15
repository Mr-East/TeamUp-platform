const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');
const notificationService = require('./notificationService');

const getOrCreateChat = async (senderId, receiverId) => {
  // 确保 ID 都是数字类型
  const sId = Number(senderId);
  const rId = Number(receiverId);
  
  // 确保senderId < receiverId，避免重复创建聊天
  const [userId1, userId2] = sId < rId ? [sId, rId] : [rId, sId];
  
  // 查找现有的聊天 - 获取所有聊天后在JavaScript中过滤
  let allChats = await Chat.findAll({
    where: {
      type: 'private'
    }
  });
  
  // 在JavaScript中找到匹配的聊天
  let chat = allChats.find(c => {
    if (Array.isArray(c.participantIds)) {
      const participants = c.participantIds.map(id => Number(id)).sort((a, b) => a - b);
      return participants[0] === userId1 && participants[1] === userId2;
    }
    return false;
  });
  
  // 如果不存在，创建新聊天
  if (!chat) {
    chat = await Chat.create({
      type: 'private',
      participantIds: [userId1, userId2]
    });
  }
  
  return chat;
};

const sendMessage = async (senderId, receiverId, content) => {
  // 获取或创建聊天
  const chat = await getOrCreateChat(senderId, receiverId);
  
  // 创建消息
  const message = await Message.create({
    chatId: Number(chat.id),
    senderId: Number(senderId),
    receiverId: Number(receiverId),
    content
  });
  
  // 更新聊天的最后一条消息
  chat.lastMessage = content;
  await chat.save();

  // 加载发送者和接收者信息
  const populatedMessage = await Message.findByPk(message.id, {
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'name', 'avatar']
      },
      {
        model: User,
        as: 'receiver',
        attributes: ['id', 'name', 'avatar']
      }
    ]
  });

  // 发送私信通知（通过notificationService实现WebSocket实时推送）
  const sender = await User.findByPk(senderId);
  await notificationService.createNotification({
    receiverId: Number(receiverId),
    senderId: Number(senderId),
    type: 'system',
    title: '收到新私信',
    content: `${sender.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
    relatedId: chat.id,
    relatedType: 'chat',
    link: `/pages/chat/chat?chatId=${chat.id}&userId=${senderId}`
  });

  // 返回包含 chatId 的消息对象
  return {
    ...populatedMessage.toJSON(),
    chatId: chat.id
  };
};

const getChatMessages = async (chatId, userId) => {
  // 检查聊天是否存在
  const chat = await Chat.findByPk(Number(chatId));
  if (!chat) {
    throw new Error('Chat not found');
  }
  
  // 检查用户是否是聊天参与者
  if (!chat.participantIds.includes(Number(userId))) {
    throw new Error('Permission denied');
  }
  
  // 获取消息
  const messages = await Message.findAll({
    where: { chatId: Number(chatId) },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'name', 'avatar']
      },
      {
        model: User,
        as: 'receiver',
        attributes: ['id', 'name', 'avatar']
      }
    ],
    order: [['created_at', 'ASC']]
  });
  
  // 标记消息为已读
  await Message.update(
    { isRead: true },
    {
      where: {
        chatId: Number(chatId),
        receiverId: Number(userId),
        isRead: false
      }
    }
  );
  
  return messages;
};

const getMyChats = async (userId) => {
  // 查找用户参与的所有聊天
  const chats = await Chat.findAll({
    where: {
      type: 'private'
    }
  });
  
  // 过滤出用户参与的聊天
  const userChats = chats.filter(chat => chat.participantIds.includes(Number(userId)));
  
  // 为每个聊天加载对方用户信息
  const populatedChats = await Promise.all(userChats.map(async (chat) => {
    // 找到对方用户ID
    const otherUserId = chat.participantIds.find(id => Number(id) !== Number(userId));
    
    // 加载对方用户信息
    const otherUser = await User.findByPk(Number(otherUserId), {
      attributes: ['id', 'name', 'avatar']
    });
    
    // 获取未读消息数
    const unreadCount = await Message.count({
      where: {
        chatId: Number(chat.id),
        receiverId: Number(userId),
        isRead: false
      }
    });
    
    return {
      ...chat.toJSON(),
      otherUser,
      unreadCount
    };
  }));
  
  return populatedChats;
};

const markChatAsRead = async (chatId, userId) => {
  // 检查聊天是否存在
  const chat = await Chat.findByPk(Number(chatId));
  if (!chat) {
    throw new Error('Chat not found');
  }
  
  // 检查用户是否是聊天参与者
  if (!chat.participantIds.includes(Number(userId))) {
    throw new Error('Permission denied');
  }
  
  // 标记消息为已读
  await Message.update(
    { isRead: true },
    {
      where: {
        chatId: Number(chatId),
        receiverId: Number(userId),
        isRead: false
      }
    }
  );
  
  return { message: 'Chat marked as read' };
};

module.exports = {
  sendMessage,
  getChatMessages,
  getMyChats,
  markChatAsRead
};
