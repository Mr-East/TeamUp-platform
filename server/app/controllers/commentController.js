const commentService = require('../services/commentService');
const { successResponse, errorResponse } = require('../utils/response');

const createComment = async (req, res) => {
  try {
    const { projectId, content } = req.body;
    const { id: userId } = req.user;
    
    if (!projectId || !content) {
      return errorResponse(res, 'Missing required fields', 400);
    }
    
    const comment = await commentService.createComment(projectId, userId, content);
    return successResponse(res, comment, 'Comment created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const replyToComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { id: userId } = req.user;
    
    if (!content) {
      return errorResponse(res, 'Missing required fields', 400);
    }
    
    const reply = await commentService.replyToComment(id, userId, content);
    return successResponse(res, reply, 'Reply created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getProjectComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const comments = await commentService.getProjectComments(projectId);
    return successResponse(res, comments, 'Comments found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await commentService.likeComment(id);
    return successResponse(res, comment, 'Comment liked successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const result = await commentService.deleteComment(id, userId);
    return successResponse(res, result, 'Comment deleted successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 404);
  }
};

module.exports = {
  createComment,
  replyToComment,
  getProjectComments,
  likeComment,
  deleteComment
};
