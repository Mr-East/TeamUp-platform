const Notification = require('../models/Notification');

const getMyNotifications = async (userId) => {
  const notifications = await Notification.findAll({
    where: { receiverId: userId },
    order: [['created_at', 'DESC']]
  });
  
  return notifications;
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findByPk(notificationId);
  
  if (!notification) {
    throw new Error('Notification not found');
  }
  
  // 检查权限
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
  
  // 检查权限
  if (notification.receiverId !== userId) {
    throw new Error('Permission denied');
  }
  
  await notification.destroy();
  
  return { message: 'Notification deleted successfully' };
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};
