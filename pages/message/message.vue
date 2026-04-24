<template>
  <view class="message-container">
    <!-- 顶部标题区 -->
    <view class="header-section">
      <text class="main-title">消息中心</text>
      <text class="sub-title">Stay updated with your campus network</text>
    </view>

    <!-- 功能区：组队申请卡片 -->
    <view class="invite-card" @click="goToInvites">
      <view class="invite-icon">
        <text class="icon">👥</text>
      </view>
      <view class="invite-content">
        <text class="invite-title">组队申请</text>
        <text class="invite-desc">管理你的组队邀请</text>
      </view>
      <text class="invite-arrow">›</text>
    </view>

    <!-- 顶部标签切换 -->
    <view class="tab-bar">
      <view class="tab-item" :class="{ active: activeTab === 'private' }" @click="activeTab = 'private'">
        <text class="tab-text">私信</text>
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'system' }" @click="activeTab = 'system'">
        <text class="tab-text">系统通知</text>
      </view>
    </view>

    <!-- 私信列表 -->
    <view v-if="activeTab === 'private'" class="message-list">
      <!-- 加载状态 -->
      <view v-if="loading.chats" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>
      <!-- 错误状态 -->
      <view v-else-if="error.chats" class="error-state">
        <text class="error-text">{{ error.chats }}</text>
        <view class="retry-btn" @click="fetchPrivateMessages">重试</view>
      </view>
      <!-- 空状态 -->
      <view v-else-if="privateMessages.length === 0" class="empty-state">
        <text class="empty-text">暂无私信</text>
      </view>
      <!-- 私信列表 -->
      <view v-else class="message-item" v-for="(message, index) in privateMessages" :key="index" @click="goToChat(message.id, message.otherUserId, message.name, message.avatar)">
        <view class="avatar-container">
          <image :src="message.avatar" mode="aspectFill" class="avatar" />
        </view>
        <view class="message-content">
          <view class="message-header">
            <text class="message-name">{{ message.name }}</text>
            <text class="message-time">{{ message.time }}</text>
          </view>
          <text class="message-preview">{{ message.preview }}</text>
        </view>
        <view v-if="message.unread" class="unread-badge">
          <text class="unread-count">{{ message.unread }}</text>
        </view>
      </view>
    </view>

    <!-- 系统通知 -->
    <view v-else class="system-section">
      <view class="system-header-bar">
        <text class="system-section-title">系统通知</text>
        <text class="mark-read-btn" @click="markAsRead">全部标为已读</text>
      </view>
      <!-- 加载状态 -->
      <view v-if="loading.notifications" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>
      <!-- 错误状态 -->
      <view v-else-if="error.notifications" class="error-state">
        <text class="error-text">{{ error.notifications }}</text>
        <view class="retry-btn" @click="fetchSystemNotifications">重试</view>
      </view>
      <!-- 空状态 -->
      <view v-else-if="systemNotifications.length === 0" class="empty-state">
        <text class="empty-text">暂无通知</text>
      </view>
      <!-- 通知列表 -->
      <view v-else class="system-list">
        <view class="system-item" v-for="(notification, index) in systemNotifications" :key="index">
          <view class="system-icon">
            <text v-if="notification.type === 'reminder'" class="icon">📢</text>
            <text v-else-if="notification.type === 'approval'" class="icon">✅</text>
            <text v-else class="icon">📥</text>
          </view>
          <view class="system-content-wrapper">
            <view class="system-header">
              <text class="system-title">{{ notification.title }}</text>
              <text class="system-time">{{ notification.time }}</text>
            </view>
            <text class="system-content">{{ notification.content }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';

// 激活的标签
const activeTab = ref('private');
// 私信数据
const privateMessages = ref([]);
// 系统通知数据
const systemNotifications = ref([]);
// 加载状态
const loading = ref({
  chats: false,
  notifications: false
});
// 错误信息
const error = ref({
  chats: '',
  notifications: ''
});

// 检查登录状态并获取数据
onLoad(async () => {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    });
    return;
  }
  
  // 获取私信列表和系统通知
  await fetchPrivateMessages();
  await fetchSystemNotifications();
});

// 页面显示时重新获取数据
onShow(async () => {
  const token = uni.getStorageSync('token');
  if (token) {
    await fetchPrivateMessages();
    await fetchSystemNotifications();
  }
});

// 监听标签切换，切换时获取对应数据
watch(activeTab, async (newTab) => {
  if (newTab === 'private' && privateMessages.value.length === 0) {
    await fetchPrivateMessages();
  } else if (newTab === 'system' && systemNotifications.value.length === 0) {
    await fetchSystemNotifications();
  }
});

