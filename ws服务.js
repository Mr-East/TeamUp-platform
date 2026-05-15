class WebSocketService {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.isConnected = false;
    this.reconnectInterval = 3000;
    this.maxReconnectAttempts = 5;
    this.reconnectAttempts = 0;
    this.listeners = new Map();
    this.notificationHandler = null;
  }

  setNotificationHandler(handler) {
    this.notificationHandler = handler;
  }

  connect(userId) {
    if (!userId) {
      console.warn('WebSocket: No userId provided, skipping connection');
      return;
    }

    this.userId = userId;

    if (this.ws && this.ws.readyState === 1) {
      this.authenticate();
      return;
    }

    try {
      const wsUrl = `ws://localhost:3000/ws`;
      console.log('WebSocket: Connecting to', wsUrl);

      this.ws = uni.connectSocket({
        url: wsUrl,
        success: () => {
          console.log('WebSocket: Connection initiated');
        },
        fail: (err) => {
          console.error('WebSocket: Connection failed', err);
          this.handleReconnect();
        }
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket: Connection error', error);
      this.handleReconnect();
    }
  }

  setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onOpen(() => {
      console.log('WebSocket: Connection opened');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.authenticate();
      this.emit('connect', { userId: this.userId });
    });

    this.ws.onMessage((message) => {
      try {
        const data = JSON.parse(message.data);
        console.log('WebSocket: Received message', data);

        if (data.type === 'AUTH_SUCCESS') {
          console.log('WebSocket: Authenticated successfully');
          this.emit('authenticated', { userId: data.userId });
        } else if (data.type === 'NOTIFICATION') {
          this.handleNotification(data.data);
        } else if (data.type === 'PONG') {
          console.log('WebSocket: Heartbeat received');
        }
      } catch (error) {
        console.error('WebSocket: Error parsing message', error);
      }
    });

    this.ws.onError((error) => {
      console.error('WebSocket: Error', error);
      this.emit('error', error);
    });

    this.ws.onClose(() => {
      console.log('WebSocket: Connection closed');
      this.isConnected = false;
      this.emit('disconnect', {});
      this.handleReconnect();
    });
  }

  authenticate() {
    if (!this.ws || !this.userId) return;

    this.send({
      type: 'AUTH',
      userId: this.userId
    });
  }

  handleNotification(notification) {
    console.log('WebSocket: New notification received', notification);

    if (this.notificationHandler) {
      this.notificationHandler(notification);
    }

    this.emit('notification', notification);

    uni.showToast({
      title: notification.title,
      icon: 'none',
      duration: 3000
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('WebSocket: Max reconnect attempts reached');
      return;
    }

    if (!this.userId) {
      console.log('WebSocket: No userId, skipping reconnect');
      return;
    }

    this.reconnectAttempts++;
    console.log(`WebSocket: Reconnecting in ${this.reconnectInterval}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, this.reconnectInterval);
  }

  send(data) {
    if (!this.ws || this.ws.readyState !== 0 && this.ws.readyState !== 1) {
      console.warn('WebSocket: Not connected, cannot send message');
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send({
        data: message,
        fail: (err) => {
          console.error('WebSocket: Send failed', err);
        }
      });
      return true;
    } catch (error) {
      console.error('WebSocket: Send error', error);
      return false;
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'PING' });
      }
    }, 30000);
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
          console.log('WebSocket: Connection closed manually');
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
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`WebSocket: Error in ${event} listener`, error);
      }
    });
  }
}

const wsService = new WebSocketService();

export default wsService;
