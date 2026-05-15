const Application = require('../models/Application');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');
const notificationService = require('./notificationService');
const logger = require('../utils/logger');

const createApplication = async (projectId, applicantId, reasonText, type = 'apply', inviterId = null) => {
  // 检查项目是否存在
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new Error('项目不存在');
  }
  
  // 检查项目状态
  if (project.status !== 'active') {
    throw new Error('项目已关闭');
  }
  
  // 检查是否已经申请过
  const existingApplication = await Application.findOne({
    where: { projectId, applicantId }
  });
  if (existingApplication) {
    throw new Error('已经邀请过了');
  }
  
  // 检查是否已经是项目成员
  const existingMember = await ProjectMember.findOne({
    where: { projectId, userId: applicantId }
  });
  if (existingMember) {
    throw new Error('已在队伍中');
  }
  
  // 检查队伍是否已满
  const currentMemberCount = await ProjectMember.count({
    where: { projectId }
  });
  // +1 是因为项目创建者也算成员
  if (currentMemberCount + 1 >= project.peopleNeeded) {
    throw new Error('队伍已满');
  }
  
  // 如果是邀请类型，检查权限
  if (type === 'invite' && inviterId) {
    if (Number(project.createdBy) !== Number(inviterId)) {
      throw new Error('没有权限，只有项目创建者可以邀请');
    }
    const invitedUser = await User.findByPk(Number(applicantId));
    if (!invitedUser) {
      throw new Error('用户不存在');
    }
  }
  
  // 创建申请
  const application = await Application.create({
    projectId: Number(projectId),
    applicantId: Number(applicantId),
    reasonText,
    type,
    inviterId: type === 'invite' ? Number(inviterId) : null
  });

  // 发送通知（通过notificationService实现WebSocket实时推送）
  if (type === 'apply') {
    const applicant = await User.findByPk(applicantId);
    logger.info(`Sending application notification: applicantId=${applicantId}, projectId=${projectId}, projectTitle=${project.title}`);
    await notificationService.notifyApplication(project.createdBy, applicantId, projectId, project.title, 'pending');
    logger.info('Application notification sent successfully');
  } else {
    const inviter = await User.findByPk(inviterId);
    logger.info(`Sending invite notification: applicantId=${applicantId}, inviterId=${inviterId}, projectId=${projectId}`);
    await notificationService.notifyInvite(applicantId, inviterId, projectId, project.title, 'pending');
    logger.info('Invite notification sent successfully');
  }

  return application;
};

const getMyApplications = async (userId) => {
  const applications = await Application.findAll({
    where: { applicantId: userId },
    include: [{
      model: Project,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'avatar']
      }]
    }],
    order: [['applied_at', 'DESC']]
  });
  
  return applications;
};

const getProjectApplications = async (projectId, userId) => {
  // 检查项目是否存在
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new Error('项目不存在');
  }
  
  // 检查权限
  if (Number(project.createdBy) !== Number(userId)) {
    throw new Error('没有权限');
  }
  
  const applications = await Application.findAll({
    where: { projectId, status: 'pending' },
    include: [{
      model: User,
      as: 'applicant',
      attributes: ['id', 'name', 'avatar', 'college', 'major', 'skills']
    }],
    order: [['applied_at', 'DESC']]
  });
  
  return applications;
};

const approveApplication = async (applicationId, userId) => {
  logger.info(`Approving application: applicationId=${applicationId}, userId=${userId}`);
  
  const application = await Application.findByPk(applicationId, {
    include: [{
      model: Project
    }]
  });

  if (!application) {
    logger.error(`Application not found: applicationId=${applicationId}`);
    throw new Error('申请不存在');
  }

  logger.info(`Application found: projectId=${application.projectId}, applicantId=${application.applicantId}, status=${application.status}`);

  // 检查权限
  if (Number(application.Project.createdBy) !== Number(userId)) {
    logger.error(`Permission denied: application creator=${application.Project.createdBy}, current user=${userId}`);
    throw new Error('没有权限');
  }

  // 检查申请状态
  if (application.status !== 'pending') {
    logger.error(`Application already processed: status=${application.status}`);
    throw new Error('申请已处理');
  }

  // 更新申请状态
  application.status = 'accepted';
  await application.save();

  // 添加为项目成员
  await ProjectMember.create({
    projectId: application.projectId,
    userId: application.applicantId,
    role: 'member',
    status: 'accepted'
  });

  // 发送通知给申请人（通过notificationService实现WebSocket实时推送）
  if (application.type === 'invite') {
    logger.info(`Sending invite accepted notification: applicantId=${application.applicantId}, projectId=${application.projectId}`);
    await notificationService.notifyInvite(application.applicantId, application.inviterId, application.projectId, application.Project.title, 'accepted');
  } else {
    logger.info(`Sending application approved notification: applicantId=${application.applicantId}, projectId=${application.projectId}`);
    await notificationService.notifyApplication(application.applicantId, application.Project.createdBy, application.projectId, application.Project.title, 'approved');
  }

  logger.info('Application approved successfully');
  return application;
};

const rejectApplication = async (applicationId, userId) => {
  logger.info(`Rejecting application: applicationId=${applicationId}, userId=${userId}`);
  
  const application = await Application.findByPk(applicationId, {
    include: [{
      model: Project
    }]
  });

  if (!application) {
    logger.error(`Application not found: applicationId=${applicationId}`);
    throw new Error('申请不存在');
  }

  logger.info(`Application found: projectId=${application.projectId}, applicantId=${application.applicantId}, status=${application.status}`);

  // 检查权限
  if (Number(application.Project.createdBy) !== Number(userId)) {
    logger.error(`Permission denied: application creator=${application.Project.createdBy}, current user=${userId}`);
    throw new Error('没有权限');
  }

  // 检查申请状态
  if (application.status !== 'pending') {
    logger.error(`Application already processed: status=${application.status}`);
    throw new Error('申请已处理');
  }

  // 更新申请状态
  application.status = 'rejected';
  await application.save();

  // 发送通知给申请人（通过notificationService实现WebSocket实时推送）
  if (application.type === 'invite') {
    logger.info(`Sending invite rejected notification: applicantId=${application.applicantId}, projectId=${application.projectId}`);
    await notificationService.notifyInvite(application.applicantId, application.inviterId, application.projectId, application.Project.title, 'rejected');
  } else {
    logger.info(`Sending application rejected notification: applicantId=${application.applicantId}, projectId=${application.projectId}`);
    await notificationService.notifyApplication(application.applicantId, application.Project.createdBy, application.projectId, application.Project.title, 'rejected');
  }

  logger.info('Application rejected successfully');
  return application;
};

module.exports = {
  createApplication,
  getMyApplications,
  getProjectApplications,
  approveApplication,
  rejectApplication
};
