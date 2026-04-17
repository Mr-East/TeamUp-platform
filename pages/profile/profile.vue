<template>
  <view class="profile-container">
   

    <!-- 个人信息 -->
    <view class="user-info">
      <view class="user-info-content">
        <view class="avatar-container">
          <image :src="userInfo.avatar" mode="aspectFill" class="avatar" />
          <view class="edit-avatar-btn">
            <text class="edit-icon">✏️</text>
          </view>
        </view>
        <view class="info-content">
          <view class="name-row">
            <text class="name">{{ userInfo.name }}</text>
            <view class="verification">
              <text class="verification-icon">✅</text>
              <text class="verification-text">Verified Scholar</text>
            </view>
          </view>
          <text class="college">{{ userInfo.college }}</text>
        </view>
      </view>
    </view>

    <!-- 技能标签 -->
    <view class="skills-section">
      <view class="section-header">
        <text class="section-title">专业技能 (Expertise & Skills)</text>
        <text class="edit-btn" @click="editSkills">✏️</text>
      </view>
      <view class="skill-tags">
        <view class="skill-tag" v-for="(skill, index) in userInfo.skills" :key="index">
          <view class="skill-dot" :style="{ backgroundColor: getSkillColor(index) }"></view>
          <text class="skill-text">{{ skill }}</text>
        </view>
        <view class="add-skill-btn" @click="addSkill">
          <text class="add-icon">+</text>
          <text class="add-text">Add</text>
        </view>
      </view>
    </view>

    <!-- 偏好与安全设置 -->
    <view class="settings-section">
      <view class="section-header">
        <text class="section-title">偏好与安全设置</text>
      </view>
      <view class="settings-list">
        <!-- <view class="setting-item" @click="goToAuth">
          <view class="setting-left">
            <text class="setting-icon">🔒</text>
            <text class="setting-label">身份认证</text>
          </view>
          <text class="setting-status">已启用</text>
        </view> -->
        <view class="setting-item" @click="goToPrivacy">
          <view class="setting-left">
            <text class="setting-icon">👤</text>
            <text class="setting-label">个人信息编辑</text>
          </view>
          <text class="setting-status">></text>
        </view>
        <view class="setting-item" @click="toggleNotification">
          <view class="setting-left">
            <text class="setting-icon">🔔</text>
            <text class="setting-label">推送通知</text>
          </view>
          <view class="toggle-switch">
            <view class="toggle-slider" :class="{ active: userInfo.notification }" @click="userInfo.notification = !userInfo.notification"></view>
          </view>
        </view>
        <view class="setting-item logout" @click="logout">
          <view class="setting-left">
            <text class="setting-icon">🚪</text>
            <text class="setting-label">退出登录</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 模拟用户数据
const userInfo = ref({
  name: '张三',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
  college: '计算机学院',
  skills: ['Vue', 'JavaScript', 'Java', 'Python'],
  notification: true
});

// 编辑个人资料
const editProfile = () => {
  console.log('编辑个人资料');
};

// 编辑技能
const editSkills = () => {
  console.log('编辑技能');
};

// 添加技能
const addSkill = () => {
  console.log('添加技能');
};

// 获取技能标签颜色
const getSkillColor = (index) => {
  const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B'];
  return colors[index % colors.length];
};

// 跳转到身份认证
const goToAuth = () => {
  console.log('跳转到身份认证');
};

// 跳转到编辑信息页面
const goToPrivacy = () => {
  console.log('跳转到编辑信息页面');
  uni.navigateTo({
    url: '/pages/profile/edit-profile'
  });
};

// 切换通知
const toggleNotification = () => {
  console.log('切换通知状态', userInfo.value.notification);
};

// 退出登录
const logout = () => {
  console.log('退出登录');
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

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.edit-btn {
  font-size: 18px;
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

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.edit-icon {
  font-size: 12px;
  color: #4A90E2;
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

.add-skill-btn {
  display: flex;
  align-items: center;
  border: 1px dashed #4A90E2;
  padding: 6px 12px;
  border-radius: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #4A90E2;
  cursor: pointer;
}

.add-icon {
  margin-right: 5px;
}

/* 设置模块 */
.settings-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-list {
  margin-top: 10px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-left {
  display: flex;
  align-items: center;
}

.setting-icon {
  font-size: 18px;
  margin-right: 15px;
  color: #4A90E2;
}

.setting-label {
  font-size: 14px;
  color: #333;
}

.setting-status {
  font-size: 14px;
  color: #999;
}

.toggle-switch {
  width: 50px;
  height: 24px;
  background-color: #f0f0f0;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
}

.toggle-slider {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s;
}

.toggle-slider.active {
  left: 28px;
  background-color: white;
}

.toggle-switch.active {
  background-color: #4A90E2;
}

.setting-item.logout {
  color: #ff4d4f;
  border-bottom: none;
}

.setting-item.logout .setting-label {
  color: #ff4d4f;
}
</style>