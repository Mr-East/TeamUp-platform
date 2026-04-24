const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, applicationController.createApplication);
router.post('/invite', authMiddleware, applicationController.createInvitation);
router.get('/my', authMiddleware, applicationController.getMyApplications);
router.get('/project/:projectId', authMiddleware, applicationController.getProjectApplications);
router.put('/:id/approve', authMiddleware, applicationController.approveApplication);
router.put('/:id/reject', authMiddleware, applicationController.rejectApplication);

module.exports = router;