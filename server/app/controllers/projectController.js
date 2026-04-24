const projectService = require('../services/projectService');
const { successResponse, errorResponse } = require('../utils/response');

const createProject = async (req, res) => {
  try {
    const { id } = req.user;
    const project = await projectService.createProject(req.body, id);
    return successResponse(res, project, 'Project created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getProjects = async (req, res) => {
  try {
    const filters = req.query;
    const result = await projectService.getProjects(filters);
    return successResponse(res, result, 'Projects found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);
    return successResponse(res, project, 'Project found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const getUserProjects = async (req, res) => {
  try {
    const { id } = req.user;
    const projects = await projectService.getUserProjects(id);
    return successResponse(res, projects, 'User projects found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: currentUserId } = req.user;
    const updatedProject = await projectService.updateProject(id, req.body, currentUserId);
    return successResponse(res, updatedProject, 'Project updated successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: currentUserId } = req.user;
    const result = await projectService.deleteProject(id, currentUserId);
    return successResponse(res, result, 'Project deleted successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

const closeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: currentUserId } = req.user;
    const updatedProject = await projectService.closeProject(id, currentUserId);
    return successResponse(res, updatedProject, 'Project closed successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

const getProjectMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const members = await projectService.getProjectMembers(id);
    return successResponse(res, members, 'Project members found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

const joinProject = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { id: userId } = req.user;
    const { reasonText } = req.body;
    const application = await projectService.joinProject(projectId, userId, reasonText);
    return successResponse(res, application, 'Application submitted successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getJoinStatus = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { id: userId } = req.user;
    const status = await projectService.getJoinStatus(projectId, userId);
    return successResponse(res, status, 'Join status found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getProjectComments = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const comments = await projectService.getProjectComments(projectId);
    return successResponse(res, comments, 'Comments found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const createProjectComment = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { id: userId } = req.user;
    const { content, parentCommentId } = req.body;

    if (!content) {
      return errorResponse(res, 'Content is required', 400);
    }

    const comment = await projectService.createProjectComment(projectId, userId, content, parentCommentId);
    return successResponse(res, comment, 'Comment created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const likeProjectComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await projectService.likeProjectComment(commentId);
    return successResponse(res, comment, 'Comment liked successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  getUserProjects,
  updateProject,
  deleteProject,
  closeProject,
  getProjectMembers,
  joinProject,
  getJoinStatus,
  getProjectComments,
  createProjectComment,
  likeProjectComment
};