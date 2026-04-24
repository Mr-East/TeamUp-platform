const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
  try {
    const { name, email, password, college, major } = req.body;
    
    if (!name || !email || !password || !college || !major) {
      return errorResponse(res, 'Missing required fields', 400);
    }
    
    const result = await authService.register(req.body);
    return successResponse(res, result, 'Registration successful', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return errorResponse(res, 'Missing required fields', 400);
    }
    
    const result = await authService.login(email, password);
    return successResponse(res, result, 'Login successful');
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return errorResponse(res, 'Missing refresh token', 400);
    }
    
    const result = await authService.refreshToken(refreshToken);
    return successResponse(res, result, 'Token refreshed successfully');
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

const verify = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await authService.verifyUser(id);
    return successResponse(res, user, 'User verified successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  verify
};
