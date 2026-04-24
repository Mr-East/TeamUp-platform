<template>
  <view class="register-container">
    <view class="register-card">
      <view class="logo">
        <image src="/static/logo.png" mode="aspectFit" class="logo-img" />
        <text class="app-name">Academic Pulse</text>
      </view>
      
      <view class="register-title">注册 / Register</view>
      
      <view class="form-group">
        <text class="label">用户名</text>
        <input 
          v-model="formData.name" 
          type="text" 
          placeholder="请输入用户名" 
          class="input"
        />
      </view>
      
      <view class="form-group">
        <text class="label">邮箱</text>
        <input 
          v-model="formData.email" 
          type="text" 
          placeholder="请输入邮箱" 
          class="input"
        />
      </view>
      
      <view class="form-group">
        <text class="label">密码</text>
        <input 
          v-model="formData.password" 
          type="password" 
          placeholder="请输入密码" 
          class="input"
        />
      </view>
      
      <view class="form-group">
        <text class="label">确认密码</text>
        <input 
          v-model="formData.confirmPassword" 
          type="password" 
          placeholder="请再次输入密码" 
          class="input"
        />
      </view>
      
      <view class="form-group">
        <text class="label">学院</text>
        <input 
          v-model="formData.college" 
          type="text" 
          placeholder="请输入学院" 
          class="input"
        />
      </view>
      
      <view class="form-group">
        <text class="label">专业</text>
        <input 
          v-model="formData.major" 
          type="text" 
          placeholder="请输入专业" 
          class="input"
        />
      </view>
      
      <button @click="handleRegister" class="register-button">创建账号</button>
      
      <view class="login-link">
        <text>已有账号？</text>
        <text @click="goToLogin" class="link-text">去登录 →</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  college: '',
  major: ''
});

const handleRegister = async () => {
  // 表单验证
  if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.college || !formData.major) {
    uni.showToast({
      title: '请填写所有必填字段',
      icon: 'none'
    });
    return;
  }
  
  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    uni.showToast({
      title: '请输入有效的邮箱地址',
      icon: 'none'
    });
    return;
  }
  
  // 密码匹配验证
  if (formData.password !== formData.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    });
    return;
  }
  
  // 密码长度验证
  if (formData.password.length < 6) {
    uni.showToast({
      title: '密码长度至少6位',
      icon: 'none'
    });
    return;
  }

  try {
    uni.showLoading({ title: '注册中...' });
    
    const response = await uni.request({
      url: 'http://localhost:3000/api/auth/register',
      method: 'POST',
      data: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        major: formData.major
      }
    });

    if (response.data.success) {
      uni.showToast({
        title: '注册成功',
        icon: 'success'
      });
      
      // 跳转到登录页
      uni.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      uni.showToast({
        title: response.data.message || '注册失败',
        icon: 'none'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  });
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.logo-img {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.app-name {
  font-size: 24px;
  font-weight: bold;
  color: #4A90E2;
}

.register-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 16px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 16px 14px;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.4;
  box-sizing: border-box;
  background-color: #F9F9F9;
  min-height: 52px;
}

.input::placeholder {
  color: #999;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: #4A90E2;
  background-color: white;
}

.register-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.register-button:active {
  opacity: 0.9;
  transform: translateY(1px);
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.link-text {
  color: #4A90E2;
  font-weight: 500;
  margin-left: 5px;
}
</style>