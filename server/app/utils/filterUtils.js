const { Op } = require('sequelize');

/**
 * 安全的模糊匹配条件生成器
 * @param {string} field 字段名
 * @param {string} value 匹配值
 * @param {boolean} exact 是否精确匹配（默认false，模糊匹配）
 * @returns {object} Sequelize where条件
 */
const createFuzzyMatchCondition = (field, value, exact = false) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (exact) {
    return { [field]: trimmedValue };
  }

  return {
    [field]: {
      [Op.like]: `%${trimmedValue}%`
    }
  };
};

/**
 * 解析JSON字段为数组（兼容字符串和数组格式）
 * @param {any} data JSON数据
 * @returns {array} 解析后的数组
 */
const parseJsonArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * 在数组中进行模糊匹配
 * @param {array} array 目标数组
 * @param {string} searchValue 搜索值
 * @returns {boolean} 是否匹配
 */
const fuzzyMatchInArray = (array, searchValue) => {
  if (!array || !searchValue) return false;

  const arr = parseJsonArray(array);
  const lowerSearch = searchValue.toLowerCase().trim();
  
  return arr.some(item => 
    typeof item === 'string' && item.toLowerCase().includes(lowerSearch)
  );
};

/**
 * 构建where条件对象
 * @param {object} filters 筛选条件对象
 * @param {object} fieldConfig 字段配置 { fieldName: { exact: boolean, defaultValue: any } }
 * @returns {object} Sequelize where条件
 */
const buildWhereCondition = (filters, fieldConfig) => {
  const where = {};

  Object.keys(fieldConfig).forEach(fieldName => {
    const config = fieldConfig[fieldName];
    const value = filters[fieldName];

    if (value === undefined || value === null || value === '') {
      if (config.defaultValue !== undefined) {
        where[fieldName] = config.defaultValue;
      }
      return;
    }

    const condition = createFuzzyMatchCondition(fieldName, value, config.exact);
    if (condition) {
      Object.assign(where, condition);
    }
  });

  return where;
};

/**
 * 分页参数处理
 * @param {object} filters 筛选条件对象
 * @param {number} defaultLimit 默认每页数量
 * @returns {object} { page, limit, offset }
 */
const parsePagination = (filters, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(filters.page) || 1);
  const limit = Math.max(1, parseInt(filters.limit) || defaultLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

module.exports = {
  createFuzzyMatchCondition,
  parseJsonArray,
  fuzzyMatchInArray,
  buildWhereCondition,
  parsePagination
};
