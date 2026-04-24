<template>
  <view class="edit-profile-container">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <text class="back-btn" @click="goBack">×</text>
      <text class="nav-title">编辑信息</text>
      <text class="save-btn" @click="saveProfile">保存</text>
    </view>

    <!-- 头像编辑区域 -->
    <view class="avatar-section">
      <view class="avatar-container">
        <image :src="profileForm.avatar" mode="aspectFill" class="avatar" />
        <view class="change-avatar-btn" @click="changeAvatar">
          <text class="camera-icon">📷</text>
          <text class="change-text">更换</text>
        </view>
        <view class="edit-avatar-btn">
          <text class="edit-icon">✏️</text>
        </view>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-container">
      <!-- 基本信息组 -->
      <view class="form-group">
        <!-- 姓名字段 -->
        <view class="form-item">
          <text class="field-icon">👤</text>
          <view class="field-content">
            <text class="field-label">姓名</text>
            <input type="text" v-model="profileForm.name" class="field-input" placeholder="请输入您的姓名" />
          </view>
        </view>
        <view class="divider"></view>
        <!-- 学院选择 -->
        <view class="form-item" @click="selectSchool">
          <text class="field-icon">🏫</text>
          <view class="field-content">
            <text class="field-label">学院</text>
            <text class="field-value">{{ profileForm.college }}</text>
          </view>
          <text class="chevron-icon">›</text>
        </view>
        <view class="divider"></view>
        <!-- 专业字段 -->
        <view class="form-item">
          <text class="field-icon">📚</text>
          <view class="field-content">
            <text class="field-label">专业</text>
            <input type="text" v-model="profileForm.major" class="field-input" placeholder="请输入您的专业" />
          </view>
        </view>
      </view>

      <!-- 技能标签区域 -->
      <view class="skills-section">
        <view class="section-header">
          <text class="section-title">专业技能</text>
          <view class="add-tag-btn" @click="addSkillTag">
            <text class="add-icon">+</text>
            <text class="add-tag-text">添加标签</text>
          </view>
        </view>
        <view class="skills-container">
          <view class="skill-tag" v-for="(skill, index) in profileForm.skills" :key="index">
            <text class="skill-text">{{ skill }}</text>
            <text class="remove-skill" @click="removeSkill(index)">×</text>
          </view>
          <view class="add-more-skills" @click="findSkills">
            <text class="add-more-icon">+</text>
            <text class="add-more-text">查找新技能标签</text>
          </view>
        </view>
      </view>

      <!-- 个人简介区域 -->
      <view class="bio-section">
        <text class="section-title">个人简介</text>
        <textarea v-model="profileForm.bio" class="bio-textarea" placeholder="告诉潜在的队友关于你的比赛经验和你能带来什么..."></textarea>
      </view>
    </view>

    <!-- 成功提示 -->
    <view class="success-toast" v-if="showSuccess">
      <text class="success-icon">✅</text>
      <text class="success-text">个人资料更新成功</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 表单数据
const profileForm = ref({
  name: '默认用户',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square',
  college: '默认学院',
  major: '默认专业',
  skills: [],
  bio: ''
});

const showSuccess = ref(false);
const loading = ref(true);

