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

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error-state">
      <text class="error-text">{{ error }}</text>
      <view class="retry-btn" @click="fetchProjectDetail">重试</view>
    </view>

    <!-- 项目详情内容 -->
    <view v-else class="content-wrapper">
      <!-- 英雄区域 -->
      <view class="hero-section">
        <view class="hero-content">
          <view class="hero-header">
            <view class="status-badge" :class="{ closed: recruitment.status !== 'active' }">
              <view class="status-dot"></view>
              <text class="status-text">{{ recruitment.status === 'active' ? 'Recruiting Now' : '已关闭' }}</text>
            </view>
            <text class="hero-title">{{ recruitment.title }}</text>
          </view>
          <image :src=" recruitment.logo || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square'" mode="aspectFit" class="competition-logo" />
        </view>

        <!-- 发布者信息 -->
        <view class="publisher-info">
          <image :src="recruitment.publisherAvatar || defaultAvatar" mode="aspectFill" class="publisher-avatar" @click="goToPersonInfo" />
          <view class="publisher-details">
            <text class="publisher-name">{{ recruitment.publisher || '未知用户' }}</text>
            <text class="publisher-college">{{ recruitment.publisherCollege || '' }} · {{ recruitment.publisherMajor || '' }}</text>
          </view>
          <view class="follow-btn" @click="sendPrivateMessage">
            <text class="follow-text">私信</text>
          </view>
        </view>
      </view>

      <!-- 项目详情 -->
      <view class="details-section">
        <view class="details-grid">
          <view class="detail-card primary">
            <text class="detail-icon">👥</text>
            <text class="detail-label">招募名额</text>
            <text class="detail-value">{{ recruitment.joined || 0 }}<text class="detail-subtext"> / {{ recruitment.total || 0 }}</text></text>
          </view>
          <view class="detail-card" :class="{ urgent: isUrgent }">
            <text class="detail-icon">📅</text>
            <text class="detail-label">截止日期</text>
            <text class="detail-value">{{ formattedDeadline }}</text>
          </view>
        </view>
      </view>

      <!-- 已加入成员 -->
      <view class="members-section">
        <view class="section-header">
          <text class="section-title">已加入成员</text>
          <text class="section-subtitle">{{ recruitment.joined || 0 }}/{{ recruitment.total || 0 }} Confirmed</text>
        </view>
        <view class="members-list">
          <image :src="member.avatar || defaultAvatar" mode="aspectFill" class="member-avatar" v-for="(member, index) in recruitment.members" :key="index" @click="goToMemberInfo(member.id)" />
          <view class="member-placeholder" v-if="(recruitment.total || 0) > (recruitment.joined || 0)">
            <text class="placeholder-text">+{{ (recruitment.total || 0) - (recruitment.joined || 0) }}</text>
          </view>
        </view>
      </view>

      <!-- 项目简介 -->
      <view class="section">
        <text class="section-title">项目简介</text>
        <text class="section-content">{{ recruitment.description || '暂无描述' }}</text>
      </view>

      <!-- 所需技能 -->
      <view class="section" v-if="recruitment.skills && recruitment.skills.length > 0">
        <text class="section-title">所需技能</text>
        <view class="skill-tags">
          <view class="skill-tag" v-for="(skill, index) in recruitment.skills" :key="index">{{ skill }}</view>
        </view>
      </view>
    </view>

    <!-- 底部评论区 -->
    <view class="bottom-comment-section">
      <view class="comment-section-header">
        <text class="comment-section-title">讨论区 ({{ comments.length }})</text>
        <text class="refresh-btn" @click="fetchComments">🔄 刷新</text>
      </view>

      <!-- 评论列表 -->
      <view class="comment-list">
        <view class="comment-item" v-for="(comment, index) in comments" :key="comment.id">
          <image :src="comment.user?.avatar || defaultAvatar" mode="aspectFill" class="comment-avatar" @click="goToMemberInfo(comment.userId)" />
          <view class="comment-content">
            <view class="comment-header">
              <text class="comment-name">{{ comment.user?.name || '匿名用户' }}</text>
              <text class="comment-time">{{ formatCommentTime(comment.created_at) }}</text>
            </view>
            <text class="comment-text">{{ comment.content }}</text>
            <view class="comment-actions">
                <text class="action-item" @click="likeComment(comment.id)">👍 {{ comment.likesCount || 0 }}</text>
                <text class="action-item" @click="handleReply(comment)">💬 回复</text>
              </view>
              <!-- 回复列表 -->
              <view v-if="comment.replies && comment.replies.length > 0" class="replies-container">
                <view class="reply-item" v-for="(reply, rIndex) in comment.replies" :key="reply.id">
                  <image :src="reply.user?.avatar || defaultAvatar" mode="aspectFill" class="reply-avatar" @click="goToMemberInfo(reply.userId)" />
                  <view class="reply-content">
                    <view class="reply-header">
                      <text class="reply-name">{{ reply.user?.name || '匿名用户' }}</text>
                      <text v-if="reply.parent && reply.parent.user" class="reply-target">→ 回复 {{ reply.parent.user.name }}</text>
                      <text class="reply-time">{{ formatCommentTime(reply.created_at) }}</text>
                    </view>
                    <text class="reply-text">{{ reply.content }}</text>
                  </view>
                  <text class="action-item reply-action" @click="handleReply(reply)">💬 回复</text>
                </view>
              </view>
          </view>
        </view>
        <view v-if="comments.length === 0" class="empty-comments">
          <text class="empty-text">暂无评论，快来发表第一条评论吧</text>
        </view>
      </view>

      <!-- 评论输入框 -->
      <view class="comment-input-area">
        <view v-if="replyToComment" class="reply-indicator">
          <text class="reply-label">回复:</text>
          <text class="reply-name">{{ replyToComment.user?.name || '用户' }}</text>
          <text class="cancel-reply" @click="cancelReply">×</text>
        </view>
        <!-- 评论输入框 -->
        <view class="input-wrapper">
          <input 
            v-if="!replyToComment" 
            type="text" 
            placeholder="发表你的看法..." 
            class="comment-input" 
            v-model="newComment" 
            @confirm="submitComment" 
          />
          <!-- 回复输入框 -->
          <input 
            v-else 
            type="text" 
            :placeholder="`回复 ${replyToComment.user?.name || '用户'}...`" 
            class="comment-input" 
            v-model="replyContent" 
            @confirm="submitReply" 
          />
        </view>
        <text class="submit-btn" @click="sendComment">发送</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-btn" @click="showComment">
        <text class="action-icon">💬</text>
        <text class="action-text">评论</text>
      </view>
      <view class="action-btn" @click="sendPrivateMessage">
        <text class="action-icon">✉️</text>
        <text class="action-text">私信</text>
      </view>
      <view class="join-btn" :class="{ disabled: joinStatus !== 'none' }" @click="handleJoin">
        <text class="join-text">{{ joinButtonText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const recruitmentId = ref('');
const recruitment = ref({});
const comments = ref([]);
const newComment = ref('');
const loading = ref(false);
const error = ref('');
const joinStatus = ref('none');
const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square';
const replyToComment = ref(null);
const replyContent = ref('');

// 移除计算属性，直接在模板中处理

const isUrgent = computed(() => {
  if (!recruitment.value.deadline) return false;
  const deadline = new Date(recruitment.value.deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays > 0;
});

const formattedDeadline = computed(() => {
  if (!recruitment.value.deadline) return '未设置';
  const deadline = new Date(recruitment.value.deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `已结束`;
  } else if (diffDays === 0) {
    return `今天截止`;
  } else if (diffDays === 1) {
    return `明天截止`;
  } else if (diffDays <= 7) {
    return `${diffDays}天后截止`;
  } else {
    return deadline.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', year: 'numeric' });
  }
});

const joinButtonText = computed(() => {
  switch (joinStatus.value) {
    case 'owner':
      return '我的项目';
    case 'member':
      return '已加入';
    case 'pending':
      return '等待审核';
    case 'rejected':
      return '已拒绝';
    default:
      return '我要加入';
  }
});

const fetchProjectDetail = async () => {
  try {
    loading.value = true;
    error.value = '';

    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: `http://localhost:3000/api/projects/${recruitmentId.value}`,
      method: 'GET',
      header: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (response.data && response.data.success) {
      const data = response.data.data;
      recruitment.value = {
        id: data.id,
        title: data.title,
        description: data.description,
        logo: data.coverImage,
        publisher: data.creator?.name,
        publisherAvatar: data.creator?.avatar,
        publisherCollege: data.creator?.college,
        publisherMajor: data.creator?.major,
        publisherId: data.creator?.id,
        deadline: data.deadline,
        joined: 0,
        total: data.peopleNeeded,
        skills: data.skills || [],
        status: data.status,
        creatorId: data.createdBy
      };

      await Promise.all([
        fetchProjectMembers(),
        fetchJoinStatus(),
        fetchComments()
      ]);
    } else {
      error.value = '获取项目详情失败';
    }
  } catch (err) {
    console.error('获取项目详情错误:', err);
    error.value = '网络错误，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const fetchProjectMembers = async () => {
  try {
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: `http://localhost:3000/api/projects/${recruitmentId.value}/members`,
      method: 'GET',
      header: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (response.data && response.data.success) {
      recruitment.value.members = response.data.data.map(m => ({
        id: m.userId,
        name: m.User?.name,
        avatar: m.User?.avatar
      }));
      recruitment.value.joined = response.data.data.length;
    }
  } catch (err) {
    console.error('获取项目成员错误:', err);
  }
};

const fetchJoinStatus = async () => {
  try {
    const token = uni.getStorageSync('token');
    if (!token) return;

    const response = await uni.request({
      url: `http://localhost:3000/api/projects/${recruitmentId.value}/join-status`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${token}` }
    });

    if (response.data && response.data.success) {
      joinStatus.value = response.data.data.status;
    }
  } catch (err) {
    console.error('获取加入状态错误:', err);
  }
};

const fetchComments = async () => {
  try {
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: `http://localhost:3000/api/projects/${recruitmentId.value}/comments`,
      method: 'GET',
      header: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (response.data && response.data.success) {
      comments.value = response.data.data || [];
    }
  } catch (err) {
    console.error('获取评论错误:', err);
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' });
    return;
  }

  try {
    const token = uni.getStorageSync('token');
    if (!token) {
      uni.navigateTo({ url: '/pages/login/login' });
      return;
    }

    const response = await uni.request({
      url: `http://localhost:3000/api/projects/${recruitmentId.value}/comments`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { content: newComment.value.trim() }
    });

    if (response.data && response.data.success) {
      uni.showToast({ title: '评论成功', icon: 'success' });
      newComment.value = '';
      await fetchComments();
    } else {
      uni.showToast({ title: response.data?.message || '评论失败', icon: 'none' });
    }
  } catch (err) {
    console.error('提交评论错误:', err);
    uni.showToast({ title: '网络错误', icon: 'none' });
  }
};

const submitReply = async () => {
  if (!replyContent.value.trim()) {
    uni.showToast({ title: '请输入回复内容', icon: 'none' });
    return;
  }

  try {
    const token = uni.getStorageSync('token');
    if (!token) {
      uni.navigateTo({ url: '/pages/login/login' });
      return;
    }

    const response = await uni.request({
      url: `http://localhost:3000/api/projects/${recruitmentId.value}/comments`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        content: replyContent.value.trim(),
        parentCommentId: replyToComment.value.id
      }
    });

    if (response.data && response.data.success) {
      uni.showToast({ title: '回复成功', icon: 'success' });
      replyContent.value = '';
      replyToComment.value = null;
      await fetchComments();
    } else {
      uni.showToast({ title: response.data?.message || '回复失败', icon: 'none' });
    }
  } catch (err) {
    console.error('提交回复错误:', err);
    uni.showToast({ title: '网络错误', icon: 'none' });
  }
};

const handleReply = (comment) => {
  replyToComment.value = comment;
  replyContent.value = '';
  // 滚动到评论输入框
  uni.pageScrollTo({
    selector: '.comment-input-area',
    duration: 300
  });
  
  // 移除焦点设置，因为在小程序中 createSelectorQuery() 没有 focus() 方法
  // 滚动到输入框后，用户可以手动点击输入框获得焦点
};

const cancelReply = () => {
  replyContent.value = '';
  replyToComment.value = null;
};

const sendComment = () => {
  if (replyToComment.value) {
    submitReply();
  } else {
    submitComment();
  }
};

const likeComment = async (commentId) => {
  try {
    const token = uni.getStorageSync('token');
    if (!token) return;

    const response = await uni.request({
      url: `http://localhost:3000/api/projects/comments/${commentId}/like`,
      method: 'PUT',
      header: { 'Authorization': `Bearer ${token}` }
    });

    if (response.data && response.data.success) {
      await fetchComments();
    }
  } catch (err) {
    console.error('点赞评论错误:', err);
  }
};

const handleJoin = async () => {
  if (joinStatus.value !== 'none') {
    if (joinStatus.value === 'pending') {
      uni.showToast({ title: '您的申请正在审核中', icon: 'none' });
    } else if (joinStatus.value === 'member') {
      uni.showToast({ title: '您已是项目成员', icon: 'none' });
    } else if (joinStatus.value === 'owner') {
      uni.showToast({ title: '这是您的项目', icon: 'none' });
    }
    return;
  }

  uni.showModal({
    title: '申请加入',
    editable: true,
    placeholderText: '请输入申请理由（选填）',
    success: async (res) => {
      if (res.confirm) {
        await submitJoinApplication(res.content || '');
      }
    }
  });
};

const submitJoinApplication = async (reasonText) => {
  try {
    const token = uni.getStorageSync('token');
    if (!token) {
      uni.navigateTo({ url: '/pages/login/login' });
      return;
    }

    const response = await uni.request({
      url: `http://localhost:3000/api/projects/${recruitmentId.value}/join`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: { reasonText }
    });

    if (response.data && response.data.success) {
      uni.showToast({ title: '申请已提交', icon: 'success' });
      await fetchJoinStatus();
    } else {
      uni.showToast({ title: response.data?.message || '申请失败', icon: 'none' });
    }
  } catch (err) {
    console.error('提交申请错误:', err);
    uni.showToast({ title: '网络错误', icon: 'none' });
  }
};

const sendPrivateMessage = () => {
  if (!recruitment.value.publisherId) {
    uni.showToast({ title: '无法获取用户信息', icon: 'none' });
    return;
  }

  const currentUser = uni.getStorageSync('userInfo');
  if (currentUser && currentUser.id === recruitment.value.publisherId) {
    uni.showToast({ title: '不能给自己发私信', icon: 'none' });
    return;
  }

  uni.navigateTo({
    url: `/pages/chat/chat?otherUserId=${recruitment.value.publisherId}&name=${encodeURIComponent(recruitment.value.publisher || '用户')}&avatar=${encodeURIComponent(recruitment.value.publisherAvatar || '')}`
  });
};

const showComment = () => {
  uni.pageScrollTo({
    selector: '.comment-input-area',
    duration: 300
  });
};

const goBack = () => {
  uni.navigateBack();
};

const goToPersonInfo = () => {
  if (recruitment.value.publisherId) {
    uni.navigateTo({
      url: `/pages/personInfo/personInfo?userId=${recruitment.value.publisherId}`
    });
  }
};

const goToMemberInfo = (userId) => {
  if (userId) {
    uni.navigateTo({
      url: `/pages/personInfo/personInfo?userId=${userId}`
    });
  }
};

const formatCommentTime = (timeString) => {
  if (!timeString) return '';

  const date = new Date(timeString);
  const now = new Date();
  const diffTime = now - date;
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString('zh-CN');
  }
};

onLoad((options) => {
  if (options.data) {
    try {
      const decodedData = decodeURIComponent(options.data);
      const data = JSON.parse(decodedData);
      recruitmentId.value = data.id;
      recruitment.value = {
        ...recruitment.value,
        ...data
      };
    } catch (e) {
      console.error('解析项目数据失败', e);
    }
  }

  if (options.id) {
    recruitmentId.value = options.id;
  }

  if (recruitmentId.value) {
    fetchProjectDetail();
  }
});
</script>

<style scoped>
.detail-container {
  background-color: #f7f9fc;
  min-height: 100vh;
  padding-bottom: 120px;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-text {
  font-size: 14px;
  color: #4A90E2;
}

.error-text {
  font-size: 14px;
  color: #ff4d4f;
  margin-bottom: 10px;
}

.retry-btn {
  padding: 8px 16px;
  background-color: #4A90E2;
  color: white;
  border-radius: 6px;
  font-size: 14px;
}

.content-wrapper {
  padding-bottom: 20px;
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

.status-badge.closed .status-dot {
  background-color: #999;
  box-shadow: none;
}

.status-text {
  font-size: 10px;
  font-weight: bold;
  color: #006c52;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-badge.closed .status-text {
  color: #999;
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
background-color: #e6e8eb;
  color: black;
  /* box-shadow: 0 8px 24px rgba(255, 77, 79, 0.2); */
}

.detail-card.urgent {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff6b6b 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(255, 77, 79, 0.2);
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

.section-header,
.section-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.refresh-btn {
  font-size: 12px;
  color: #4A90E2;
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

/* 底部评论区 */
.bottom-comment-section {
  background-color: white;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin: 20px 0;
}

.comment-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f2f4f7;
}

.comment-section-title {
  font-size: 14px;
  font-weight: bold;
  color: #717784;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 评论区 */
.comment-list {
  margin-top: 16px;
  max-height: none;
  overflow-y: visible;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: none;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
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
  word-break: break-all;
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

.empty-comments {
  text-align: center;
  padding: 30px 0;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 回复列表容器 */
.replies-container {
  margin-top: 8px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* 回复 */
.reply-item {
  margin-top: 12px;
  padding-left: 8px;
  border-left: 2px solid #e8e8e8;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.reply-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.reply-content {
  flex: 1;
  min-width: 0;
}

.reply-name {
  font-size: 11px;
  font-weight: bold;
  color: #191c1e;
  display: block;
  margin-bottom: 2px;
}

.reply-text {
  font-size: 12px;
  color: #333;
  word-break: break-all;
}

/* 评论输入框 */
.comment-input-area {
  margin-top: 16px;
  padding: 12px;
  background-color: #f2f4f7;
  border-radius: 8px;
  gap: 12px;
  border-top: none;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.reply-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.reply-label {
  font-size: 12px;
  color: #717784;
}

.reply-name {
  font-size: 12px;
  font-weight: bold;
  color: #191c1e;
  flex: 1;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.reply-target {
  font-size: 12px;
  color: #4A90E2;
}

.reply-time {
  font-size: 10px;
  color: #999;
  margin-left: auto;
}

.cancel-reply {
  font-size: 16px;
  color: #717784;
  cursor: pointer;
  padding: 0 4px;
}

.input-wrapper {
  width: 100%;
  margin-bottom: 8px;
}

.comment-input {
  width: 100%;
  padding: 12px 16px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  height: 44px;
  line-height: 20px;
}

.comment-input:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.comment-input-area .submit-btn {
  align-self: flex-end;
}

.reply-action {
  font-size: 10px;
  font-weight: bold;
  color: #717784;
  margin-left: 8px;
  align-self: flex-start;
  margin-top: 4px;
}

.submit-btn {
  color: #4A90E2;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
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
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -4px 24px rgba(0, 91, 178, 0.08);
  z-index: 5;
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
  margin-left: 12px;
}

.join-btn.disabled {
  background: linear-gradient(135deg, #999 0%, #bbb 100%);
  box-shadow: none;
}

.join-text {
  color: white;
}
</style>