const competitionService = require('../services/competitionService');
const { successResponse, errorResponse } = require('../utils/response');

const getCompetitions = async (req, res) => {
  try {
    const competitions = await competitionService.getCompetitions();
    return successResponse(res, competitions, 'Competitions found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getCompetitionById = async (req, res) => {
  try {
    const { id } = req.params;
    const competition = await competitionService.getCompetitionById(id);
    return successResponse(res, competition, 'Competition found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const getSkills = async (req, res) => {
  try {
    const skills = await competitionService.getSkills();
    return successResponse(res, skills, 'Skills found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const searchSkills = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return errorResponse(res, 'Missing query parameter', 400);
    }
    const skills = await competitionService.searchSkills(query);
    return successResponse(res, skills, 'Skills found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getCompetitions,
  getCompetitionById,
  getSkills,
  searchSkills
};
