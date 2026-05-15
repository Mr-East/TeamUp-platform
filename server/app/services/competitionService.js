const Project = require('../models/Project');
const User = require('../models/User');
const { Op } = require('sequelize');

// 模拟技能标签
const skills = [
  '前端开发', '后端开发', '移动开发', '人工智能', '机器学习',
  '数据科学', '大数据', '云计算', '区块链', '网络安全',
  '嵌入式开发', '物联网', 'UI设计', 'UX设计', '产品经理',
  '项目管理', '市场营销', '商务策划', '财务分析', '法律',
  '数学建模', '物理', '化学', '生物', '环境科学',
  '机械设计', '电子电路', '自动化', '材料科学', '土木工程'
];

const getCompetitions = async (filters = {}, page = 1, limit = 10) => {
  const where = {};
  
  if (filters.name) {
    where.competitionName = {
      [Op.like]: `%${filters.name}%`
    };
  }
  
  if (filters.type) {
    where.competitionType = {
      [Op.like]: `%${filters.type}%`
    };
  }
  
  const offset = (page - 1) * limit;
  
  const { count, rows } = await Project.findAndCountAll({
    where,
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'name', 'avatar']
    }],
    order: [['created_at', 'DESC']],
    offset,
    limit
  });
  
  // 处理数据，添加创建人信息
  const competitions = rows.map(project => {
    const projectData = project.toJSON();
    if (projectData.creator) {
      projectData.createdByName = projectData.creator.name;
    }
    return projectData;
  });
  
  return {
    projects: competitions,
    total: count
  };
};

const getCompetitionById = async (id) => {
  const project = await Project.findByPk(Number(id), {
    include: [{
      model: User,
      as: 'creator',
      attributes: ['id', 'name', 'avatar']
    }]
  });
  
  if (!project) {
    throw new Error('Competition not found');
  }
  
  return project;
};

const getSkills = () => {
  return skills;
};

const searchSkills = (query) => {
  return skills.filter(skill => skill.toLowerCase().includes(query.toLowerCase()));
};

module.exports = {
  getCompetitions,
  getCompetitionById,
  getSkills,
  searchSkills
};
