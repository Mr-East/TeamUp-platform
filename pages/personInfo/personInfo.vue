<template>
  <view class="profile-container">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <view class="nav-left">
        <text class="back-btn" @click="goBack">←</text>
        <text class="nav-title">个人主页</text>
      </view>
      <view class="nav-right">
        <text class="nav-icon" @click="shareUser">📤</text>
      </view>
    </view>

    <!-- 个人信息 -->
    <view class="user-info">
      <view class="user-info-content">
        <view class="avatar-container">
          <image :src="userInfo.avatar" mode="aspectFill" class="avatar" />
        </view>
        <view class="info-content">
          <view class="name-row">
            <text class="name">{{ userInfo.name }}</text>
            <view class="verification" v-if="userInfo.verified">
              <text class="verification-icon">✅</text>
              <text class="verification-text">Verified Scholar</text>
            </view>
          </view>
          <text class="college">{{ userInfo.college }}</text>
          <text class="major" v-if="userInfo.major">{{ userInfo.major }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn message-btn" @click="startChat">
          <text class="action-icon">💬</text>
          <text class="action-text">私信</text>
        </view>
        <!-- <view class="action-btn follow-btn" @click="toggleFollow">
          <text class="action-icon">{{ isFollowing ? '✓' : '+' }}</text>
          <text class="action-text">{{ isFollowing ? '已关注' : '关注' }}</text>
        </view> -->
      </view>
    </view>

    <!-- 个人简介 -->
    <view class="bio-section" v-if="userInfo.bio">
      <view class="section-header">
        <text class="section-title">个人简介</text>
      </view>
      <text class="bio-content">{{ userInfo.bio }}</text>
    </view>

    <!-- 技能标签 -->
    <view class="skills-section">
      <view class="section-header">
        <text class="section-title">专业技能 (Expertise & Skills)</text>
      </view>
      <view class="skill-tags">
        <view class="skill-tag" v-for="(skill, index) in userInfo.skills" :key="index">
          <view class="skill-dot" :style="{ backgroundColor: getSkillColor(index) }"></view>
          <text class="skill-text">{{ skill }}</text>
        </view>
        <view v-if="userInfo.skills.length === 0" class="no-skills">
          <text class="no-skills-text">暂无技能信息</text>
        </view>
      </view>
    </view>

    <!-- 项目经历 -->
    <view class="projects-section">
      <view class="section-header">
        <text class="section-title">参与项目</text>
      </view>
      <view class="projects-list">
        <view class="project-item" v-for="(project, index) in userInfo.projects" :key="index">
          <text class="project-title">{{ project.title }}</text>
          <text class="project-role">{{ project.role }}</text>
          <text class="project-description">{{ project.description }}</text>
        </view>
        <view v-if="userInfo.projects.length === 0" class="no-projects">
          <text class="no-projects-text">暂无项目信息</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 用户数据
const userInfo = ref({
  id: '',
  name: '默认用户',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square',
  college: '默认学院',
  major: '',
  bio: '',
  skills: [],
  verified: false,
  projects: []
});

// 关注状态
const isFollowing = ref(false);

// 加载状态
const loading = ref(true);

// 页面加载时获取用户信息
onLoad(async (options) => {
  const userId = options.userId;
  if (userId) {
    await fetchUserInfo(userId);
  }
});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 获取用户信息
const fetchUserInfo = async (userId) => {
  try {
    loading.value = true;
    const token = uni.getStorageSync('token');
    
    const response = await uni.request({
      url: `http://localhost:3000/api/users/${userId}`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      userInfo.value = {
        ...response.data.data,
        skills: response.data.data.skills || [],
        projects: response.data.data.projects || []
      };
    } else {
      uni.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
      // 使用默认数据
      userInfo.value = {
        id: userId,
        name: '用户',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square',
        college: '默认学院',
        major: '',
        bio: '',
        skills: [],
        verified: false,
        projects: []
      };
    }
  } catch (error) {
    console.error('获取用户信息错误:', error);
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
    userInfo.value = {
      id: userId,
      name: '默认用户',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square',
      college: '默认学院',
      major: '',
      bio: '',
      skills: [],
      verified: false,
      projects: []
    };
  } finally {
    loading.value = false;
  }
};

// 获取技能标签颜色
const getSkillColor = (index) => {
  const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];
  return colors[index % colors.length];
};

// 发起私聊
const startChat = async () => {
  if (!userInfo.value.id) {
    uni.showToast({
      title: '用户信息错误',
      icon: 'none'
    });
    return;
  }

  try {
    const token = uni.getStorageSync('token');

    const response = await uni.request({
      url: 'http://localhost:3000/api/messages/chats',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });

    let chatId = null;

    if (response.data && response.data.success) {
      const chats = response.data.data || response.data || [];
      const existingChat = chats.find(chat => {
        return chat.otherUser && chat.otherUser.id === userInfo.value.id;
      });

      if (existingChat) {
        chatId = existingChat.id;
      }
    }

    if (!chatId) {
      uni.showToast({
        title: '请先发送消息建立聊天',
        icon: 'none'
      });
    }

    uni.navigateTo({
      url: `/pages/chat/chat?chatId=${chatId || ''}&otherUserId=${userInfo.value.id}&name=${encodeURIComponent(userInfo.value.name)}&avatar=${encodeURIComponent(userInfo.value.avatar || '')}`
    });
  } catch (err) {
    console.error('发起私聊错误:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
};

// 切换关注状态
const toggleFollow = () => {
  isFollowing.value = !isFollowing.value;
  uni.showToast({
    title: isFollowing.value ? '关注成功' : '取消关注',
    icon: 'success'
  });
};

// 分享用户信息
const shareUser = () => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  });
};
</script>

