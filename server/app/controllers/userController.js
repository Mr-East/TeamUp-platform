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
    const { id: currentUserId } = req.user;

    if (parseInt(id) !== currentUserId) {
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
    const { grade, major, skill } = req.query;
    const filters = {};
    
    if (grade) filters.grade = grade;
    if (major) filters.major = major;
    if (skill) filters.skill = skill;
    
    const talents = await userService.getTalents(filters);
    return successResponse(res, talents, 'Talents found successfully');
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
  getTalents
};
