const applicationService = require('../services/applicationService');
const { successResponse, errorResponse } = require('../utils/response');

const createApplication = async (req, res) => {
  try {
    const { projectId, reasonText } = req.body;
    const { id: applicantId } = req.user;
    
    if (!projectId || !reasonText) {
      return errorResponse(res, 'Missing required fields', 400);
    }
    
    const application = await applicationService.createApplication(projectId, applicantId, reasonText);
    return successResponse(res, application, 'Application submitted successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const createInvitation = async (req, res) => {
  try {
    const { projectId, userId, reasonText } = req.body;
    const { id: inviterId } = req.user;
    
    if (!projectId || !userId || !reasonText) {
      return errorResponse(res, 'Missing required fields', 400);
    }
    
    const application = await applicationService.createApplication(projectId, userId, reasonText, 'invite', inviterId);
    return successResponse(res, application, 'Invitation sent successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getMyApplications = async (req, res) => {
  try {
    const { id } = req.user;
    const applications = await applicationService.getMyApplications(id);
    return successResponse(res, applications, 'Applications found successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getProjectApplications = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { id: userId } = req.user;
    const applications = await applicationService.getProjectApplications(projectId, userId);
    return successResponse(res, applications, 'Applications found successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const application = await applicationService.approveApplication(id, userId);
    return successResponse(res, application, 'Application approved successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const application = await applicationService.rejectApplication(id, userId);
    return successResponse(res, application, 'Application rejected successfully');
  } catch (error) {
    if (error.message === 'Permission denied') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  createApplication,
  createInvitation,
  getMyApplications,
  getProjectApplications,
  approveApplication,
  rejectApplication
};
