<template>
  <view class="login-container">
    <view class="login-card">
      <view class="logo">
        <image src="/static/logo.png" mode="aspectFit" class="logo-img" />
        <text class="app-name">Academic Pulse</text>
      </view>
      
      <view class="login-title">登录 / Login</view>
      
      <view class="form-group">
        <text class="label">邮箱 / 手机号</text>
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
      
      <button @click="handleLogin" class="login-button">登录账号</button>
      
      <view class="register-link">
        <text>还没有账号？</text>
        <text @click="goToRegister" class="link-text">去注册 →</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';

const formData = reactive({
  email: '123@qq.com',
  password: '123456'
});

const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    uni.showToast({
      title: '请输入邮箱和密码',
      icon: 'none'
    });
    return;
  }

  try {
    uni.showLoading({ title: '登录中...' });
    
    const response = await uni.request({
      url: 'http://localhost:3000/api/auth/login',
      method: 'POST',
      data: {
        email: formData.email,
        password: formData.password
      }
    });

    console.log('登录响应:', response);
    
    if (response.data && response.data.success) {
      // 保存token到本地存储
      uni.setStorageSync('token', response.data.data.token);
      uni.setStorageSync('userInfo', response.data.data.user);
      
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1000,
        success: function() {
          // 跳转到首页（tabBar页面）
          uni.switchTab({
            url: '/pages/index/index',
            success: function(res) {
              console.log('跳转成功:', res);
            },
            fail: function(err) {
              console.log('跳转失败:', err);
            }
          });
        }
      });
    } else {
      uni.showToast({
        title: response.data.message || '登录失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('登录错误:', error);
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 20px;
}

.login-card {
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

.login-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
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

.login-button {
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

.login-button:active {
  opacity: 0.9;
  transform: translateY(1px);
}

.register-link {
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