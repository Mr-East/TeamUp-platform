// 获取当前时间戳
const getTimestamp = () => {
  return new Date().toISOString();
};

// 日志级别
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// 当前日志级别
const currentLevel = LOG_LEVELS.INFO;

// 日志方法
const logger = {
  debug: (message, data = null) => {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
      let logMsg = `[${getTimestamp()}] [DEBUG] ${message}`;
      if (data !== null) {
        logMsg += ` - ${JSON.stringify(data)}`;
      }
      console.log(logMsg);
    }
  },
  
  info: (message, data = null) => {
    if (currentLevel <= LOG_LEVELS.INFO) {
      let logMsg = `[${getTimestamp()}] [INFO] ${message}`;
      if (data !== null) {
        logMsg += ` - ${JSON.stringify(data)}`;
      }
      console.log(logMsg);
    }
  },
  
  warn: (message, data = null) => {
    if (currentLevel <= LOG_LEVELS.WARN) {
      let logMsg = `[${getTimestamp()}] [WARN] ${message}`;
      if (data !== null) {
        logMsg += ` - ${JSON.stringify(data)}`;
      }
      console.warn(logMsg);
    }
  },
  
  error: (message, error = null) => {
    if (currentLevel <= LOG_LEVELS.ERROR) {
      let logMsg = `[${getTimestamp()}] [ERROR] ${message}`;
      if (error) {
        logMsg += ` - ${error.message || error}`;
      }
      console.error(logMsg);
      if (error?.stack) {
        console.error(error.stack);
      }
    }
  },
  
  request: (method, url) => {
    console.log(`[${getTimestamp()}] [REQUEST] ${method} ${url} - START`);
  },
  
  response: (method, url, statusCode, duration) => {
    const statusSymbol = statusCode >= 200 && statusCode < 300 ? '✓' :
                        statusCode >= 400 && statusCode < 500 ? '⚠' : '✗';
    console.log(`[${getTimestamp()}] [RESPONSE] ${method} ${url} - ${statusSymbol} ${statusCode} (${duration}ms)`);
  },
  
  database: (operation, message) => {
    console.log(`[${getTimestamp()}] [DATABASE] ${operation} - ${message}`);
  }
};

module.exports = logger;
