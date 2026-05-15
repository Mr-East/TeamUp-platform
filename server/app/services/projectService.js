const { Op, Sequelize } = require('sequelize');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Application = require('../models/Application');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { parseJsonArray, fuzzyMatchInArray, parsePagination } = require('../utils/filterUtils');

const calculateDeadline = (deadlineType) => {
  const now = new Date();
  let deadlineDate = null;

  switch (deadlineType) {
    case '一周内':
      deadlineDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case '两周内':
      deadlineDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      break;
    case '一个月内':
      deadlineDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      break;
    case '三个月内':
      deadlineDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      break;
  }

  return deadlineDate;
};

const createProject = async (projectData, userId) => {
  const project = await Project.create({
    ...projectData,
    createdBy: userId
  });

  await ProjectMember.create({
    projectId: project.id,
    userId: userId,
    role: 'owner',
    status: 'accepted'
  });

  return project;
};

const getProjects = async (filters = {}) => {
  const { page, limit, offset } = parsePagination(filters, 10);
  const status = filters.status || 'active';
  const competitionType = filters.competitionType;
  const skill = filters.skill;
  const deadline = filters.deadline;
  const title = filters.title;

  const where = {};

  where.status = { [Op.ne]: 'deleted' };

  if (status && status !== 'all') {
    where.status = status;
  }
  if (competitionType) {
    where.competitionType = competitionType;
  }
  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }
  if (deadline) {
    const deadlineDate = calculateDeadline(deadline);
    if (deadlineDate) {
      where.deadline = { [Op.lte]: deadlineDate };
    }
  }

  // 如果有技能筛选，需要先查询所有符合条件的数据，然后在内存中筛选和分页
  // 否则直接在数据库层面分页
  let allProjects;

  if (skill) {
    // 有技能筛选时，先获取所有符合其他条件的数据
    allProjects = await Project.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'avatar']
      }],
      order: [['created_at', 'DESC']]
    });
  } else {
    // 没有技能筛选时，直接分页查询
    const offset = (page - 1) * limit;
    allProjects = await Project.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'avatar']
      }],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
  }

  // 计算每个项目的已加入人数和进度，并进行技能筛选
  const projectsWithProgress = await Promise.all(allProjects.map(async (project) => {
    // 获取已接受的成员数量
    const memberCount = await ProjectMember.count({
      where: { projectId: project.id, status: 'accepted' }
    });

    // 计算进度
    const totalNeeded = project.peopleNeeded || 1;
    const progress = Math.min(Math.round((memberCount / totalNeeded) * 100), 100);

    // 检查技能筛选（在内存中进行，避免数据库兼容性问题）
    if (skill) {
      // 使用统一的模糊匹配工具函数
      if (!fuzzyMatchInArray(project.skills, skill)) {
        return null;
      }
    }

    // 检查截止时间筛选
    if (deadline) {
      const now = new Date();
      const projectDeadline = new Date(project.deadline);
      const timeDiff = projectDeadline - now;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (deadline === '一周内' && daysDiff > 7) {
        return null;
      } else if (deadline === '两周内' && daysDiff > 14) {
        return null;
      } else if (deadline === '一个月内' && daysDiff > 30) {
        return null;
      } else if (deadline === '三个月内' && daysDiff > 90) {
        return null;
      }
    }

    return {
      ...project.toJSON(),
      joined: memberCount,
      total: totalNeeded,
      progress
    };
  }));

  // 过滤掉不符合筛选条件的项目
  let filteredProjects = projectsWithProgress.filter(project => project !== null);

  // 如果有技能筛选，需要进行分页
  let total = filteredProjects.length;
  if (skill) {
    const offset = (page - 1) * limit;
    filteredProjects = filteredProjects.slice(offset, offset + limit);
  } else {
    // 没有技能筛选时，总数来自数据库
    total = await Project.count({ where });
  }

  return {
    projects: filteredProjects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

const getProjectById = async (projectId) => {
  const project = await Project.findByPk(projectId, {
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'name', 'avatar', 'college', 'major']
    }]
  });

  if (!project) {
    throw new Error('Project not found');
  }

  return project;
};

const getUserProjects = async (userId) => {
  const projects = await Project.findAll({
    where: { createdBy: userId },
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'name', 'avatar', 'college', 'major']
    }],
    order: [['created_at', 'DESC']]
  });

  return projects;
};

const updateProject = async (projectId, projectData, userId, isAdmin = false) => {
  const project = await Project.findByPk(Number(projectId));

  if (!project) {
    throw new Error('Project not found');
  }

  if (!isAdmin && Number(project.createdBy) !== Number(userId)) {
    throw new Error('Permission denied');
  }

  const allowedFields = ['title', 'description', 'competitionName', 'competitionType', 'deadline', 'peopleNeeded', 'verificationRequired', 'coverImage', 'skills'];
  allowedFields.forEach(field => {
    if (projectData[field] !== undefined) {
      project[field] = projectData[field];
    }
  });

  await project.save();

  return project;
};

