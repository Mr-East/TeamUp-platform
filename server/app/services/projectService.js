const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Application = require('../models/Application');
const Comment = require('../models/Comment');
const User = require('../models/User');

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
  const { page = 1, limit = 10, status = 'active', competitionType, skill, deadline } = filters;

  const where = {};
  if (status) {
    where.status = status;
  }

  const offset = (page - 1) * limit;

  const projects = await Project.findAll({
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

  // 计算每个项目的已加入人数和进度
  const projectsWithProgress = await Promise.all(projects.map(async (project) => {
    // 获取已接受的成员数量
    const memberCount = await ProjectMember.count({
      where: { projectId: project.id, status: 'accepted' }
    });

    // 计算进度
    const totalNeeded = project.peopleNeeded || 1;
    const progress = Math.min(Math.round((memberCount / totalNeeded) * 100), 100);

    // 检查竞赛类型筛选
    if (competitionType) {
      const projectCompetitionType = project.competitionType;
      // 如果筛选的是大类，需要检查是否匹配
      const mainCategories = ['创新创业', '学科竞赛', '技能大赛', '艺术设计', '科研项目'];
      if (mainCategories.includes(competitionType)) {
        // 大类筛选，需要根据具体类别来判断
        const categoryMap = {
          '创新创业': ['互联网+', '挑战杯', '创青春', '中国创新创业大赛', '青年红色筑梦之旅', '创业计划大赛'],
          '学科竞赛': ['数学建模', '电子设计大赛', '机械设计大赛', '程序设计大赛', '英语竞赛', '数学竞赛', '物理竞赛', '化学竞赛'],
          '技能大赛': ['职业技能大赛', '软件设计大赛', '网络安全大赛', '云计算大赛', '大数据大赛', '人工智能大赛'],
          '艺术设计': ['大广赛', '广告艺术大赛', '包装设计大赛', '环境设计大赛', '动画设计大赛', '工业设计大赛'],
          '科研项目': ['大创项目', '挑战杯学术赛道', '实验室项目', '学术论文竞赛', '暑期社会实践']
        };
        const categoryItems = categoryMap[competitionType] || [];
        if (!categoryItems.includes(projectCompetitionType)) {
          return null;
        }
      } else if (projectCompetitionType !== competitionType) {
        return null;
      }
    }

    // 检查技能筛选
    if (skill && project.skills) {
      const hasSkill = project.skills.some(s => s.toLowerCase() === skill.toLowerCase());
      if (!hasSkill) {
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
  const filteredProjects = projectsWithProgress.filter(project => project !== null);

  const total = await Project.count({ where });

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

const updateProject = async (projectId, projectData, userId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.createdBy !== userId) {
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

const deleteProject = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.createdBy !== userId) {
    throw new Error('Permission denied');
  }

  await project.destroy();

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
        include: [{
          model: User,
          attributes: ['id', 'name', 'avatar']
        }],
        order: [['created_at', 'ASC']]
      }
    ],
    order: [['created_at', 'DESC']]
  });

  return comments;
};

const createProjectComment = async (projectId, userId, content, parentCommentId = null) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  // 如果是回复，验证父评论是否存在
  if (parentCommentId) {
    const parentComment = await Comment.findByPk(parentCommentId);
    if (!parentComment) {
      throw new Error('Parent comment not found');
    }
  }

  const comment = await Comment.create({
    projectId,
    userId,
    content,
    parentCommentId
  });

  const populatedComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      attributes: ['id', 'name', 'avatar']
    }]
  });

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