const userService = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/response');

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return successResponse(res, user, 'User found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: currentUserId, email } = req.user;
    const isAdmin = email && (email.includes('admin') || email === 'admin@example.com');

    if (!isAdmin && parseInt(id) !== currentUserId) {
      return errorResponse(res, 'Permission denied', 403);
    }

    const updatedUser = await userService.updateUser(id, req.body);
    return successResponse(res, updatedUser, 'User updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await userService.getUserPosts(id);
    return successResponse(res, posts, 'User posts found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const toggleProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { id: userId } = req.user;
    const project = await userService.toggleProjectStatus(projectId, userId);
    return successResponse(res, project, 'Project status updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const toggleTalentProfileStatus = async (req, res) => {
  try {
    const { talentProfileId } = req.params;
    const { id: userId, email } = req.user;
    
    const isAdmin = email && (email.includes('admin') || email === 'admin@example.com');
    
    const talentProfile = await userService.toggleTalentProfileStatus(talentProfileId, userId, isAdmin);
    return successResponse(res, talentProfile, 'Talent profile status updated successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { id: userId } = req.user;
    const result = await userService.deleteProject(projectId, userId);
    return successResponse(res, result, 'Project deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const deleteTalentProfile = async (req, res) => {
  try {
    const { talentProfileId } = req.params;
    const { id: userId } = req.user;
    const result = await userService.deleteTalentProfile(talentProfileId, userId);
    return successResponse(res, result, 'Talent profile deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await userService.getUserById(id);
    return successResponse(res, user, 'Current user found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const { id: currentUserId } = req.user;
    const avatarUrl = 'http://localhost:3000/uploads/' + req.file.filename;

    const updatedUser = await userService.updateUser(currentUserId, {
      avatar: avatarUrl
    });

    return successResponse(res, {
      avatar: avatarUrl
    }, 'Avatar uploaded successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getTalents = async (req, res) => {
  try {
    const { grade, major, skill, page = 1, limit = 10 } = req.query;
    const filters = {};
    
    if (grade) filters.grade = grade;
    if (major) filters.major = major;
    if (skill) filters.skill = skill;
    
    const talents = await userService.getTalents(filters, parseInt(page), parseInt(limit));
    return successResponse(res, talents, 'Talents found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, username, email, status, grade, major } = req.query;
    const filters = {};

    if (username) filters.username = username;
    if (email) filters.email = email;
    if (status) filters.status = status;
    if (grade) filters.grade = grade;
    if (major) filters.major = major;

    const users = await userService.getUsers(filters, parseInt(page), parseInt(limit));
    return successResponse(res, users, 'Users found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getUserById,
  updateUser,
  getUserPosts,
  getCurrentUser,
  uploadAvatar,
  getTalents,
  getUsers,
  toggleProjectStatus,
  toggleTalentProfileStatus,
  deleteProject,
  deleteTalentProfile
};