const deleteProject = async (projectId, userId, isAdmin = false) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  // 如果不是管理员，只能删除自己创建的项目
  if (!isAdmin && Number(project.createdBy) !== Number(userId)) {
    throw new Error('Permission denied');
  }

  // 软删除：将 status 设置为 'deleted'
  project.status = 'deleted';
  await project.save();

  return { message: 'Project deleted successfully' };
};

const closeProject = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.createdBy !== userId) {
    throw new Error('Permission denied');
  }

  project.status = 'closed';
  await project.save();

  return project;
};

const getProjectMembers = async (projectId) => {
  const members = await ProjectMember.findAll({
    where: { projectId, status: 'accepted' },
    include: [{
      model: User,
      attributes: ['id', 'name', 'avatar', 'college', 'major', 'skills']
    }]
  });

  return members;
};

const joinProject = async (projectId, userId, reasonText) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.status !== 'active') {
    throw new Error('Project is closed');
  }

  if (project.createdBy === userId) {
    throw new Error('You are the project owner');
  }

  const existingMember = await ProjectMember.findOne({
    where: { projectId, userId, status: 'accepted' }
  });
  if (existingMember) {
    throw new Error('You are already a member of this project');
  }

  const existingApplication = await Application.findOne({
    where: { projectId, applicantId: userId, status: 'pending' }
  });
  if (existingApplication) {
    throw new Error('You have already submitted an application');
  }

  const application = await Application.create({
    projectId,
    applicantId: userId,
    reasonText: reasonText || ''
  });

  return application;
};

const getJoinStatus = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.createdBy === userId) {
    return { status: 'owner' };
  }

  const member = await ProjectMember.findOne({
    where: { projectId, userId, status: 'accepted' }
  });
  if (member) {
    return { status: 'member' };
  }

  const application = await Application.findOne({
    where: { projectId, applicantId: userId }
  });
  if (application) {
    return { status: application.status, applicationId: application.id };
  }

  return { status: 'none' };
};

const getProjectComments = async (projectId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  console.log('获取项目评论，项目ID:', projectId);

  const comments = await Comment.findAll({
    where: { projectId, parentCommentId: null },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'avatar']
      },
      {
        model: Comment,
        as: 'replies',
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'avatar']
          },
          {
            model: Comment,
            as: 'parent',
            include: [{
              model: User,
              attributes: ['id', 'name', 'avatar']
            }]
          },
          {
            model: Comment,
            as: 'replies',
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'avatar']
              },
              {
                model: Comment,
                as: 'parent',
                include: [{
                  model: User,
                  attributes: ['id', 'name', 'avatar']
                }]
              }
            ],
            order: [['created_at', 'ASC']]
          }
        ],
        order: [['created_at', 'ASC']]
      }
    ],
    order: [['created_at', 'DESC']]
  });

  console.log('获取到评论数量:', comments.length);
  comments.forEach(comment => {
    console.log('评论ID:', comment.id, '用户ID:', comment.userId, '用户信息:', comment.user);
    if (comment.replies && comment.replies.length > 0) {
      console.log('回复数量:', comment.replies.length);
      comment.replies.forEach(reply => {
        console.log('回复ID:', reply.id, '用户ID:', reply.userId, '用户信息:', reply.user, '父评论ID:', reply.parentCommentId);
      });
    }
  });

  return comments;
};

const createProjectComment = async (projectId, userId, content, parentCommentId = null) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  console.log('创建评论，用户ID:', userId, '内容:', content, '父评论ID:', parentCommentId);

  // 如果是回复，验证父评论是否存在
  if (parentCommentId) {
    const parentComment = await Comment.findByPk(parentCommentId);
    if (!parentComment) {
      throw new Error('Parent comment not found');
    }
    console.log('父评论存在，ID:', parentComment.id);
  }

  const comment = await Comment.create({
    projectId,
    userId,
    content,
    parentCommentId
  });

  console.log('评论创建成功，ID:', comment.id);

  const populatedComment = await Comment.findByPk(comment.id, {
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'avatar']
      },
      {
        model: Comment,
        as: 'parent',
        include: [{
          model: User,
          attributes: ['id', 'name', 'avatar']
        }]
      }
    ]
  });

  console.log('评论关联用户信息:', populatedComment.user);

  return populatedComment;
};

const likeProjectComment = async (commentId) => {
  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    throw new Error('Comment not found');
  }

  comment.likesCount += 1;
  await comment.save();

  return comment;
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
