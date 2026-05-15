const notificationService = require('../services/notificationService');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const getMyNotifications = async (req, res) => {
  try {
    logger.info('Getting notifications for user:', req.user?.id);
    const { id } = req.user;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const result = await notificationService.getMyNotifications(id, { page, limit, unreadOnly: unreadOnly === 'true' });
    return successResponse(res, result, 'Notifications found successfully');
  } catch (error) {
    logger.error('Error getting notifications:', error);
    return errorResponse(res, error.message, 400);
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const { id } = req.user;
    const count = await notificationService.getUnreadCount(id);
    return successResponse(res, { unreadCount: count }, 'Unread count retrieved');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const notification = await notificationService.markNotificationAsRead(id, userId);
    return successResponse(res, notification, 'Notification marked as read');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 404);
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await notificationService.markAllNotificationsAsRead(id);
    return successResponse(res, result, 'All notifications marked as read');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const result = await notificationService.deleteNotification(id, userId);
    return successResponse(res, result, 'Notification deleted successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 404);
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};
