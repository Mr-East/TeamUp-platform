<template>
  <view class="square-container">
    <!-- 顶部切换栏 -->
    <view class="tab-bar">
      <view class="tab-item" :class="{ active: activeTab === 'team' }" @click="switchTab('team')">
        <text class="tab-text">组队广场</text>
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'talent' }" @click="switchTab('talent')">
        <text class="tab-text">人才广场</text>
      </view>
    </view>

    <!-- 组队广场筛选栏 -->
    <view class="filter-bar" v-if="activeTab === 'team'">
      <view class="filter-item" @click="toggleFilter('competition')">
        <text>{{ teamFilters.competitionType || '竞赛类型' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item" @click="toggleFilter('skill')">
        <text>{{ teamFilters.skill || '技能标签' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item" @click="toggleFilter('deadline')">
        <text>{{ teamFilters.deadline || '截止时间' }}</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <!-- 人才广场筛选栏 -->
    <view class="filter-bar" v-else>
      <view class="filter-item" @click="toggleTalentFilter('grade')">
        <text>{{ talentFilters.grade || '年级' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item" @click="toggleTalentFilter('major')">
        <text>{{ talentFilters.major || '专业' }}</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item" @click="toggleTalentFilter('skill')">
        <text>{{ talentFilters.skill || '技能' }}</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <!-- 组队广场列表 -->
    <view v-if="activeTab === 'team'" class="recruitment-list">
      <!-- 加载状态 -->
      <view v-if="loading.team" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>
      <!-- 错误状态 -->
      <view v-else-if="error.team" class="error-state">
        <text class="error-text">{{ error.team }}</text>
        <view class="retry-btn" @click="fetchTeamRecruitments">重试</view>
      </view>
      <!-- 空状态 -->
      <view v-else-if="recruitments.length === 0" class="empty-state">
        <text class="empty-text">暂无组队信息</text>
      </view>
      <!-- 组队列表 -->
      <template v-else>
        <view class="recruitment-item" v-for="(item, index) in recruitments" :key="index" @click="goToDetail(item.id)">
          <view class="item-header">
            <image :src="item.logo" mode="aspectFit" class="logo" />
            <view class="header-info">
              <text class="competition-name">{{ item.name }}</text>
              <text class="title">{{ item.title }}</text>
              <text class="publisher">{{ item.publisher }}</text>
            </view>
          </view>
          <view class="item-content">
            <view class="skill-tags">
              <view class="skill-tag" v-for="(skill, idx) in item.skills.slice(0, 3)" :key="idx">{{ skill }}</view>
              <view class="skill-tag more" v-if="item.skills.length > 3">+{{ item.skills.length - 3 }}</view>
            </view>
            <view class="progress-container">
              <text class="progress-text">人数进度</text>
              <view class="progress-bar">
                <view class="progress-fill" :style="{ width: item.progress + '%' }"></view>
              </view>
              <text class="progress-value">{{ item.joined }}/{{ item.total }}</text>
            </view>
            <text class="deadline">截止时间：{{ formatDate(item.deadline) }}</text>
          </view>
        </view>

        <!-- 加载更多 -->
        <view class="load-more" v-if="recruitmentHasMore">
          <text v-if="loading.team">加载中...</text>
          <text v-else @click="loadMore">加载更多</text>
        </view>
        <view class="no-more" v-else>
          <text>已经到底了</text>
        </view>
      </template>
    </view>

    <!-- 人才广场列表 -->
    <view v-else class="talent-list">
      <!-- 加载状态 -->
      <view v-if="loading.talent" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>
      <!-- 错误状态 -->
      <view v-else-if="error.talent" class="error-state">
        <text class="error-text">{{ error.talent }}</text>
        <view class="retry-btn" @click="fetchTalentList">重试</view>
      </view>
      <!-- 空状态 -->
      <view v-else-if="talents.length === 0" class="empty-state">
        <text class="empty-text">暂无人才信息</text>
      </view>
      <!-- 人才列表 -->
      <template v-else>
        <TalentCard
          v-for="(talent, index) in talents"
          :key="index"
          :id="talent.id"
          :avatar="talent.avatar"
          :name="talent.name"
          :major="talent.major"
          :intro="talent.intro"
          :skills="talent.skills"
          :target-track="talent.targetTrack"
          :competition-types="talent.competitionTypes"
          @invite="inviteTeam"
          @greet="greet"
          @avatar-click="viewProfile"
        />

        <!-- 加载更多 -->
        <view class="load-more" v-if="talentHasMore">
          <text v-if="loading.talent">加载中...</text>
          <text v-else @click="loadMoreTalent">加载更多</text>
        </view>
        <view class="no-more" v-else>
          <text>已经到底了</text>
        </view>
      </template>
    </view>

    <!-- 邀请组队弹窗 -->
    <view v-if="showInviteModal" class="modal-overlay" @click="closeInviteModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择项目</text>
          <text class="modal-close" @click="closeInviteModal">×</text>
        </view>
        <view class="modal-body">
          <view 
            v-if="myProjects.length === 0"
            class="empty-projects"
          >
            <text>暂无负责的项目</text>
          </view>
          <template v-else>
            <view 
              v-for="project in myProjects" 
              :key="project.id" 
              class="project-item"
              :class="{ selected: selectedProject?.id === project.id }"
              @click="selectProject(project)"
            >
              <view class="project-info">
                <text class="project-title">{{ project.title }}</text>
                <text class="project-competition">{{ project.competitionName }}</text>
              </view>
              <view class="project-check">
                <text v-if="selectedProject?.id === project.id" class="check-icon">✓</text>
              </view>
            </view>
            <view class="invite-reason">
              <textarea 
                v-model="inviteReason" 
                placeholder="写点邀请的话..." 
                class="reason-input"
                maxlength="200"
              />
            </view>
            <view class="modal-footer">
              <view class="btn cancel-btn" @click="closeInviteModal">取消</view>
              <view class="btn confirm-btn" @click="sendInvitation" :class="{ disabled: !selectedProject }">
                发送邀请
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilterModal" class="modal-overlay" @click="closeFilterModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择{{ currentFilterType === 'grade' ? '年级' : currentFilterType === 'major' ? '专业' : '技能' }}</text>
          <text class="modal-close" @click="closeFilterModal">×</text>
        </view>
        <view class="modal-body">
          <view 
            v-for="option in filterOptions" 
            :key="option" 
            class="filter-option"
            :class="{ active: activeTab === 'team' ? teamFilters[currentFilterType === 'competition' ? 'competitionType' : currentFilterType] === option : talentFilters[currentFilterType] === option }"
            @click="activeTab === 'team' ? selectTeamFilter(option) : selectFilter(option)"
          >
            <text>{{ option }}</text>
            <text v-if="activeTab === 'team' ? teamFilters[currentFilterType === 'competition' ? 'competitionType' : currentFilterType] === option : talentFilters[currentFilterType] === option" class="check-icon">✓</text>
          </view>
          <view class="clear-filter" @click="activeTab === 'team' ? clearTeamFilter() : clearFilter()">
            <text>清除筛选</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 悬浮发布按钮 -->
    <view class="fab" @click="goToPublish">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import TalentCard from '../../components/TalentCard/TalentCard.vue';

// 加载状态
const loading = ref({
  team: false,
  talent: false
});

// 错误信息
const error = ref({
  team: '',
  talent: ''
});

// 弹窗状态
const showInviteModal = ref(false);
const showFilterModal = ref(false);
const currentFilterType = ref('');

// 筛选数据
const talentFilters = ref({
  grade: '',
  major: '',
  skill: ''
});

// 筛选选项
const filterOptions = ref([]);
const gradeOptions = ['大一', '大二', '大三', '大四', '研究生'];
const majorOptions = ['计算机科学与技术', '软件工程', '人工智能', '数字媒体艺术', '市场营销', '电子工程', '机械工程'];
const skillOptions = ['Vue', 'React', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C++', 'UI设计', '产品经理', '机器学习', '数据分析', 'App开发', '微信小程序'];
const competitionOptions = ['创新创业', '学科竞赛', '技能大赛', '艺术设计', '科研项目'];

// 邀请相关数据
const currentTalentId = ref(null);
const selectedProject = ref(null);
const myProjects = ref([]);
const inviteReason = ref('我看你的技能很适合我们的项目，邀请你加入！');

// 当前用户信息
const currentUser = ref({
  id: null,
  name: '',
  avatar: ''
});

// 标签状态
const activeTab = ref('team');

// 组队广场数据
const recruitments = ref([]);
const recruitmentPage = ref(1);
const recruitmentHasMore = ref(true);

// 人才广场数据
const talents = ref([]);
const talentPage = ref(1);
const talentHasMore = ref(true);

// 组队广场筛选
const teamFilters = ref({
  competitionType: '',
  skill: '',
  deadline: ''
});

// 获取用户信息
const getUserInfo = async () => {
  try {
    const token = uni.getStorageSync('token');
    if (!token) return;
    
    const response = await uni.request({
      url: 'http://localhost:3000/api/users/me',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      const user = response.data.data;
      currentUser.value = {
        id: user.id,
        name: user.name || user.username || '',
        avatar: user.avatar || ''
      };
    }
  } catch (err) {
    console.error('获取用户信息错误:', err);
  }
};

// 检查登录状态
onLoad(async () => {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    });
  } else {
    await getUserInfo();
  }
});

// 页面显示时获取数据
onShow(async () => {
  const token = uni.getStorageSync('token');
  if (token) {
    await Promise.all([
      getUserInfo(),
      fetchTeamRecruitments(),
      fetchTalentList(),
      fetchMyProjects()
    ]);
  }
});

// 下拉刷新
onPullDownRefresh(async () => {
  if (activeTab.value === 'team') {
    recruitmentPage.value = 1;
    recruitmentHasMore.value = true;
    await fetchTeamRecruitments(false);
  } else {
    talentPage.value = 1;
    talentHasMore.value = true;
    await fetchTalentList(false);
  }
  uni.stopPullDownRefresh();
});

// 触底加载更多
onReachBottom(() => {
  if (activeTab.value === 'team') {
    loadMore();
  } else {
    loadMoreTalent();
  }
});

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab;
};

// 获取组队广场数据
const fetchTeamRecruitments = async (isLoadMore = false) => {
  try {
    loading.value.team = true;
    error.value.team = '';
    
    const token = uni.getStorageSync('token');
    
    // 构建查询参数
    let queryParams = '';
    const params = [];
    if (teamFilters.value.competitionType) params.push(`competitionType=${encodeURIComponent(teamFilters.value.competitionType)}`);
    if (teamFilters.value.skill) params.push(`skill=${encodeURIComponent(teamFilters.value.skill)}`);
    if (teamFilters.value.deadline) params.push(`deadline=${encodeURIComponent(teamFilters.value.deadline)}`);
    
    // 添加分页参数
    const page = isLoadMore ? recruitmentPage.value + 1 : 1;
    const limit = 10;
    params.push(`page=${page}`);
    params.push(`limit=${limit}`);
    
    if (params.length > 0) queryParams = '?' + params.join('&');
    
    const response = await uni.request({
      url: `http://localhost:3000/api/projects${queryParams}`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      const projectList = response.data.data.projects || [];
      const newRecruitments = projectList.map(project => ({
        id: project.id,
        title: project.title,
        name: project.competitionName,
        logo: project.coverImage || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square',
        publisher: project.creator?.name || '未知发布者',
        publisherAvatar: project.creator?.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square',
        college: project.creator?.college || '未知学院',
        description: project.description,
        skills: project.skills || [],
        progress: project.progress || 0,
        joined: project.joined || 0,
        total: project.total || project.peopleNeeded || 1,
        deadline: project.deadline || '2026-05-31',
        members: project.members || [],
        comments: project.comments || []
      }));
      
      if (isLoadMore) {
        recruitments.value = [...recruitments.value, ...newRecruitments];
        recruitmentPage.value = page;
      } else {
        recruitments.value = newRecruitments;
        recruitmentPage.value = 1;
      }
      
      // 判断是否还有更多数据
      recruitmentHasMore.value = newRecruitments.length === limit && recruitments.value.length > 0;
    } else {
      error.value.team = '获取组队广场数据失败';
    }
  } catch (err) {
    console.error('获取组队广场数据错误:', err);
    error.value.team = '网络错误，请稍后重试';
  } finally {
    loading.value.team = false;
  }
};

// 获取人才广场数据
const fetchTalentList = async (isLoadMore = false) => {
  try {
    loading.value.talent = true;
    error.value.talent = '';
    
    const token = uni.getStorageSync('token');
    
    // 构建查询参数
    let queryParams = '';
    const params = [];
    if (talentFilters.value.grade) params.push(`grade=${encodeURIComponent(talentFilters.value.grade)}`);
    if (talentFilters.value.major) params.push(`major=${encodeURIComponent(talentFilters.value.major)}`);
    if (talentFilters.value.skill) params.push(`skill=${encodeURIComponent(talentFilters.value.skill)}`);
    
    // 添加分页参数
    const page = isLoadMore ? talentPage.value + 1 : 1;
    const limit = 10;
    params.push(`page=${page}`);
    params.push(`limit=${limit}`);
    
    if (params.length > 0) queryParams = '?' + params.join('&');
    
    const url = `http://localhost:3000/api/users/talents${queryParams}`;
    
    const response = await uni.request({
      url,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      const newTalents = response.data.data.map(user => ({
        id: user.id,
        name: user.name,
        major: `${user.major}${user.grade ? ' · ' + user.grade : ''}`,
        intro: user.bio || '暂无简介',
        skills: user.skills || [],
        targetTrack: user.targetTrack || '',
        competitionTypes: user.competitionTypes || [],
        avatar: user.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square'
      }));
      
      if (isLoadMore) {
        talents.value = [...talents.value, ...newTalents];
        talentPage.value = page;
      } else {
        talents.value = newTalents;
        talentPage.value = 1;
      }
      
      // 判断是否还有更多数据
      talentHasMore.value = newTalents.length === limit && talents.value.length > 0;
    } else {
      error.value.talent = '获取人才广场数据失败';
    }
  } catch (err) {
    console.error('获取人才广场数据错误:', err);
    error.value.talent = '网络错误，请稍后重试';
  } finally {
    loading.value.talent = false;
  }
};

// 获取我的项目
const fetchMyProjects = async () => {
  try {
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: 'http://localhost:3000/api/projects/my',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      // 过滤掉已删除的项目（status = 'deleted'）
      const projects = response.data.data || [];
      myProjects.value = projects.filter(project => project.status !== 'deleted');
    }
  } catch (err) {
    console.error('获取我的项目错误:', err);
  }
};

// 跳转到招募详情页
const goToDetail = (id) => {
  const recruitment = recruitments.value.find(item => item.id === id);
  if (recruitment) {
    const dataStr = encodeURIComponent(JSON.stringify(recruitment));
    uni.navigateTo({
      url: `/pages/recruitment-detail/recruitment-detail?data=${dataStr}`
    });
  }
};

// 查看个人主页
const viewProfile = (id) => {
  uni.navigateTo({
    url: `/pages/personInfo/personInfo?userId=${id}`
  });
};

// 邀请组队
const inviteTeam = async (id) => {
  // 如果是本人，不允许邀请
  if (currentUser.value.id === id) {
    uni.showToast({
      title: '不能邀请自己',
      icon: 'none'
    });
    return;
  }
  
  currentTalentId.value = id;
  selectedProject.value = null;
  inviteReason.value = '我看你的技能很适合我们的项目，邀请你加入！';
  
  // 获取我的项目
  await fetchMyProjects();
  showInviteModal.value = true;
};

// 选择项目
const selectProject = (project) => {
  selectedProject.value = project;
};

// 发送邀请
const sendInvitation = async () => {
  if (!selectedProject.value) {
    uni.showToast({
      title: '请选择项目',
      icon: 'none'
    });
    return;
  }
  
  try {
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: 'http://localhost:3000/api/applications/invite',
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        projectId: selectedProject.value.id,
        userId: currentTalentId.value,
        reasonText: inviteReason.value
      }
    });
    
    if (response.data && response.data.success) {
      uni.showToast({
        title: '邀请发送成功',
        icon: 'success'
      });
      closeInviteModal();
    } else {
      uni.showToast({
        title: response.data?.message || '发送失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('发送邀请错误:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
};

// 关闭邀请弹窗
const closeInviteModal = () => {
  showInviteModal.value = false;
  currentTalentId.value = null;
  selectedProject.value = null;
};

// 打个招呼 - 先获取聊天ID，再跳转到聊天页面
const greet = async (id) => {
  // 如果是本人，不允许打个招呼
  if (currentUser.value.id === id) {
    uni.showToast({
      title: '不能对自己打招呼',
      icon: 'none'
    });
    return;
  }
  
  const talent = talents.value.find(t => t.id === id);
  if (!talent) return;
  
  try {
    const token = uni.getStorageSync('token');
    if (!token) {
      uni.navigateTo({
        url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || '')}`
      });
      return;
    }
    
    // 尝试获取与该用户的聊天记录
    const response = await uni.request({
      url: `http://localhost:3000/api/messages/chats`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data && response.data.success) {
      const chats = response.data.data || [];
      // 查找与该用户的聊天
      const chat = chats.find(c => c.otherUser && c.otherUser.id === id);
      
      if (chat) {
        // 如果有聊天记录，传递 chatId
        uni.navigateTo({
          url: `/pages/chat/chat?chatId=${chat.id}&otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || '')}`
        });
      } else {
        // 如果没有聊天记录，直接跳转
        uni.navigateTo({
          url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || '')}`
        });
      }
    } else {
      // 如果获取聊天列表失败，直接跳转
      uni.navigateTo({
        url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || '')}`
      });
    }
  } catch (err) {
    console.error('获取聊天列表错误:', err);
    // 错误时直接跳转
    uni.navigateTo({
      url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || '')}`
    });
  }
};

// 切换人才筛选
const toggleTalentFilter = (type) => {
  currentFilterType.value = type;
  
  if (type === 'grade') {
    filterOptions.value = gradeOptions;
  } else if (type === 'major') {
    filterOptions.value = majorOptions;
  } else if (type === 'skill') {
    filterOptions.value = skillOptions;
  }
  
  showFilterModal.value = true;
};

// 选择筛选
const selectFilter = (option) => {
  if (activeTab.value === 'team') {
    teamFilters.value[currentFilterType.value === 'competition' ? 'competitionType' : currentFilterType.value] = option;
    closeFilterModal();
    fetchTeamRecruitments();
  } else {
    talentFilters.value[currentFilterType.value] = option;
    closeFilterModal();
    fetchTalentList();
  }
};

// 清除筛选
const clearFilter = () => {
  if (activeTab.value === 'team') {
    teamFilters.value[currentFilterType.value === 'competition' ? 'competitionType' : currentFilterType.value] = '';
    closeFilterModal();
    fetchTeamRecruitments();
  } else {
    talentFilters.value[currentFilterType.value] = '';
    closeFilterModal();
    fetchTalentList();
  }
};

// 关闭筛选弹窗
const closeFilterModal = () => {
  showFilterModal.value = false;
};

// 切换组队筛选
const toggleFilter = (type) => {
  currentFilterType.value = type;
  
  if (type === 'competition') {
    filterOptions.value = competitionOptions;
  } else if (type === 'skill') {
    filterOptions.value = skillOptions;
  } else if (type === 'deadline') {
    filterOptions.value = ['一周内', '两周内', '一个月内', '三个月内'];
  }
  
  showFilterModal.value = true;
};

// 选择组队筛选
const selectTeamFilter = (option) => {
  if (currentFilterType.value === 'competition') {
    teamFilters.value.competitionType = option;
  } else if (currentFilterType.value === 'skill') {
    teamFilters.value.skill = option;
  } else if (currentFilterType.value === 'deadline') {
    teamFilters.value.deadline = option;
  }
  closeFilterModal();
  fetchTeamRecruitments();
};

// 清除组队筛选
const clearTeamFilter = () => {
  if (currentFilterType.value === 'competition') {
    teamFilters.value.competitionType = '';
  } else if (currentFilterType.value === 'skill') {
    teamFilters.value.skill = '';
  } else if (currentFilterType.value === 'deadline') {
    teamFilters.value.deadline = '';
  }
  closeFilterModal();
  fetchTeamRecruitments();
};

// 加载更多组队信息
const loadMore = async () => {
  if (loading.value.team || !recruitmentHasMore.value) return;
  await fetchTeamRecruitments(true);
};

// 加载更多人才信息
const loadMoreTalent = async () => {
  if (loading.value.talent || !talentHasMore.value) return;
  await fetchTalentList(true);
};

// 跳转到发布页面
const goToPublish = () => {
  uni.navigateTo({
    url: '/pages/publish/recruit-teammate'
  });
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未设置';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
</script>

<style scoped>
.square-container {
  padding-bottom: 60px;
}

.tab-bar {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
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

.filter-bar {
  display: flex;
  background-color: white;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 50px;
  z-index: 9;
}

.filter-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

.arrow {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}

.recruitment-list {
  padding: 15px;
}

.recruitment-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  margin-bottom: 15px;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
}

.header-info {
  flex: 1;
}

.competition-name {
  font-size: 12px;
  color: #4A90E2;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #333;
  line-height: 1.3;
}

.publisher {
  font-size: 12px;
  color: #999;
}

.item-content {
  margin-top: 10px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.skill-tag {
  font-size: 12px;
  background-color: #E8F0FE;
  color: #4A90E2;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.skill-tag.more {
  background-color: #f0f0f0;
  color: #999;
}

.progress-container {
  margin-bottom: 10px;
}

.progress-text {
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background-color: #4A90E2;
  border-radius: 4px;
}

.progress-value {
  font-size: 12px;
  color: #999;
  float: right;
}

.deadline {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 10px;
}

.talent-list {
  padding: 15px;
}

.load-more {
  text-align: center;
  padding: 15px;
  font-size: 14px;
  color: #4A90E2;
}

.no-more {
  text-align: center;
  padding: 15px;
  font-size: 14px;
  color: #9CA3AF;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  color: #4A90E2;
}

.loading-text {
  font-size: 14px;
}

.error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  color: #ff4d4f;
}

.error-text {
  font-size: 14px;
  margin-bottom: 10px;
}

.retry-btn {
  padding: 6px 12px;
  background-color: #4A90E2;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
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

.fab {
  position: fixed;
  right: 24px;
  bottom: 96px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #005bb2 0%, #1173db 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 91, 178, 0.3);
  z-index: 40;
  cursor: pointer;
}

.fab-icon {
  font-size: 28px;
  color: white;
  font-weight: 300;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 85%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 16px;
  font-weight: bold;
}

.modal-close {
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 15px 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
}

.project-item.selected {
  border-color: #4A90E2;
  background-color: #f0f7ff;
}

.project-info {
  flex: 1;
}

.project-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.project-competition {
  display: block;
  font-size: 12px;
  color: #999;
}

.project-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 18px;
  color: #4A90E2;
}

.invite-reason {
  margin-top: 15px;
  margin-bottom: 15px;
}

.reason-input {
  width: 100%;
  min-height: 80px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  outline: none;
}

.modal-footer {
  display: flex;
  gap: 15px;
  padding: 0 0 15px;
}

.btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.confirm-btn {
  background-color: #4A90E2;
  color: white;
}

.confirm-btn.disabled {
  background-color: #a0c4e8;
  cursor: not-allowed;
}

.empty-projects {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.filter-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.filter-option.active {
  color: #4A90E2;
}

.clear-filter {
  text-align: center;
  padding: 15px 0;
  color: #ff4d4f;
  cursor: pointer;
}
</style>
