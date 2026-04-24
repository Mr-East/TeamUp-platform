<template>
  <view class="my-posts-container">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <view class="nav-left" @click="goBack">
        <text class="back-btn">←</text>
        <text class="nav-title">我的发布</text>
      </view>
    </view>

    <!-- 标签切换 -->
    <view class="tab-bar">
      <view class="tab-item" :class="{ active: activeTab === 'recruit' }" @click="activeTab = 'recruit'">
        <text class="tab-text">找队友</text>
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'seek' }" @click="activeTab = 'seek'">
        <text class="tab-text">求组队</text>
      </view>
    </view>

    <!-- 帖子列表 -->
    <view class="posts-list">
      <!-- 找队友帖子 -->
      <view v-if="activeTab === 'recruit'">
        <view v-if="recruitPosts.length === 0" class="empty-state">
          <text class="empty-icon">📝</text>
          <text class="empty-text">暂无找队友帖子</text>
        </view>
        <view v-else class="post-card" v-for="(post, index) in recruitPosts" :key="post.id">
          <view class="post-header">
            <text class="post-title">{{ post.title }}</text>
            <view class="post-status" :class="post.status">
              <text class="status-text">{{ post.statusText }}</text>
            </view>
          </view>
          <view class="post-info">
            <text class="post-date">发布时间：{{ post.date }}</text>
            <text class="post-people">招募人数：{{ post.people }}人</text>
          </view>
          <view class="skill-tags">
            <view class="skill-tag" v-for="(skill, idx) in post.skills" :key="idx">
              <text class="skill-text">{{ skill }}</text>
            </view>
          </view>
          <view class="post-actions">
            <view class="action-btn" :class="{ active: !post.isClosed }" @click="togglePostStatus(post.id, 'recruit')">
              <text class="btn-text">{{ post.isClosed ? '开启' : '关闭' }}</text>
            </view>
            <view class="action-btn edit" @click="editPost(post.id, 'recruit')">
              <text class="btn-text">编辑</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 求组队帖子 -->
      <view v-else>
        <view v-if="seekPosts.length === 0" class="empty-state">
          <text class="empty-icon">📝</text>
          <text class="empty-text">暂无求组队帖子</text>
        </view>
        <view v-else class="post-card" v-for="(post, index) in seekPosts" :key="post.id">
          <view class="post-header">
            <text class="post-title">{{ post.title }}</text>
            <view class="post-status" :class="post.status">
              <text class="status-text">{{ post.statusText }}</text>
            </view>
          </view>
          <view class="post-info">
            <text class="post-date">发布时间：{{ post.date }}</text>
          </view>
          <view class="skill-tags">
            <view class="skill-tag" v-for="(skill, idx) in post.skills" :key="idx">
              <text class="skill-text">{{ skill }}</text>
            </view>
          </view>
          <view class="post-actions">
            <view class="action-btn" :class="{ active: !post.isClosed }" @click="togglePostStatus(post.id, 'seek')">
              <text class="btn-text">{{ post.isClosed ? '开启' : '关闭' }}</text>
            </view>
            <view class="action-btn edit" @click="editPost(post.id, 'seek')">
              <text class="btn-text">编辑</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 激活的标签
const activeTab = ref('recruit');

// 帖子数据
const recruitPosts = ref([]);
const seekPosts = ref([]);
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
  
  // 获取用户帖子
  await fetchUserPosts();
});

// 获取用户帖子
const fetchUserPosts = async () => {
  try {
    loading.value = true;
    const token = uni.getStorageSync('token');
    const userId = uni.getStorageSync('userInfo')?.id;
    
    if (!userId) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    const response = await uni.request({
      url: `http://localhost:3000/api/users/${userId}/posts`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      // 处理返回的帖子数据
      const posts = response.data.data || [];
      
      // 分类帖子
      recruitPosts.value = posts.map(post => ({
        id: post.id,
        title: post.title,
        cover: post.coverImage || '',
        competitionName: post.competitionName || '未知竞赛',
        intro: post.description || '',
        skills: post.requiredSkills || [],
        competitionType: post.competitionType || '其他',
        deadline: post.deadline || '2026-05-31',
        people: post.recruitmentCount || 1,
        verificationRequired: post.verificationRequired || false,
        date: post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : '2026-04-21',
        status: post.status === 'active' ? 'active' : 'closed',
        statusText: post.status === 'active' ? '招募中' : '已关闭',
        isClosed: post.status !== 'active' ? true : false
      }));
    } else {
      uni.showToast({
        title: '获取帖子失败',
        icon: 'none'
      });
      // 使用默认数据
      recruitPosts.value = [
        {
          id: 1,
          title: '寻找前端开发队友',
          cover: '',
          competitionName: '互联网+',
          intro: '我们正在开发一个校园竞赛平台，需要前端开发队友一起完成项目。',
          skills: ['Vue', 'React', 'JavaScript'],
          competitionType: '互联网+',
          deadline: '2026-05-15',
          people: 2,
          verificationRequired: true,
          date: '2026-04-15',
          status: 'active',
          statusText: '招募中',
          isClosed: false
        },
        {
          id: 2,
          title: 'AI项目组队',
          cover: '',
          competitionName: '挑战杯',
          intro: '我们正在开发一个基于AI的智能推荐系统，需要机器学习相关技能的队友。',
          skills: ['Python', 'TensorFlow', '机器学习'],
          competitionType: '挑战杯',
          deadline: '2026-05-10',
          people: 3,
          verificationRequired: false,
          date: '2026-04-10',
          status: 'closed',
          statusText: '已关闭',
          isClosed: true
        }
      ];
      
      seekPosts.value = [
        {
          id: 1,
          title: '寻找机器学习项目组队',
          targetTrack: '机器学习',
          skills: ['Python', '机器学习', '数据挖掘'],
          bio: '我是计算机专业大三学生，有丰富的机器学习经验，希望加入一个有潜力的项目团队。',
          date: '2026-04-12',
          status: 'active',
          statusText: '求职中',
          isClosed: false
        }
      ];
    }
  } catch (error) {
    console.error('获取帖子错误:', error);
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    });
    // 使用默认数据
    recruitPosts.value = [];
    seekPosts.value = [];
  } finally {
    loading.value = false;
  }
};

