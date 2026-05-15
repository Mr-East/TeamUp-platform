const Notification = require('../models/Notification');
const User = require('../models/User');
const logger = require('../utils/logger');

// WebSocket连接管理器（将在server.js中设置）
let wsManager = null;

const setWss = (manager) => {
  wsManager = manager;
};

// 向特定用户发送WebSocket消息
const sendToUser = (userId, message) => {
  if (!wsManager || !wsManager.sendToUser) return;
  wsManager.sendToUser(userId, message);
};

// 创建通知
const createNotification = async ({ receiverId, senderId, type, title, content, relatedId, relatedType, link }) => {
  logger.info(`Creating notification: receiverId=${receiverId}, senderId=${senderId}, type=${type}`);
  
  try {
    const notification = await Notification.create({
      receiverId,
      senderId,
      type,
      title,
      content,
      relatedId,
      relatedType,
      link
    });

    // 获取完整通知信息（包括发送者信息）
    const fullNotification = await Notification.findByPk(notification.id, {
      include: [
        { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] },
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }
      ]
    });

    // 通过WebSocket实时推送
    sendToUser(receiverId, {
      type: 'NOTIFICATION',
      data: fullNotification
    });

    logger.info(`Notification created successfully: id=${notification.id}`);
    return fullNotification;
  } catch (error) {
    logger.error(`Failed to create notification: ${error.message}`, error);
    throw error;
  }
};

// 通知类型对应的链接生成函数
const generateNotificationLink = (type, relatedType, relatedId) => {
  switch (type) {
    case 'application':
    case 'application_approved':
    case 'application_rejected':
      return `/pages/project/detail?projectId=${relatedId}`;
    case 'invite':
      return `/pages/invites/invites`;
    case 'invite_accepted':
    case 'invite_rejected':
      return `/pages/project/detail?projectId=${relatedId}`;
    default:
      return `/pages/message/message`;
  }
};

// 快捷通知创建函数
const notifyApplication = async (receiverId, senderId, projectId, projectTitle, status) => {
  const titles = {
    pending: `新的加入申请`,
    approved: `申请已通过`,
    rejected: `申请被拒绝`
  };

  const contents = {
    pending: `用户申请加入您的项目"${projectTitle}"`,
    approved: `您的加入申请已通过，项目"${projectTitle}"`,
    rejected: `您的加入申请已被拒绝，项目"${projectTitle}"`
  };

  return createNotification({
    receiverId,
    senderId,
    type: status === 'pending' ? 'application' : status === 'approved' ? 'application_approved' : 'application_rejected',
    title: titles[status] || '申请状态更新',
    content: contents[status] || '申请状态已更新',
    relatedId: projectId,
    relatedType: 'project',
    link: generateNotificationLink(status === 'pending' ? 'application' : `application_${status}`, 'project', projectId)
  });
};

const notifyInvite = async (receiverId, senderId, projectId, projectTitle, status) => {
  const titles = {
    pending: `收到组队邀请`,
    accepted: `邀请已被接受`,
    rejected: `邀请已被拒绝`
  };

  const contents = {
    pending: `您被邀请加入项目"${projectTitle}"`,
    accepted: `您接受的邀请，项目"${projectTitle}"组队成功`,
    rejected: `您拒绝的邀请，项目"${projectTitle}"`
  };

  return createNotification({
    receiverId,
    senderId,
    type: status === 'pending' ? 'invite' : status === 'accepted' ? 'invite_accepted' : 'invite_rejected',
    title: titles[status] || '邀请状态更新',
    content: contents[status] || '邀请状态已更新',
    relatedId: projectId,
    relatedType: 'project',
    link: generateNotificationLink(status === 'pending' ? 'invite' : `invite_${status}`, 'project', projectId)
  });
};

const getMyNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const where = { receiverId: userId };

  if (unreadOnly) {
    where.isRead = false;
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows: notifications } = await Notification.findAndCountAll({
    where,
    include: [
      { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] },
      { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset
  });

  // 获取未读数量
  const unreadCount = await Notification.count({
    where: { receiverId: userId, isRead: false }
  });

  return {
    notifications,
    total: count,
    unreadCount,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(count / parseInt(limit))
  };
};

const getUnreadCount = async (userId) => {
  return await Notification.count({
    where: { receiverId: userId, isRead: false }
  });
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findByPk(notificationId);

  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.receiverId !== userId) {
    throw new Error('Permission denied');
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

const markAllNotificationsAsRead = async (userId) => {
  await Notification.update(
    { isRead: true },
    {
      where: {
        receiverId: userId,
        isRead: false
      }
    }
  );

  return { message: 'All notifications marked as read' };
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findByPk(notificationId);

  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.receiverId !== userId) {
    throw new Error('Permission denied');
  }

  await notification.destroy();

  return { message: 'Notification deleted successfully' };
};

module.exports = {
  setWss,
  createNotification,
  notifyApplication,
  notifyInvite,
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  generateNotificationLink
};
