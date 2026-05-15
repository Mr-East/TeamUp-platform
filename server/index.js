const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const sequelize = require('./app/config/database');
const serverConfig = require('./app/config/server');
const errorHandler = require('./app/middleware/errorHandler');
const logger = require('./app/utils/logger');
const notificationService = require('./app/services/notificationService');

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

// 创建HTTP服务器
const server = http.createServer(app);

// WebSocket服务器
const wss = new WebSocket.Server({ server, path: '/ws' });

// WebSocket连接管理
const userConnections = new Map(); // userId -> Set<WebSocket>

wss.on('connection', (ws, req) => {
  logger.info('WebSocket connection established');

  ws.isAlive = true;
  ws.userId = null;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // 处理登录消息（将WebSocket与用户关联）
      if (data.type === 'AUTH' && data.userId) {
        ws.userId = data.userId;
        
        // 将连接添加到用户映射
        if (!userConnections.has(data.userId)) {
          userConnections.set(data.userId, new Set());
        }
        userConnections.get(data.userId).add(ws);
        
        logger.info(`WebSocket user authenticated: ${data.userId}`);
        
        ws.send(JSON.stringify({ type: 'AUTH_SUCCESS', userId: data.userId }));
      }
      
      // 处理心跳
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
      }
    } catch (error) {
      logger.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    // 清理连接
    if (ws.userId && userConnections.has(ws.userId)) {
      userConnections.get(ws.userId).delete(ws);
      if (userConnections.get(ws.userId).size === 0) {
        userConnections.delete(ws.userId);
      }
    }
    logger.info('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
});

// WebSocket心跳检测（每30秒检测一次）
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      if (ws.userId && userConnections.has(ws.userId)) {
        userConnections.get(ws.userId).delete(ws);
        if (userConnections.get(ws.userId).size === 0) {
          userConnections.delete(ws.userId);
        }
      }
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

// 将wss传递给notificationService
notificationService.setWss({
  clients: {
    forEach: (callback) => {
      wss.clients.forEach((ws) => {
        if (ws.userId) {
          callback(ws);
        }
      });
    }
  },
  sendToUser: (userId, message) => {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });
    }
  }
});

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

// WebSocket健康检查
app.get('/ws/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    connections: wss.clients.size,
    users: userConnections.size
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 尝试连接数据库
    try {
      await sequelize.authenticate();
      logger.info('Database connection established successfully');
      
      // 同步数据库模型
      await sequelize.sync();
    } catch (dbError) {
      logger.warn('Database connection failed, starting server without database:', dbError.message);
    }
    
    // 启动服务器
    server.listen(serverConfig.port, () => {
      logger.info(`Server running on port ${serverConfig.port}`);
      logger.info(`WebSocket server running on ws://localhost:${serverConfig.port}/ws`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
