const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return errorResponse(res, 'Access token required', 401);
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
  
  // 获取完整用户信息
  const user = await User.findByPk(decoded.id, {
    attributes: ['id', 'email', 'name', 'avatar', 'college', 'major', 'bio', 'skills', 'verified', 'notificationEnabled']
  });
  
  if (!user) {
    return errorResponse(res, 'User not found', 401);
  }
  
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  
  next();
};

module.exports = authMiddleware;
