const { Op } = require('sequelize');
const User = require('../models/User');
const Project = require('../models/Project');
const TalentProfile = require('../models/TalentProfile');

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: {
      exclude: ['password']
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

const updateUser = async (userId, userData) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // 只更新允许更新的字段
  const allowedFields = ['name', 'avatar', 'college', 'major', 'grade', 'bio', 'skills', 'notificationEnabled'];
  allowedFields.forEach(field => {
    if (userData[field] !== undefined) {
      user[field] = userData[field];
    }
  });
  
  await user.save();
  
  // 返回更新后的用户信息（不包含密码）
  const updatedUser = await User.findByPk(userId, {
    attributes: {
      exclude: ['password']
    }
  });
  
  return updatedUser;
};

const getUserPosts = async (userId) => {
  const projects = await Project.findAll({
    where: { 
      createdBy: userId,
      status: { [Op.ne]: 'deleted' } // 过滤已删除的项目
    },
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'name', 'avatar']
    }],
    order: [['created_at', 'DESC']]
  });
  
  const talentProfile = await TalentProfile.findOne({
    where: { userId: userId }
  });
  
  return {
    projects,
    talentProfile
  };
};

const toggleProjectStatus = async (projectId, userId) => {
  const project = await Project.findByPk(Number(projectId));
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  if (Number(project.createdBy) !== Number(userId)) {
    throw new Error('Permission denied');
  }
  
  project.status = project.status === 'active' ? 'closed' : 'active';
  await project.save();
  
  return project;
};

const toggleTalentProfileStatus = async (talentProfileId, userId, isAdmin = false) => {
  const talentProfile = await TalentProfile.findByPk(Number(talentProfileId));

  if (!talentProfile) {
    throw new Error('Talent profile not found');
  }

  if (!isAdmin && Number(talentProfile.userId) !== Number(userId)) {
    throw new Error('Permission denied');
  }

  talentProfile.status = talentProfile.status === 'active' ? 'closed' : 'active';
  await talentProfile.save();

  return talentProfile;
};

const deleteProject = async (projectId, userId) => {
  const project = await Project.findByPk(Number(projectId));

  if (!project) {
    throw new Error('Project not found');
  }

  if (Number(project.createdBy) !== Number(userId)) {
    throw new Error('Permission denied');
  }

  // 软删除：将 status 设置为 'deleted'
  project.status = 'deleted';
  await project.save();

  return { message: 'Project deleted successfully' };
};

const deleteTalentProfile = async (talentProfileId, userId) => {
  const talentProfile = await TalentProfile.findByPk(Number(talentProfileId));
  
  if (!talentProfile) {
    throw new Error('Talent profile not found');
  }
  
  if (Number(talentProfile.userId) !== Number(userId)) {
    throw new Error('Permission denied');
  }
  
  await talentProfile.destroy();
  return { message: 'Talent profile deleted successfully' };
};

const getTalents = async (filters = {}, page = 1, limit = 10) => {
  const where = {};
  
  if (filters.grade) {
    where.grade = filters.grade;
  }
  
  if (filters.major) {
    where.major = filters.major;
  }
  
  const offset = (page - 1) * limit;
  
  const users = await User.findAll({
    attributes: {
      exclude: ['password']
    },
    where,
    include: [{
      model: TalentProfile,
      as: 'talentProfile',
      where: { status: 'active' }, // 只显示活跃的人才档案
      required: true, // 必须有关联的 talentProfile
      attributes: ['targetTrack', 'bio', 'skills', 'status']
    }],
    order: [['created_at', 'DESC']],
    offset,
    limit
  });
  
  // 处理数据，将 talentProfile 中的字段合并到用户对象中
  const talents = users.map(user => {
    const userData = user.toJSON();
    if (userData.talentProfile) {
      userData.targetTrack = userData.talentProfile.targetTrack;
      // 优先使用 talentProfile 中的 bio 和 skills
      userData.bio = userData.talentProfile.bio;
      userData.skills = userData.talentProfile.skills;
      delete userData.talentProfile;
    }
    return userData;
  });
  
  // 技能筛选在内存中处理
  if (filters.skill) {
    const filteredTalents = talents.filter(user => {
      if (!user.skills || !Array.isArray(user.skills)) return false;
      return user.skills.some(skill => 
        skill.toLowerCase().includes(filters.skill.toLowerCase())
      );
    });
    return filteredTalents;
  }
  
  return talents;
};

const getUsers = async (filters = {}, page = 1, limit = 10) => {
  const where = {};

  if (filters.username) {
    where.name = {
      [Op.like]: `%${filters.username}%`
    };
  }

  if (filters.email) {
    where.email = {
      [Op.like]: `%${filters.email}%`
    };
  }

  if (filters.grade) {
    where.grade = {
      [Op.like]: `%${filters.grade}%`
    };
  }

  if (filters.major) {
    where.major = {
      [Op.like]: `%${filters.major}%`
    };
  }

  if (filters.status) {
    where.status = filters.status;
  }
  
  const offset = (page - 1) * limit;
  
  const { count, rows } = await User.findAndCountAll({
    attributes: {
      exclude: ['password']
    },
    where,
    order: [['created_at', 'DESC']],
    offset,
    limit
  });
  
  return {
    users: rows,
    total: count
  };
};

module.exports = {
  getUserById,
  updateUser,
  getUserPosts,
  getTalents,
  getUsers,
  toggleProjectStatus,
  toggleTalentProfileStatus,
  deleteProject,
  deleteTalentProfile
};