// 删除帖子
const togglePostStatus = (id, type) => {
  if (type === 'recruit') {
    const postIndex = recruitPosts.value.findIndex(p => p.id === id);
    if (postIndex !== -1) {
      recruitPosts.value.splice(postIndex, 1);
    }
  } else if (type === 'seek') {
    const postIndex = seekPosts.value.findIndex(p => p.id === id);
    if (postIndex !== -1) {
      seekPosts.value.splice(postIndex, 1);
    }
  }
};

// 编辑帖子
const editPost = (id, type) => {
  console.log('编辑帖子:', id, type);
  // 跳转到发布页面并传递帖子信息
  if (type === 'recruit') {
    const post = recruitPosts.value.find(p => p.id === id);
    if (post) {
      console.log('找到帖子:', post);
      const postDataStr = JSON.stringify(post);
      console.log('帖子数据长度:', postDataStr.length);
      const encodedData = encodeURIComponent(postDataStr);
      console.log('编码后长度:', encodedData.length);
      uni.navigateTo({
        url: `/pages/publish/recruit-teammate?edit=true&postId=${id}&postData=${encodedData}`,
        success: (res) => {
          console.log('跳转成功:', res);
        },
        fail: (err) => {
          console.error('跳转失败:', err);
        }
      });
    } else {
      console.error('未找到帖子:', id);
    }
  } else if (type === 'seek') {
    const post = seekPosts.value.find(p => p.id === id);
    if (post) {
      console.log('找到帖子:', post);
      const postDataStr = JSON.stringify(post);
      console.log('帖子数据长度:', postDataStr.length);
      const encodedData = encodeURIComponent(postDataStr);
      console.log('编码后长度:', encodedData.length);
      uni.navigateTo({
        url: `/pages/publish/seek-team?edit=true&postId=${id}&postData=${encodedData}`,
        success: (res) => {
          console.log('跳转成功:', res);
        },
        fail: (err) => {
          console.error('跳转失败:', err);
        }
      });
    } else {
      console.error('未找到帖子:', id);
    }
  }
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};
</script>

<style scoped>
.my-posts-container {
  min-height: 100vh;
  background-color: #f7f9fc;
  font-family: 'PingFang SC', sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  font-size: 20px;
  color: #3F8EF7;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #191c1e;
}

/* 标签切换 */
.tab-bar {
  display: flex;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.tab-item {
  flex: 1;
  padding: 16px;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.tab-item.active {
  color: #3F8EF7;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background-color: #3F8EF7;
}

.tab-text {
  font-size: 16px;
  font-weight: 500;
}

/* 帖子列表 */
.posts-list {
  padding: 0 16px 20px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 16px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  color: #c1c6d5;
}

.empty-text {
  font-size: 14px;
  color: #717784;
  text-align: center;
}

/* 帖子卡片 */
.post-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 帖子头部 */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  color: #191c1e;
  flex: 1;
  margin-right: 12px;
  line-height: 1.4;
}

.post-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.post-status.active {
  background-color: rgba(0, 91, 178, 0.1);
  color: #005bb2;
}

.post-status.closed {
  background-color: rgba(113, 119, 132, 0.1);
  color: #717784;
}

/* 帖子信息 */
.post-info {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.post-date,
.post-people {
  font-size: 14px;
  color: #717784;
}

/* 技能标签 */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.skill-tag {
  background-color: #e6e8eb;
  color: #414753;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

/* 操作按钮 */
.post-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #c1c6d5;
  color: #717784;
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.active {
  background-color: #005bb2;
  color: white;
  border-color: #005bb2;
}

.action-btn.edit {
  border-color: #c1c6d5;
  color: #717784;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .posts-list {
    padding: 0 12px 16px;
  }
  
  .post-card {
    padding: 16px;
  }
  
  .post-info {
    flex-direction: column;
    gap: 4px;
  }
}
</style>