const express = require('express');
const cors = require('cors');
const sequelize = require('./app/config/database');
const serverConfig = require('./app/config/server');
const errorHandler = require('./app/middleware/errorHandler');
const logger = require('./app/utils/logger');

// 导入路由
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const projectRoutes = require('./app/routes/projectRoutes');
const applicationRoutes = require('./app/routes/applicationRoutes');
const commentRoutes = require('./app/routes/commentRoutes');
const messageRoutes = require('./app/routes/messageRoutes');
const notificationRoutes = require('./app/routes/notificationRoutes');
const competitionRoutes = require('./app/routes/competitionRoutes');
const talentProfileRoutes = require('./app/routes/talentProfileRoutes');
const uploadRoutes = require('./app/routes/uploadRoutes');

const app = express();

// 请求日志中间件
app.use((req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const url = req.originalUrl;
  
  // 记录请求开始
  logger.request(method, url);
  
  // 监听响应完成
  const originalSend = res.send;
  const originalJson = res.json;
  
  const logResponse = () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    logger.response(method, url, statusCode, duration);
  };
  
  res.send = function(data) {
    logResponse();
    return originalSend.apply(this, arguments);
  };
  
  res.json = function(data) {
    logResponse();
    return originalJson.apply(this, arguments);
  };
  
  next();
});

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/talent-profiles', talentProfileRoutes);
app.use('/api/upload', uploadRoutes);

// 错误处理中间件
app.use(errorHandler);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 启动服务器
const startServer = async () => {
  try {
    // 尝试连接数据库
    try {
      await sequelize.authenticate();
      logger.info('Database connection established successfully');
      
      // 同步数据库模型
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized');
    } catch (dbError) {
      logger.warn('Database connection failed, starting server without database:', dbError.message);
    }
    
    // 启动服务器
    app.listen(serverConfig.port, () => {
      logger.info(`Server running on port ${serverConfig.port}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
