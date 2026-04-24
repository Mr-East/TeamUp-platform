const notificationService = require('../services/notificationService');
const { successResponse, errorResponse } = require('../utils/response');

const getMyNotifications = async (req, res) => {
  try {
    const { id } = req.user;
    const notifications = await notificationService.getMyNotifications(id);
    return successResponse(res, notifications, 'Notifications found successfully');
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
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};
