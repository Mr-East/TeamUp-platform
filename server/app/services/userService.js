const User = require('../models/User');
const Project = require('../models/Project');

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
  const allowedFields = ['name', 'avatar', 'college', 'major', 'bio', 'skills', 'notificationEnabled'];
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
    where: { createdBy: userId },
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'name', 'avatar']
    }],
    order: [['created_at', 'DESC']]
  });
  
  return projects;
};

const getTalents = async (filters = {}) => {
  const where = {};
  
  if (filters.grade) {
    where.grade = filters.grade;
  }
  
  if (filters.major) {
    where.major = filters.major;
  }
  
  const users = await User.findAll({
    attributes: {
      exclude: ['password']
    },
    where,
    order: [['created_at', 'DESC']]
  });
  
  // 技能筛选在内存中处理
  if (filters.skill) {
    return users.filter(user => {
      if (!user.skills || !Array.isArray(user.skills)) return false;
      return user.skills.some(skill => 
        skill.toLowerCase().includes(filters.skill.toLowerCase())
      );
    });
  }
  
  return users;
};

module.exports = {
  getUserById,
  updateUser,
  getUserPosts,
  getTalents
};
