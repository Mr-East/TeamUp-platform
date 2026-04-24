const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const register = async (userData) => {
  const { name, email, password, college, major } = userData;
  
  // 检查邮箱是否已存在
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  // 哈希密码
  const hashedPassword = await hashPassword(password);
  
  // 创建用户
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    college,
    major,
    skills: []
  });
  
  // 生成token
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      college: user.college,
      major: user.major,
      bio: user.bio,
      skills: user.skills,
      verified: user.verified,
      notificationEnabled: user.notificationEnabled
    },
    token,
    refreshToken
  };
};

const login = async (email, password) => {
  // 查找用户
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // 验证密码
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  // 生成token
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      college: user.college,
      major: user.major,
      bio: user.bio,
      skills: user.skills,
      verified: user.verified,
      notificationEnabled: user.notificationEnabled
    },
    token,
    refreshToken
  };
};

const refreshToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new Error('Invalid refresh token');
  }
  
  const user = await User.findByPk(decoded.id);
  if (!user) {
    throw new Error('User not found');
  }
  
  const newToken = generateToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);
  
  return {
    token: newToken,
    refreshToken: newRefreshToken
  };
};

const verifyUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    college: user.college,
    major: user.major,
    bio: user.bio,
    skills: user.skills,
    verified: user.verified,
    notificationEnabled: user.notificationEnabled
  };
};

module.exports = {
  register,
  login,
  refreshToken,
  verifyUser
};
