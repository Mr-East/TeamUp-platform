const talentProfileService = require('../services/talentProfileService');
const { successResponse, errorResponse } = require('../utils/response');

const createTalentProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const profile = await talentProfileService.createTalentProfile(req.body, id);
    return successResponse(res, profile, 'Talent profile created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getTalentProfiles = async (req, res) => {
  try {
    const filters = req.query;
    const result = await talentProfileService.getTalentProfiles(filters);
    return successResponse(res, result, 'Talent profiles found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getTalentProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await talentProfileService.getTalentProfileByUserId(userId);
    return successResponse(res, profile, 'Talent profile found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const updateTalentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: currentUserId } = req.user;
    const updatedProfile = await talentProfileService.updateTalentProfile(id, req.body, currentUserId);
    return successResponse(res, updatedProfile, 'Talent profile updated successfully');
  } catch (error) {
    if (error.message === 'Profile not found or permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

const deleteTalentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: currentUserId } = req.user;
    const result = await talentProfileService.deleteTalentProfile(id, currentUserId);
    return successResponse(res, result, 'Talent profile deleted successfully');
  } catch (error) {
    if (error.message === 'Profile not found or permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  createTalentProfile,
  getTalentProfiles,
  getTalentProfileByUserId,
  updateTalentProfile,
  deleteTalentProfile
};