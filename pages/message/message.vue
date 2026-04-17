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
      <view v-if="privateMessages.length === 0" class="empty-state">
        <text class="empty-text">暂无私信</text>
      </view>
      <view v-else class="message-item" v-for="(message, index) in privateMessages" :key="index" @click="goToChat(message.id)">
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
      <view v-if="systemNotifications.length === 0" class="empty-state">
        <text class="empty-text">暂无通知</text>
      </view>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 激活的标签
const activeTab = ref('private');

// 模拟私信数据
const privateMessages = ref([
  {
    id: 1,
    name: '李明华 (AI Lab)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0KAcwGbxp7qLD7ncmDLQhVaSzAmlfwYwprJh2mk4dotcs7fUNcbJSKgxsuJbHh17SxPsZdXprCVjg7xowqdR9m_aKtV_5B5ld9-MScfU9gTkAwJ2qz6eIjWPhKNKVxBxxnMTKu3pB8OSosYMrrhCiZnl_thkEaa-lPB7KCYkBabs7_hWMOc7mMi0wyQpL5uH6EKEACIlSjw2V_3Y1s1ob-kXwexpLuKPzzLHv1CB7DIyzOuwfZOC4QiafYcpuiAI1UpNF4Cr9RVs',
    preview: '关于这次的数学建模比赛，我想请教一下关于算法优化的部分...',
    time: '14:20',
    unread: 3
  },
  {
    id: 2,
    name: 'Sarah Zhang',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgn616qrqIQu_QRYcw2uzUWYBJcR-XheCAZGTEISq5T3PtDR6daDfeEbbqWoI2Vr_AqKdnXYTm5vMFx9P-hHD-Vc_0fElkm1gyhFfGmi8_ctvcfpLUy-EJqEQjBA-MgzaVO4RpD0zq1VqPK0IEzIQhZtBf7ksTsV9NzfIVqGqwigYNDh-nQlC1TW_QrOjecUi0p0O8qXhti1BvbmvLbVSzCCYpR8zVr74RKsg4F6LDAlenMZHCa5ISbEqCyCjf_RA-xUH336JAS4k',
    preview: 'Great progress on the UI design! Let\'s sync tomorrow at the hub.',
    time: '11:05'
  },
  {
    id: 3,
    name: '陈教授',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEca5vDCgdHjuz7DJGYhyzDAR7r9ovibbthmVmnhGglmpEudEZaFB4j2vRq8SUUItB2uL1YmRm4HYuyVSq9b-2pzfp4R07lbyqDzAe6bjHroqSBy1Tywo_Tv_Fceiv-ZV218v3UO5KHb-zKq56cKVz07PoqVKsk2-4drAyLfO44xbMQwYwWsqtwo30TcYADvkfj0HCjhGKEHmHakbJZCNGtb5uGkjm8MkcTjI9GP1ufQd9RuB0uQPffHtUmymsTBSBdpyRohB_kfw',
    preview: '你的论文初稿已经看过了，有一些细节需要我们当面讨论一下。',
    time: '昨天'
  },
  {
    id: 4,
    name: '创新大赛交流群',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8mFUYNFqLwJPauGgBN1tp1rWcJcyNKcKPlK20hQ2PFv_grSeC1ag_Q_lf1OgvLV1-SflOgmNg5GvDkNphgvNUpFBOQhAPIFome91pGcPzeBhJ0oni4xviBzcVEn_xr5YWDsXNsiy9fg8Zqk4rMBkkuyG5z4XbZZv_y09BKSuxvYISp1UegrClTF7SF1Bjfk5sk2OAwLV6-Ot7f-_mhGqjl26CRoxM5mQXuS4_6NLzw1GnZAHudWj96Pa6rsq9H8wltA7UwHWqhho',
    preview: '<span class="text-primary font-semibold">王小二:</span> 刚才发布的通知大家都看到了吗？',
    time: '周三'
  }
]);

// 模拟系统通知数据
const systemNotifications = ref([
  {
    id: 1,
    title: '竞赛提醒',
    content: '全国大学生互联网+创新创业大赛报名截止时间为2026年5月10日，请尽快完成报名',
    time: '2026-04-17 09:00',
    type: 'reminder'
  },
  {
    id: 2,
    title: '审核结果',
    content: '您的身份认证已通过，现在可以发布招募信息了',
    time: '2026-04-16 14:30',
    type: 'approval'
  },
  {
    id: 3,
    title: '竞赛提醒',
    content: '全国大学生数学建模竞赛开始报名了，截止时间为2026年6月30日',
    time: '2026-04-15 10:00',
    type: 'reminder'
  }
]);

// 跳转到聊天页面
const goToChat = (id) => {
  router.push({ path: '/pages/chat/chat', query: { id } });
};

// 跳转到组队申请
const goToInvites = () => {
  console.log('点击组队申请');
};

// 全部标为已读
const markAsRead = () => {
  console.log('全部标为已读');
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