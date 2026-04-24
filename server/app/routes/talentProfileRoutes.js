const express = require('express');
const router = express.Router();
const talentProfileController = require('../controllers/talentProfileController');
const authMiddleware = require('../middleware/auth');

router.get('/', talentProfileController.getTalentProfiles);
router.post('/', authMiddleware, talentProfileController.createTalentProfile);
router.get('/user/:userId', talentProfileController.getTalentProfileByUserId);
router.put('/:id', authMiddleware, talentProfileController.updateTalentProfile);
router.delete('/:id', authMiddleware, talentProfileController.deleteTalentProfile);

module.exports = router;