// 获取私信列表
const fetchPrivateMessages = async () => {
  try {
    loading.value.chats = true;
    error.value.chats = '';
    
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: 'http://localhost:3000/api/messages/chats',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      const chatsData = response.data.data || response.data || [];
      privateMessages.value = chatsData.map(chat => {
        const otherUser = chat.otherUser || {};
        return {
          id: chat.id,
          name: otherUser.name || '未知用户',
          avatar: otherUser.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square',
          preview: chat.lastMessage || '暂无消息',
          time: formatTime(chat.updated_at),
          unread: chat.unreadCount || 0,
          otherUserId: otherUser.id
        };
      });
    } else {
      error.value.chats = '获取私信列表失败';
      privateMessages.value = [];
    }
  } catch (err) {
    console.error('获取私信列表错误:', err);
    error.value.chats = '网络错误，请稍后重试';
    // 使用默认数据
    privateMessages.value = [];
  } finally {
    loading.value.chats = false;
  }
};

// 获取系统通知
const fetchSystemNotifications = async () => {
  try {
    loading.value.notifications = true;
    error.value.notifications = '';
    
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: 'http://localhost:3000/api/notifications',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      systemNotifications.value = response.data.data.map(notification => ({
        id: notification.id,
        title: notification.title || '系统通知',
        content: notification.content || '',
        time: formatTime(notification.created_at),
        type: notification.type || 'reminder'
      }));
    } else {
      error.value.notifications = '获取系统通知失败';
      // 使用默认数据
      systemNotifications.value = [];
    }
  } catch (err) {
    console.error('获取系统通知错误:', err);
    error.value.notifications = '网络错误，请稍后重试';
    // 使用默认数据
    systemNotifications.value = [];
  } finally {
    loading.value.notifications = false;
  }
};

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const date = new Date(timeString);
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // 今天
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // 昨天
    return '昨天';
  } else if (diffDays < 7) {
    // 一周内
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  } else {
    // 超过一周
    return date.toLocaleDateString('zh-CN');
  }
};

// 跳转到聊天页面
const goToChat = (chatId, otherUserId, name, avatar) => {
  const currentUser = uni.getStorageSync('userInfo');
  const currentUserId = currentUser?.id;

  if (otherUserId === currentUserId) {
    uni.showToast({
      title: '不能与自己聊天',
      icon: 'none'
    });
    return;
  }

  uni.navigateTo({
    url: `/pages/chat/chat?chatId=${chatId}&otherUserId=${otherUserId}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar || '')}`
  });
};

// 跳转到组队申请
const goToInvites = () => {
  uni.navigateTo({
    url: '/pages/invites/invites'
  });
};

// 全部标为已读
const markAsRead = async () => {
  try {
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: 'http://localhost:3000/api/notifications/read_all',
      method: 'PUT',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      uni.showToast({
        title: '已全部标记为已读',
        icon: 'success'
      });
      // 重新获取通知列表
      await fetchSystemNotifications();
    } else {
      uni.showToast({
        title: '标记失败，请稍后重试',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('标记通知已读错误:', err);
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
  }
};
</script>

<style scoped>
.message-container {
  padding-bottom: 60px;
  background-color: #f7f8fa;
  font-family: 'PingFang SC', sans-serif;
}

.header-section {
  padding: 15px;
  margin-bottom: 10px;
}

.main-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.sub-title {
  font-size: 12px;
  color: #999;
  display: block;
}

.invite-card {
  display: flex;
  align-items: center;
  padding: 15px;
  margin: 0 10px 10px;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
}

.invite-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: rgba(74, 144, 226, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.icon {
  font-size: 20px;
}

.invite-content {
  flex: 1;
}

.invite-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 3px;
}

.invite-desc {
  font-size: 12px;
  color: #999;
}

.invite-arrow {
  font-size: 20px;
  color: #999;
}

.tab-bar {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 10px;
}

.tab-item {
  flex: 1;
  padding: 15px;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.tab-item.active {
  color: #4A90E2;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background-color: #4A90E2;
}

.tab-text {
  font-size: 16px;
}

.message-list {
  padding: 10px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  color: #999;
}

.empty-text {
  font-size: 14px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  color: #4A90E2;
}

.loading-text {
  font-size: 14px;
}

.error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  color: #ff4d4f;
}

.error-text {
  font-size: 14px;
  margin-bottom: 10px;
}

.retry-btn {
  padding: 6px 12px;
  background-color: #4A90E2;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.retry-btn:hover {
  background-color: #357abd;
}

.message-item {
  display: flex;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
}

.avatar-container {
  position: relative;
  margin-right: 15px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.message-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 10px;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-preview {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 100%;
}

.unread-badge {
  width: 20px;
  height: 20px;
  background-color: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
}

.unread-count {
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.system-section {
  padding: 10px;
}

.system-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.system-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.mark-read-btn {
  font-size: 12px;
  color: #4A90E2;
  cursor: pointer;
}

.system-list {
  padding: 0;
}

.system-item {
  display: flex;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 10px;
}

.system-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: rgba(74, 144, 226, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.system-content-wrapper {
  flex: 1;
}

.system-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.system-title {
  font-size: 16px;
  font-weight: bold;
  color: #4A90E2;
  flex: 1;
  margin-right: 10px;
}

.system-time {
  font-size: 12px;
  color: #999;
}

.system-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.text-primary {
  color: #4A90E2;
  font-weight: bold;
}
</style>