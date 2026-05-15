const TalentProfile = require('../models/TalentProfile');
const sequelize = require('../config/database');
const { parseJsonArray, fuzzyMatchInArray, parsePagination } = require('../utils/filterUtils');

const createTalentProfile = async (profileData, userId) => {
  const existingProfile = await TalentProfile.findOne({
    where: { userId, status: 'active' }
  });

  if (existingProfile) {
    await existingProfile.update(profileData);
    return existingProfile;
  } else {
    const profile = await TalentProfile.create({
      ...profileData,
      userId
    });
    return profile;
  }
};

const getTalentProfiles = async (filters = {}) => {
  const { page, limit, offset } = parsePagination(filters, 10);
  const { name, skill, status } = filters;

  let statusFilter = status ? `AND tp.status = '${status}'` : 'AND tp.status = \'active\'';
  let nameFilter = name ? `AND u.name LIKE '%${name}%'` : '';

  const query = `
    SELECT tp.*, u.id as user_id, u.name, u.avatar, u.college, u.major, u.grade
    FROM talent_profiles tp
    LEFT JOIN users u ON tp.userId = u.id
    WHERE 1=1 ${statusFilter} ${nameFilter}
    ORDER BY tp.created_at DESC
    LIMIT ${offset}, ${limit}
  `;

  const [results, metadata] = await sequelize.query(query);
  
  let filteredProfiles = results;

  if (skill) {
    filteredProfiles = results.filter(profile =>
      fuzzyMatchInArray(profile.skills, skill)
    );
  }

  return {
    talents: filteredProfiles,
    total: filteredProfiles.length,
    page,
    limit,
    totalPages: Math.ceil(filteredProfiles.length / limit)
  };
};

const getTalentProfileByUserId = async (userId) => {
  const query = `
    SELECT tp.*, u.id as user_id, u.name, u.avatar, u.college, u.major, u.grade
    FROM talent_profiles tp
    LEFT JOIN users u ON tp.userId = u.id
    WHERE tp.userId = ${userId} AND tp.status = 'active'
  `;

  const [results, metadata] = await sequelize.query(query);

  return results.length > 0 ? results[0] : null;
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