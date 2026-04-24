const Application = require('../models/Application');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const User = require('../models/User');
const Notification = require('../models/Notification');

const createApplication = async (projectId, applicantId, reasonText, type = 'apply', inviterId = null) => {
  // 检查项目是否存在
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new Error('Project not found');
  }
  
  // 检查项目状态
  if (project.status !== 'active') {
    throw new Error('Project is closed');
  }
  
  // 检查是否已经申请过
  const existingApplication = await Application.findOne({
    where: { projectId, applicantId }
  });
  if (existingApplication) {
    throw new Error('Application already submitted');
  }
  
  // 检查是否已经是项目成员
  const existingMember = await ProjectMember.findOne({
    where: { projectId, userId: applicantId }
  });
  if (existingMember) {
    throw new Error('You are already a member of this project');
  }
  
  // 如果是邀请类型，检查权限
  if (type === 'invite' && inviterId) {
    if (project.createdBy !== inviterId) {
      throw new Error('Permission denied: only project creator can invite');
    }
    const invitedUser = await User.findByPk(applicantId);
    if (!invitedUser) {
      throw new Error('User not found');
    }
  }
  
  // 创建申请
  const application = await Application.create({
    projectId,
    applicantId,
    reasonText,
    type,
    inviterId: type === 'invite' ? inviterId : null
  });
  
  // 发送通知
  if (type === 'apply') {
    await Notification.create({
      receiverId: project.createdBy,
      type: 'application',
      title: 'New application received',
      content: `You have a new application from ${(await User.findByPk(applicantId)).name} for your project ${project.title}`
    });
  } else {
    await Notification.create({
      receiverId: applicantId,
      type: 'invitation',
      title: 'New team invitation',
      content: `${(await User.findByPk(inviterId)).name} invited you to join their project ${project.title}`
    });
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
    throw new Error('Project not found');
  }
  
  // 检查权限
  if (project.createdBy !== userId) {
    throw new Error('Permission denied');
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
  const application = await Application.findByPk(applicationId, {
    include: [{
      model: Project
    }]
  });
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  // 检查权限
  if (application.Project.createdBy !== userId) {
    throw new Error('Permission denied');
  }
  
  // 检查申请状态
  if (application.status !== 'pending') {
    throw new Error('Application already processed');
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
  
  // 发送通知给申请人
  await Notification.create({
    receiverId: application.applicantId,
    type: 'approval',
    title: 'Application approved',
    content: `Your application for project ${application.Project.title} has been approved`
  });
  
  return application;
};

const rejectApplication = async (applicationId, userId) => {
  const application = await Application.findByPk(applicationId, {
    include: [{
      model: Project
    }]
  });
  
  if (!application) {
    throw new Error('Application not found');
  }
  
  // 检查权限
  if (application.Project.createdBy !== userId) {
    throw new Error('Permission denied');
  }
  
  // 检查申请状态
  if (application.status !== 'pending') {
    throw new Error('Application already processed');
  }
  
  // 更新申请状态
  application.status = 'rejected';
  await application.save();
  
  // 发送通知给申请人
  await Notification.create({
    receiverId: application.applicantId,
    type: 'approval',
    title: 'Application rejected',
    content: `Your application for project ${application.Project.title} has been rejected`
  });
  
  return application;
};

module.exports = {
  createApplication,
  getMyApplications,
  getProjectApplications,
  approveApplication,
  rejectApplication
};
