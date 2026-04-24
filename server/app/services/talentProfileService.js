const { Op } = require('sequelize');
const TalentProfile = require('../models/TalentProfile');
const User = require('../models/User');

const createTalentProfile = async (profileData, userId) => {
  // 检查用户是否已有求组队信息
  const existingProfile = await TalentProfile.findOne({
    where: { userId, status: 'active' }
  });

  if (existingProfile) {
    // 更新现有信息
    await existingProfile.update(profileData);
    return existingProfile;
  } else {
    // 创建新的求组队信息
    const profile = await TalentProfile.create({
      ...profileData,
      userId
    });
    return profile;
  }
};

const getTalentProfiles = async (filters = {}) => {
  const { page = 1, limit = 10, skill, grade, major } = filters;

  const where = {};
  if (skill) {
    where.skills = {
      [Op.contains]: [skill]
    };
  }

  const offset = (page - 1) * limit;

  const profiles = await TalentProfile.findAll({
    where: {
      ...where,
      status: 'active'
    },
    include: [{
      model: User,
      attributes: ['id', 'name', 'avatar', 'college', 'major', 'grade']
    }],
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });

  const total = await TalentProfile.count({
    where: {
      ...where,
      status: 'active'
    }
  });

  return {
    profiles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

const getTalentProfileByUserId = async (userId) => {
  const profile = await TalentProfile.findOne({
    where: { userId, status: 'active' },
    include: [{
      model: User,
      attributes: ['id', 'name', 'avatar', 'college', 'major', 'grade']
    }]
  });
  return profile;
};

const updateTalentProfile = async (profileId, profileData, userId) => {
  const profile = await TalentProfile.findOne({
    where: { id: profileId, userId }
  });

  if (!profile) {
    throw new Error('Profile not found or permission denied');
  }

  await profile.update(profileData);
  return profile;
};

const deleteTalentProfile = async (profileId, userId) => {
  const profile = await TalentProfile.findOne({
    where: { id: profileId, userId }
  });

  if (!profile) {
    throw new Error('Profile not found or permission denied');
  }

  await profile.update({ status: 'inactive' });
  return { message: 'Profile deleted successfully' };
};

module.exports = {
  createTalentProfile,
  getTalentProfiles,
  getTalentProfileByUserId,
  updateTalentProfile,
  deleteTalentProfile
};