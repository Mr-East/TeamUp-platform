const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');

router.get('/', competitionController.getCompetitions);
router.get('/:id', competitionController.getCompetitionById);
router.get('/skills/all', competitionController.getSkills);
router.get('/skills/search', competitionController.searchSkills);

module.exports = router;
