const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // 处理Sequelize错误
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return errorResponse(res, 'Validation error', 400, errors);
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'Duplicate entry', 400);
  }
  
  // 处理其他错误
  return errorResponse(res, err.message || 'Internal server error', err.status || 500);
};

module.exports = errorHandler;
