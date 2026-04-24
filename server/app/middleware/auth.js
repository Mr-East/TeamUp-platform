const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return errorResponse(res, 'Access token required', 401);
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
  
  req.user = {
    id: decoded.id
  };
  
  next();
};

module.exports = authMiddleware;
