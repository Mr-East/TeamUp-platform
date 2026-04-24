const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, notificationController.getMyNotifications);
router.put('/:id/read', authMiddleware, notificationController.markNotificationAsRead);
router.put('/read_all', authMiddleware, notificationController.markAllNotificationsAsRead);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
