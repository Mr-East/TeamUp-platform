<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <el-header v-if="$route.path !== '/login'" style="background: #001529; color: white; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <el-avatar size="large" :src="'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=academic%20logo%20blue%20tech&image_size=square'" />
          <h1 style="margin-left: 16px; font-size: 20px; font-weight: bold;">学术脉搏 - 管理后台</h1>
        </div>
        <div>
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar :size="32" :src="userInfo.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=admin%20avatar&image_size=square'" />
              <span style="margin-left: 8px;">{{ userInfo.name || '管理员' }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container v-if="$route.path !== '/login'">
        <el-aside width="200px" style="background: #001529; height: calc(100vh - 60px);">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical-demo"
            background-color="#001529"
            text-color="#fff"
            active-text-color="#409EFF"
            @select="handleMenuSelect"
          >
            <el-menu-item index="/dashboard">
              <el-icon><data-analysis /></el-icon>
              <span>仪表盘</span>
            </el-menu-item>
            <el-menu-item index="/competitions">
              <el-icon><document /></el-icon>
              <span>竞赛管理</span>
            </el-menu-item>
            <el-menu-item index="/users">
              <el-icon><user /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/posts">
              <el-icon><message /></el-icon>
              <span>帖子管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main style="padding: 20px;">
          <router-view />
        </el-main>
      </el-container>
      <router-view v-else />
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowDown, DataAnalysis, Document, User, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from './store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userInfo = ref({
  name: '',
  avatar: ''
})

const activeMenu = computed(() => {
  return route.path
})

const handleMenuSelect = (key, keyPath) => {
  router.push(key)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
  ElMessage.success('退出登录成功')
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    // 可以在这里获取用户信息
    userInfo.value.name = '管理员'
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
}

.el-icon--right {
  margin-left: 8px;
}

.el-container {
  height: 100% !important;
}

.el-aside {
  height: 100% !important;
}

.el-main {
  overflow-y: auto;
  height: 100%;
}
</style>