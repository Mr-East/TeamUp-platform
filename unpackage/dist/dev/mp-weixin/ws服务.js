"use strict";
const common_vendor = require("./common/vendor.js");
class WebSocketService {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.isConnected = false;
    this.reconnectInterval = 3e3;
    this.maxReconnectAttempts = 5;
    this.reconnectAttempts = 0;
    this.listeners = /* @__PURE__ */ new Map();
    this.notificationHandler = null;
  }
  setNotificationHandler(handler) {
    this.notificationHandler = handler;
  }
  connect(userId) {
    if (!userId) {
      common_vendor.index.__f__("warn", "at ws服务.js:19", "WebSocket: No userId provided, skipping connection");
      return;
    }
    this.userId = userId;
    if (this.ws && this.ws.readyState === 1) {
      this.authenticate();
      return;
    }
    try {
      const wsUrl = `ws://localhost:3000/ws`;
      common_vendor.index.__f__("log", "at ws服务.js:32", "WebSocket: Connecting to", wsUrl);
      this.ws = common_vendor.index.connectSocket({
        url: wsUrl,
        success: () => {
          common_vendor.index.__f__("log", "at ws服务.js:37", "WebSocket: Connection initiated");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at ws服务.js:40", "WebSocket: Connection failed", err);
          this.handleReconnect();
        }
      });
      this.setupEventHandlers();
    } catch (error) {
      common_vendor.index.__f__("error", "at ws服务.js:47", "WebSocket: Connection error", error);
      this.handleReconnect();
    }
  }
  setupEventHandlers() {
    if (!this.ws)
      return;
    this.ws.onOpen(() => {
      common_vendor.index.__f__("log", "at ws服务.js:56", "WebSocket: Connection opened");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.authenticate();
      this.emit("connect", { userId: this.userId });
    });
    this.ws.onMessage((message) => {
      try {
        const data = JSON.parse(message.data);
        common_vendor.index.__f__("log", "at ws服务.js:66", "WebSocket: Received message", data);
        if (data.type === "AUTH_SUCCESS") {
          common_vendor.index.__f__("log", "at ws服务.js:69", "WebSocket: Authenticated successfully");
          this.emit("authenticated", { userId: data.userId });
        } else if (data.type === "NOTIFICATION") {
          this.handleNotification(data.data);
        } else if (data.type === "PONG") {
          common_vendor.index.__f__("log", "at ws服务.js:74", "WebSocket: Heartbeat received");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at ws服务.js:77", "WebSocket: Error parsing message", error);
      }
    });
    this.ws.onError((error) => {
      common_vendor.index.__f__("error", "at ws服务.js:82", "WebSocket: Error", error);
      this.emit("error", error);
    });
    this.ws.onClose(() => {
      common_vendor.index.__f__("log", "at ws服务.js:87", "WebSocket: Connection closed");
      this.isConnected = false;
      this.emit("disconnect", {});
      this.handleReconnect();
    });
  }
  authenticate() {
    if (!this.ws || !this.userId)
      return;
    this.send({
      type: "AUTH",
      userId: this.userId
    });
  }
  handleNotification(notification) {
    common_vendor.index.__f__("log", "at ws服务.js:104", "WebSocket: New notification received", notification);
    if (this.notificationHandler) {
      this.notificationHandler(notification);
    }
    this.emit("notification", notification);
    common_vendor.index.showToast({
      title: notification.title,
      icon: "none",
      duration: 3e3
    });
  }
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      common_vendor.index.__f__("log", "at ws服务.js:121", "WebSocket: Max reconnect attempts reached");
      return;
    }
    if (!this.userId) {
      common_vendor.index.__f__("log", "at ws服务.js:126", "WebSocket: No userId, skipping reconnect");
      return;
    }
    this.reconnectAttempts++;
    common_vendor.index.__f__("log", "at ws服务.js:131", `WebSocket: Reconnecting in ${this.reconnectInterval}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, this.reconnectInterval);
  }
  send(data) {
    if (!this.ws || this.ws.readyState !== 0 && this.ws.readyState !== 1) {
      common_vendor.index.__f__("warn", "at ws服务.js:142", "WebSocket: Not connected, cannot send message");
      return false;
    }
    try {
      const message = typeof data === "string" ? data : JSON.stringify(data);
      this.ws.send({
        data: message,
        fail: (err) => {
          common_vendor.index.__f__("error", "at ws服务.js:151", "WebSocket: Send failed", err);
        }
      });
      return true;
    } catch (error) {
      common_vendor.index.__f__("error", "at ws服务.js:156", "WebSocket: Send error", error);
      return false;
    }
  }
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: "PING" });
      }
    }, 3e4);
  }
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  disconnect() {
    this.stopHeartbeat();
    this.userId = null;
    this.reconnectAttempts = this.maxReconnectAttempts;
    if (this.ws) {
      this.ws.close({
        success: () => {
          common_vendor.index.__f__("log", "at ws服务.js:184", "WebSocket: Connection closed manually");
        }
      });
      this.ws = null;
    }
    this.isConnected = false;
  }
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  off(event, callback) {
    if (!this.listeners.has(event))
      return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
  emit(event, data) {
    if (!this.listeners.has(event))
      return;
    const callbacks = this.listeners.get(event);
    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        common_vendor.index.__f__("error", "at ws服务.js:218", `WebSocket: Error in ${event} listener`, error);
      }
    });
  }
}
const wsService = new WebSocketService();
exports.wsService = wsService;
//# sourceMappingURL=../.sourcemap/mp-weixin/ws服务.js.map
