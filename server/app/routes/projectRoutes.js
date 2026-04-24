const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

router.get('/my', authMiddleware, projectController.getUserProjects);
router.get('/', projectController.getProjects);
router.post('/', authMiddleware, projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);
router.post('/:id/close', authMiddleware, projectController.closeProject);
router.get('/:id/members', projectController.getProjectMembers);
router.post('/:id/join', authMiddleware, projectController.joinProject);
router.get('/:id/join-status', authMiddleware, projectController.getJoinStatus);
router.get('/:id/comments', projectController.getProjectComments);
router.post('/:id/comments', authMiddleware, projectController.createProjectComment);
router.put('/comments/:commentId/like', projectController.likeProjectComment);

module.exports = router;