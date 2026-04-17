<template>
  <view class="detail-container">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <view class="nav-left">
        <text class="back-btn" @click="goBack">←</text>
        <text class="nav-title">项目详情</text>
      </view>
      <view class="nav-right">
        <text class="nav-icon">🔗</text>
        <text class="nav-icon">⋯</text>
      </view>
    </view>

    <!-- 英雄区域 -->
    <view class="hero-section">
      <view class="hero-content">
        <view class="hero-header">
          <view class="status-badge">
            <view class="status-dot"></view>
            <text class="status-text">Recruiting Now</text>
          </view>
          <text class="hero-title">{{ recruitment.title }}</text>
        </view>
        <image :src="recruitment.logo" mode="aspectFit" class="competition-logo" />
      </view>

      <!-- 发布者信息 -->
      <view class="publisher-info">
        <image :src="recruitment.publisherAvatar" mode="aspectFill" class="publisher-avatar" />
        <view class="publisher-details">
          <text class="publisher-name">{{ recruitment.publisher }}</text>
          <text class="publisher-college">{{ recruitment.college }} · 大三</text>
        </view>
        <view class="follow-btn">
          <text class="follow-text">Follow</text>
        </view>
      </view>
    </view>

    <!-- 项目详情 -->
    <view class="details-section">
      <view class="details-grid">
        <view class="detail-card primary">
          <text class="detail-icon">👥</text>
          <text class="detail-label">招募名额</text>
          <text class="detail-value">{{ recruitment.joined }}<text class="detail-subtext"> / {{ recruitment.total }}</text></text>
        </view>
        <view class="detail-card">
          <text class="detail-icon">📅</text>
          <text class="detail-label">截止日期</text>
          <text class="detail-value">{{ recruitment.deadline }}</text>
        </view>
      </view>
    </view>

    <!-- 已加入成员 -->
    <view class="members-section">
      <view class="section-header">
        <text class="section-title">已加入成员</text>
        <text class="section-subtitle">{{ recruitment.joined }}/{{ recruitment.total }} Confirmed</text>
      </view>
      <view class="members-list">
        <image :src="member.avatar" mode="aspectFill" class="member-avatar" v-for="(member, index) in recruitment.members" :key="index" />
        <view class="member-placeholder" v-if="recruitment.total > recruitment.joined">
          <text class="placeholder-text">+{{ recruitment.total - recruitment.joined }}</text>
        </view>
      </view>
    </view>

    <!-- 项目简介 -->
    <view class="section">
      <text class="section-title">项目简介</text>
      <text class="section-content">{{ recruitment.description }}</text>
    </view>

    <!-- 所需技能 -->
    <view class="section">
      <text class="section-title">所需技能</text>
      <view class="skill-tags">
        <view class="skill-tag" v-for="(skill, index) in recruitment.skills" :key="index">{{ skill }}</view>
      </view>
    </view>

    <!-- 讨论区 -->
    <view class="section">
      <text class="section-title">讨论区 ({{ recruitment.comments.length }})</text>
      <view class="comment-item" v-for="(comment, index) in recruitment.comments" :key="index">
        <image :src="comment.avatar" mode="aspectFill" class="comment-avatar" />
        <view class="comment-content">
          <view class="comment-header">
            <text class="comment-name">{{ comment.name }}</text>
            <text class="comment-time">{{ comment.time }}</text>
          </view>
          <text class="comment-text">{{ comment.content }}</text>
          <view class="comment-actions">
            <text class="action-item">👍 {{ comment.likes }}</text>
            <text class="action-item">💬 回复</text>
          </view>
          <!-- 回复 -->
          <view class="reply-item" v-if="comment.replies && comment.replies.length > 0">
            <image :src="recruitment.publisherAvatar" mode="aspectFill" class="reply-avatar" />
            <view class="reply-content">
              <text class="reply-name">{{ recruitment.publisher }} <text class="reply-to">回复</text> {{ comment.name }}</text>
              <text class="reply-text">{{ comment.replies[0].content }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-btn" @click="toggleFavorite">
        <text class="action-icon">❤️</text>
        <text class="action-text">收藏</text>
      </view>
      <view class="action-btn" @click="showComment">
        <text class="action-icon">💬</text>
        <text class="action-text">评论</text>
      </view>
      <view class="action-btn" @click="sendMessage">
        <text class="action-icon">✉️</text>
        <text class="action-text">私信</text>
      </view>
      <view class="join-btn" @click="joinTeam">
        <text class="join-text">我要加入</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const recruitmentId = ref('');
const recruitment = ref({
  id: 1,
  title: 'AI 驱动的校园二手交易平台 - 算法优化项目',
  logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square',
  publisher: 'Alex Zhang',
  publisherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
  college: '计算机科学与技术学院',
  description: '我们正在开发一个AI驱动的校园二手交易平台，通过机器学习算法实现智能推荐和价格预测。项目已经获得校级立项，现需要前端开发和算法优化的同学加入。我们的目标是参加互联网+大赛，希望有相关经验的同学一起合作。',
  skills: ['Vue', 'React', 'JavaScript', 'Python', '机器学习'],
  joined: 2,
  total: 4,
  deadline: '2026-05-10',
  members: [
    { name: 'Alex Zhang', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square' },
    { name: 'Lisa Wang', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square' }
  ],
  comments: [
    {
      name: 'Li Wei',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square',
      content: '大三小白可以申请吗？我熟悉 Python 但是没有做过推荐算法相关的项目。',
      time: '2h ago',
      likes: 14,
      replies: [
        {
          content: '可以的，只要有学习热情就行，我们可以一起讨论。'
        }
      ]
    },
    {
      name: 'Wang Tao',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
      content: '我对这个项目很感兴趣，有前端开发经验，希望能加入',
      time: '5h ago',
      likes: 8,
      replies: []
    }
  ]
});

// 操作方法
const goBack = () => {
  uni.navigateBack();
};

const toggleFavorite = () => {
  console.log('切换收藏状态');
};

const showComment = () => {
  console.log('显示评论输入框');
};

const sendMessage = () => {
  console.log('发送私信');
};

const joinTeam = () => {
  console.log('加入团队');
};

// 页面加载时获取数据
onLoad((options) => {
  if (options.data) {
    try {
      const decodedData = decodeURIComponent(options.data);
      const data = JSON.parse(decodedData);
      recruitment.value = data;
      recruitmentId.value = data.id;
    } catch (e) {
      console.error('解析项目数据失败', e);
    }
  }
  console.log('获取招募详情数据', recruitmentId.value);
});
</script>

<style scoped>
.detail-container {
  background-color: #f7f9fc;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
}

.back-btn {
  font-size: 20px;
  color: #717784;
  margin-right: 15px;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #4A90E2;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-icon {
  font-size: 18px;
  color: #717784;
}

/* 英雄区域 */
.hero-section {
  background-color: white;
  border-radius: 12px;
  margin: 20px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  background-color: rgba(0, 91, 178, 0.05);
  border-bottom-left-radius: 100px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.hero-header {
  flex: 1;
  margin-right: 20px;
}

.status-badge {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #006c52;
  margin-right: 8px;
  box-shadow: 0 0 4px #006c52;
}

.status-text {
  font-size: 10px;
  font-weight: bold;
  color: #006c52;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-title {
  font-size: 20px;
  font-weight: bold;
  color: #191c1e;
  line-height: 1.3;
}

.competition-logo {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 发布者信息 */
.publisher-info {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f2f4f7;
  border-radius: 8px;
}

.publisher-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  border: 2px solid white;
}

.publisher-details {
  flex: 1;
}

.publisher-name {
  font-size: 14px;
  font-weight: bold;
  color: #191c1e;
  display: block;
  margin-bottom: 2px;
}

.publisher-college {
  font-size: 11px;
  color: #717784;
}

.follow-btn {
  padding: 6px 12px;
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 20px;
  background-color: white;
}

.follow-text {
  font-size: 12px;
  font-weight: bold;
  color: #4A90E2;
}

/* 详情部分 */
.details-section {
  padding: 0 20px;
  margin-bottom: 20px;
}

.details-grid {
  display: flex;
  gap: 16px;
}

.detail-card {
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #e6e8eb;
}

.detail-card.primary {
  background: linear-gradient(135deg, #005bb2 0%, #1173db 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(0, 91, 178, 0.2);
}

.detail-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.detail-label {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
  opacity: 0.8;
}

.detail-value {
  font-size: 20px;
  font-weight: bold;
}

.detail-subtext {
  font-size: 12px;
  font-weight: normal;
  opacity: 0.7;
}

/* 成员部分 */
.members-section {
  background-color: white;
  border-radius: 12px;
  margin: 0 20px 20px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #717784;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-subtitle {
  font-size: 10px;
  font-weight: bold;
  color: #4A90E2;
}

.members-list {
  display: flex;
  align-items: center;
  gap: -12px;
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid white;
  margin-right: -12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.member-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid white;
  background-color: #f2f4f7;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.placeholder-text {
  font-size: 12px;
  font-weight: bold;
  color: #717784;
}

/* 通用部分 */
.section {
  background-color: white;
  border-radius: 12px;
  margin: 0 20px 20px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-top: 12px;
}

/* 技能标签 */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
  gap: 8px;
}

.skill-tag {
  font-size: 12px;
  background-color: #E8F0FE;
  color: #4A90E2;
  padding: 4px 12px;
  border-radius: 15px;
}

/* 评论区 */
.comment-item {
  display: flex;
  margin-top: 16px;
  gap: 12px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-name {
  font-size: 12px;
  font-weight: bold;
  color: #191c1e;
}

.comment-time {
  font-size: 10px;
  color: #717784;
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-item {
  font-size: 10px;
  font-weight: bold;
  color: #717784;
}

/* 回复 */
.reply-item {
  margin-left: 44px;
  margin-top: 12px;
  padding-left: 12px;
  border-left: 2px solid #f2f4f7;
  display: flex;
  gap: 8px;
}

.reply-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.reply-content {
  flex: 1;
}

.reply-name {
  font-size: 11px;
  font-weight: bold;
  color: #191c1e;
  display: block;
  margin-bottom: 2px;
}

.reply-to {
  font-weight: normal;
  color: #717784;
  margin: 0 4px;
}

.reply-text {
  font-size: 12px;
  color: #333;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  display: flex;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -4px 24px rgba(0, 91, 178, 0.08);
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.action-text {
  font-size: 10px;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.join-btn {
  background: linear-gradient(135deg, #005bb2 0%, #1173db 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 91, 178, 0.3);
}

.join-text {
  color: white;
}
</style>