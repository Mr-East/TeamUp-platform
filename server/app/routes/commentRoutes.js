const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

router.get('/project/:projectId', commentController.getProjectComments);
router.post('/', authMiddleware, commentController.createComment);
router.post('/:id/reply', authMiddleware, commentController.replyToComment);
router.put('/:id/like', authMiddleware, commentController.likeComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