<style scoped>
.profile-container {
  padding-bottom: 60px;
  background-color: #f7f8fa;
  font-family: 'PingFang SC', sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
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
  color: #333;
}

.nav-right {
  display: flex;
  align-items: center;
}

.nav-icon {
  font-size: 18px;
  color: #717784;
  cursor: pointer;
}

/* 用户信息区 */
.user-info {
  background: linear-gradient(135deg, #4A90E2 0%, #5CA6F8 100%);
  padding: 30px 20px;
  margin-bottom: 15px;
}

.user-info-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
  margin-bottom: 20px;
}

.avatar-container {
  position: relative;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid white;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.name {
  font-size: 20px;
  font-weight: bold;
  margin-right: 10px;
}

.verification {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
}

.verification-icon {
  font-size: 12px;
  margin-right: 5px;
}

.verification-text {
  font-size: 12px;
}

.college {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.major {
  font-size: 12px;
  opacity: 0.8;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.action-icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.action-text {
  font-size: 12px;
  font-weight: bold;
}

.message-btn {
  flex: 1;
  max-width: 120px;
}

.follow-btn {
  flex: 1;
  max-width: 120px;
}

/* 个人简介 */
.bio-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bio-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-top: 10px;
}

/* 技能标签 */
.skills-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
}

.skill-tag {
  display: flex;
  align-items: center;
  background-color: #E8F0FE;
  padding: 6px 12px;
  border-radius: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}

.skill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
}

.skill-text {
  color: #333;
}

.no-skills {
  padding: 20px 0;
  text-align: center;
}

.no-skills-text {
  color: #999;
  font-size: 14px;
}

/* 项目经历 */
.projects-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.projects-list {
  margin-top: 10px;
}

.project-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.project-item:last-child {
  border-bottom: none;
}

.project-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.project-role {
  font-size: 12px;
  color: #4A90E2;
  display: block;
  margin-bottom: 5px;
}

.project-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.no-projects {
  padding: 20px 0;
  text-align: center;
}

.no-projects-text {
  color: #999;
  font-size: 14px;
}
</style>