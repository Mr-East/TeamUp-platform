<template>
  <view class="chat-container">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <view class="nav-left" @click="goBack">
        <text class="back-btn">←</text>
        <view class="chat-user-info">
          <text class="chat-name">{{ chatName }}</text>
          <view class="online-status" v-if="isOnline">
            <view class="status-dot"></view>
            <text class="status-text">在线</text>
          </view>
          <view class="online-status offline" v-else>
            <text class="status-text">离线</text>
          </view>
        </view>
      </view>
      <text class="more-btn">⋯</text>
    </view>

    <!-- 聊天内容区域 -->
    <scroll-view class="chat-content" scroll-y>
      <view class="message-item" v-for="(message, index) in messages" :key="index" :class="{ 'my-message': message.isMine }">
        <view class="avatar-container">
          <image v-if="!message.isMine" :src="message.avatar" mode="aspectFill" class="avatar" />
        </view>
        <view class="message-content">
          <view class="message-bubble" :class="{ 'my-bubble': message.isMine }">
            <text class="message-text">{{ message.content }}</text>
            <text class="message-time">{{ message.time }}</text>
          </view>
        </view>
        <view class="avatar-container">
          <image v-if="message.isMine" :src="message.avatar" mode="aspectFill" class="avatar" />
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input type="text" placeholder="输入消息..." class="input" v-model="inputText" @confirm="sendMessage" />
      <text class="send-btn" @click="sendMessage">发送</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';

const chatId = ref('');
const chatName = ref('');
const chatAvatar = ref('');
const isOnline = ref(false);
const otherUserId = ref(null);

const myInfo = ref({
  id: null,
  name: '我',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square'
});

const messages = ref([]);
const inputText = ref('');
const loading = ref(false);

const fetchChatMessages = async () => {
  try {
    loading.value = true;
    const token = uni.getStorageSync('token');
    const userInfo = uni.getStorageSync('userInfo');

    if (userInfo) {
      myInfo.value.id = userInfo.id;
      myInfo.value.name = userInfo.name || '我';
      myInfo.value.avatar = userInfo.avatar || myInfo.value.avatar;
    }

    // 只有有 chatId 时才获取聊天消息
    if (chatId.value) {
      const response = await uni.request({
        url: `http://localhost:3000/api/messages/chat/${chatId.value}`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        const msgs = response.data.data || [];
        messages.value = msgs.map(msg => ({
          id: msg.id,
          content: msg.content,
          time: formatTime(msg.created_at),
          isMine: msg.senderId === myInfo.value.id,
          avatar: msg.senderId === myInfo.value.id
            ? (myInfo.value.avatar || myInfo.value.avatar)
            : (msg.sender?.avatar || chatAvatar.value || myInfo.value.avatar),
          senderId: msg.senderId,
          receiverId: msg.receiverId
        }));

        if (msgs.length > 0) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg.senderId === myInfo.value.id) {
            chatAvatar.value = lastMsg.receiver?.avatar || chatAvatar.value;
            chatName.value = lastMsg.receiver?.name || chatName.value;
            otherUserId.value = lastMsg.receiverId;
          } else {
            chatAvatar.value = lastMsg.sender?.avatar || chatAvatar.value;
            chatName.value = lastMsg.sender?.name || chatName.value;
            otherUserId.value = lastMsg.senderId;
          }
        }
      } else {
        uni.showToast({
          title: '获取消息失败',
          icon: 'none'
        });
      }
    }
  } catch (err) {
    console.error('获取聊天消息错误:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

const sendMessage = async () => {
  if (inputText.value.trim() && otherUserId.value) {
    try {
      const token = uni.getStorageSync('token');

      const response = await uni.request({
        url: 'http://localhost:3000/api/messages/send',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          receiverId: otherUserId.value,
          content: inputText.value.trim()
        }
      });

      if (response.data && response.data.success) {
        const newMsg = response.data.data;
        messages.value.push({
          id: newMsg.id,
          content: newMsg.content,
          time: formatTime(newMsg.created_at),
          isMine: true,
          avatar: myInfo.value.avatar,
          senderId: newMsg.senderId,
          receiverId: newMsg.receiverId
        });
        
        // 更新 chatId，确保后续消息使用同一个聊天
        if (newMsg.chatId && !chatId.value) {
          chatId.value = newMsg.chatId;
        }

        inputText.value = '';
      } else {
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('发送消息错误:', err);
      uni.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  } else if (!otherUserId.value) {
    uni.showToast({
      title: '无法发送消息',
      icon: 'none'
    });
  }
};

const formatTime = (timeString) => {
  if (!timeString) return '';

  const date = new Date(timeString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

const goBack = () => {
  uni.navigateBack();
};

onLoad(async (options) => {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    });
    return;
  }

  if (options.chatId) {
    chatId.value = options.chatId;
  }

  if (options.name) {
    chatName.value = options.name;
  }

  if (options.avatar) {
    chatAvatar.value = options.avatar;
  }

  if (options.otherUserId) {
    otherUserId.value = parseInt(options.otherUserId);
  }

  await fetchChatMessages();
});

onShow(async () => {
  if (chatId.value) {
    await fetchChatMessages();
  }
});</script>


<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f9fc;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: #f7f9fc;
  border-bottom: 1px solid #e0e3e6;
}

.nav-left {
  display: flex;
  align-items: center;
}

.back-btn {
  font-size: 20px;
  color: #3F8EF7;
  margin-right: 12px;
}

.chat-user-info {
  display: flex;
  flex-direction: column;
}

.chat-name {
  font-size: 16px;
  font-weight: bold;
  color: #191c1e;
}

.online-status {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #006c52;
  margin-right: 4px;
  box-shadow: 0 0 4px #006c52;
}

.status-text {
  font-size: 10px;
  color: #006c52;
}

.online-status.offline .status-text {
  color: #999;
}

.more-btn {
  font-size: 20px;
  color: #3F8EF7;
}

/* 聊天内容区域 */
.chat-content {
  flex: 1;
  padding: 20px 0px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
  max-width: 100%;
}

.avatar-container {
  width: 64px;
  height: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-shrink: 0;
}

/* 自己消息的头像容器 - 右侧间距 */
.message-item.my-message .avatar-container {
  padding-right: 8px;
}

/* 对方消息的头像容器 - 左侧间距 */
.message-item:not(.my-message) .avatar-container {
  padding-left: 8px;
}

.message-item.my-message {
  flex-direction: row;
}

.message-item.my-message .message-content {
  align-items: flex-end;
}

.message-item:not(.my-message) .message-content {
  align-items: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  max-width: 85%;
  display: flex;
  flex-direction: column;
}

.message-bubble {
  max-width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
  display: inline-block;
}

.message-bubble:not(.my-bubble) {
  background-color: #f2f4f7;
  border-bottom-left-radius: 4px;
}

.message-bubble.my-bubble {
  background-color: #1173db;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble:not(.my-bubble)::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 14px;
  border-width: 4px 8px 4px 0;
  border-style: solid;
  border-color: transparent #f2f4f7 transparent transparent;
}

.message-bubble.my-bubble::before {
  content: '';
  position: absolute;
  right: -8px;
  top: 14px;
  border-width: 4px 0 4px 8px;
  border-style: solid;
  border-color: transparent transparent transparent #1173db;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
}

.message-bubble.my-bubble .message-time {
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

/* 输入区域 */
.input-area {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffffff;
  border-top: 1px solid #f0f0f0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.input {
  flex: 1;
  padding: 10px 16px;
  background-color: #f0f0f0;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 14px;
  margin-right: 12px;
}

.send-btn {
  color: #3F8EF7;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}
</style>