// 生命周期
onMounted(async () => {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    });
    return;
  }
  
  // 获取当前用户信息
  await fetchUserInfo();
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true;
    const token = uni.getStorageSync('token');
    
    const response = await uni.request({
      url: 'http://localhost:3000/api/users/me',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      profileForm.value = {
        name: response.data.data.name || '张三',
        avatar: response.data.data.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        college: response.data.data.college || '计算机学院',
        major: response.data.data.major || 'Computer Science',
        skills: response.data.data.skills || ['Vue', 'JavaScript', 'Java', 'Python'],
        bio: response.data.data.bio || 'Finalist at the 2023 Global Hackathon. Passionate about building scalable cloud solutions and intuitive user interfaces. Looking for a hardware enthusiast for the upcoming Robotics Challenge.'
      };
    } else {
      uni.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
      // 使用默认数据
      profileForm.value = {
        name: '张三',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        college: '计算机学院',
        major: 'Computer Science',
        skills: ['Vue', 'JavaScript', 'Java', 'Python'],
        bio: 'Finalist at the 2023 Global Hackathon. Passionate about building scalable cloud solutions and intuitive user interfaces. Looking for a hardware enthusiast for the upcoming Robotics Challenge.'
      };
    }
  } catch (error) {
    console.error('获取用户信息错误:', error);
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
    // 使用默认数据
    profileForm.value = {
      name: '默认用户',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square',
      college: '默认学院',
      major: '默认专业',
      skills: [],
      bio: ''
    };
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 保存个人资料
const saveProfile = async () => {
  try {
    const token = uni.getStorageSync('token');
    const userId = uni.getStorageSync('userInfo')?.id;
    
    if (!token || !userId) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    uni.showLoading({ title: '保存中...' });
    
    const response = await uni.request({
      url: `http://localhost:3000/api/users/${userId}`,
      method: 'PUT',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        name: profileForm.value.name,
        avatar: profileForm.value.avatar,
        college: profileForm.value.college,
        major: profileForm.value.major,
        skills: profileForm.value.skills,
        bio: profileForm.value.bio
      }
    });
    
    if (response.data && response.data.success) {
      // 更新本地存储中的用户信息
      uni.setStorageSync('userInfo', response.data.data);
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({
        title: '保存失败，请稍后重试',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('保存个人资料错误:', error);
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 更换头像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function(res) {
      const tempFilePaths = res.tempFilePaths;
      uploadAvatar(tempFilePaths[0]);
    }
  });
};

// 上传头像
const uploadAvatar = async (tempFilePath) => {
  try {
    const token = uni.getStorageSync('token');
    const userId = uni.getStorageSync('userInfo')?.id;
    
    if (!token || !userId) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    uni.showLoading({ title: '上传中...' });
    
    const uploadTask = uni.uploadFile({
      url: 'http://localhost:3000/api/users/avatar',
      filePath: tempFilePath,
      name: 'avatar',
      header: {
        'Authorization': `Bearer ${token}`
      },
      formData: {
        'userId': userId
      },
      success: async function(uploadRes) {
        try {
          const response = JSON.parse(uploadRes.data);
          if (response && response.success) {
            // 更新本地头像
            profileForm.value.avatar = response.data.avatar;
            // 更新本地存储中的用户信息
            const userInfo = uni.getStorageSync('userInfo');
            userInfo.avatar = response.data.avatar;
            uni.setStorageSync('userInfo', userInfo);
            
            uni.showToast({
              title: '头像上传成功',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: '上传失败，请稍后重试',
              icon: 'none'
            });
          }
        } catch (error) {
          console.error('解析上传响应错误:', error);
          uni.showToast({
            title: '上传失败，请稍后重试',
            icon: 'none'
          });
        }
      },
      fail: function(error) {
        console.error('上传头像错误:', error);
        uni.showToast({
          title: '上传失败，请稍后重试',
          icon: 'none'
        });
      },
      complete: function() {
        uni.hideLoading();
      }
    });
  } catch (error) {
    console.error('上传头像错误:', error);
    uni.hideLoading();
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
  }
};

// 选择学院
const selectSchool = () => {
  console.log('选择学院');
};

// 添加技能标签
const addSkillTag = async () => {
  uni.showModal({
    title: '添加技能',
    editable: true,
    placeholderText: '请输入技能名称',
    success: async (res) => {
      if (res.confirm && res.content.trim() !== '') {
        const newSkill = res.content.trim();
        if (!profileForm.value.skills.includes(newSkill)) {
          profileForm.value.skills.push(newSkill);
          await updateSkillsToServer(); // 调接口同步
        } else {
          uni.showToast({
            title: '技能已存在',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 移除技能
const removeSkill = async (index) => {
  profileForm.value.skills.splice(index, 1);
  await updateSkillsToServer();
};

// 更新技能到服务器
const updateSkillsToServer = async () => {
  try {
    const token = uni.getStorageSync('token');
    const userId = uni.getStorageSync('userInfo')?.id;
    
    if (!token || !userId) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    uni.showLoading({ title: '更新中...' });
    
    const response = await uni.request({
      url: `http://localhost:3000/api/users/${userId}`,
      method: 'PUT',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { skills: profileForm.value.skills }
    });
    
    if (response.data && response.data.success) {
      // 更新本地存储中的用户信息
      uni.setStorageSync('userInfo', response.data.data);
      uni.showToast({ 
        title: '技能已更新', 
        icon: 'success' 
      });
    } else {
      uni.showToast({
        title: '更新失败，请稍后重试',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('更新技能错误:', error);
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 查找技能
const findSkills = () => {
  console.log('查找技能');
};
</script>

<style scoped>
.edit-profile-container {
  background-color: #f7f8fa;
  font-family: 'PingFang SC', sans-serif;
  min-height: 100vh;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f7f9fc;
  border-bottom: 1px solid #f2f4f7;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  font-size: 24px;
  color: #717784;
  cursor: pointer;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #191c1e;
}

.save-btn {
  font-size: 16px;
  font-weight: bold;
  color: #3F8EF7;
  cursor: pointer;
}

/* 头像编辑区域 */
.avatar-section {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.change-avatar-btn {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.avatar-container:hover .change-avatar-btn {
  opacity: 1;
}

.camera-icon {
  font-size: 24px;
  color: white;
  margin-bottom: 5px;
}

.change-text {
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background-color: #4A90E2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.edit-icon {
  font-size: 14px;
  color: white;
}

/* 表单区域 */
.form-container {
  padding: 0 20px 40px;
}

.form-group {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  margin-bottom: 24px;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
}

.field-icon {
  font-size: 20px;
  color: #717784;
  margin-right: 16px;
  width: 24px;
}

.field-content {
  flex: 1;
}

.field-label {
  font-size: 10px;
  font-weight: bold;
  color: #717784;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
  display: block;
}

.field-input {
  width: 100%;
  border: none;
  font-size: 16px;
  color: #191c1e;
  font-weight: 500;
  background: transparent;
  outline: none;
}

.field-value {
  font-size: 16px;
  color: #191c1e;
  font-weight: 500;
}

.chevron-icon {
  font-size: 20px;
  color: #c1c6d5;
}

.divider {
  height: 1px;
  background-color: #f2f4f7;
  margin: 0 16px;
}

/* 技能标签区域 */
.skills-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #191c1e;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.add-tag-btn {
  display: flex;
  align-items: center;
  color: #4A90E2;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.add-icon {
  font-size: 16px;
  margin-right: 4px;
}

.add-tag-text {
  text-transform: uppercase;
}

.skills-container {
  background-color: #f2f4f7;
  border-radius: 12px;
  padding: 16px;
  min-height: 120px;
}

.skill-tag {
  display: flex;
  align-items: center;
  background-color: #4A90E2;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  margin-right: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.skill-text {
  font-size: 14px;
  font-weight: 500;
  margin-right: 8px;
}

.remove-skill {
  font-size: 16px;
  cursor: pointer;
  opacity: 0.6;
}

.remove-skill:hover {
  opacity: 1;
}

.add-more-skills {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(193, 198, 213, 0.3);
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-more-skills:hover {
  border-color: rgba(74, 144, 226, 0.4);
}

.add-more-icon {
  font-size: 24px;
  color: #c1c6d5;
  margin-bottom: 8px;
  transition: color 0.3s;
}

.add-more-skills:hover .add-more-icon {
  color: #4A90E2;
}

.add-more-text {
  font-size: 12px;
  font-weight: bold;
  color: #717784;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s;
}

.add-more-skills:hover .add-more-text {
  color: #4A90E2;
}

/* 个人简介区域 */
.bio-section {
  margin-bottom: 24px;
}

.bio-textarea {
  width: 100%;
  min-height: 100px;
  border: none;
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  color: #191c1e;
  font-weight: 500;
  resize: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  outline: none;
}

/* 成功提示 */
.success-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #191c1e;
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.success-icon {
  font-size: 18px;
  margin-right: 8px;
}

.success-text {
  font-size: 14px;
  font-weight: bold;
}
</style>