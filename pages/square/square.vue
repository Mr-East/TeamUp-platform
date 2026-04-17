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

    <!-- 筛选栏 -->
    <view class="filter-bar" v-if="activeTab === 'team'">
      <view class="filter-item">
        <text>竞赛类型</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item">
        <text>技能标签</text>
        <text class="arrow">▼</text>
      </view>
      <view class="filter-item">
        <text>截止时间</text>
        <text class="arrow">▼</text>
      </view>
    </view>

    <!-- 组队广场列表 -->
    <view v-if="activeTab === 'team'" class="recruitment-list">
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
            <view class="skill-tag" v-for="(skill, idx) in item.skills" :key="idx">{{ skill }}</view>
          </view>
          <view class="progress-container">
            <text class="progress-text">人数进度</text>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: item.progress + '%' }"></view>
            </view>
            <text class="progress-value">{{ item.joined }}/{{ item.total }}</text>
          </view>
          <text class="deadline">截止时间：{{ item.deadline }}</text>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" @click="loadMore">
        <text>加载更多</text>
      </view>
    </view>

    <!-- 人才广场列表 -->
    <view v-else class="talent-list">
      <TalentCard
        v-for="(talent, index) in talents"
        :key="index"
        :id="talent.id"
        :avatar="talent.avatar"
        :name="talent.name"
        :major="talent.major"
        :intro="talent.intro"
        :skills="talent.skills"
        :competition-types="talent.competitionTypes"
        @invite="inviteTeam"
        @greet="greet"
      />

      <!-- 加载更多 -->
      <view class="load-more" @click="loadMoreTalent">
        <text>加载更多</text>
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
import TalentCard from '../../components/TalentCard/TalentCard.vue';

// 标签状态
const activeTab = ref('team');

// 切换标签
const switchTab = (tab) => {
  activeTab.value = tab;
};

// 模拟数据 - 组队广场
const recruitments = [
  {
    id: 1,
    title: '寻找前端开发队友参加互联网+大赛',
    name: '互联网+',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square',
    publisher: '张三',
    publisherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
    college: '计算机学院',
    description: '我们正在组建团队参加全国大学生互联网+创新创业大赛，需要前端开发人员。项目是一个智能校园服务平台，主要功能包括校园导航、活动报名、失物招领等。希望有Vue或React开发经验的同学加入我们。',
    skills: ['Vue', 'React', 'JavaScript', 'CSS', 'HTML'],
    progress: 60,
    joined: 3,
    total: 5,
    deadline: '2026-05-10',
    members: [
      { name: '张三', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square' },
      { name: '李四', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square' },
      { name: '王五', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square' }
    ],
    comments: [
      {
        name: '赵六',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        content: '这个项目看起来很有意思，我有Vue开发经验，希望能加入',
        time: '2026-04-10 10:00',
        likes: 5,
        replies: []
      },
      {
        name: '钱七',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square',
        content: '我对这个项目很感兴趣，请问还需要人吗？',
        time: '2026-04-11 14:30',
        likes: 3,
        replies: [
          { content: '还需要的，欢迎加入！' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'AI项目组队，寻找机器学习专家',
    name: '人工智能挑战赛',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20project%20logo&image_size=square',
    publisher: '李四',
    publisherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square',
    college: '人工智能学院',
    description: '我们正在开发一个基于深度学习的图像识别系统，用于校园场景的智能分析。项目需要机器学习算法工程师，熟悉Python和TensorFlow优先。',
    skills: ['Python', 'TensorFlow', '机器学习', '深度学习'],
    progress: 40,
    joined: 2,
    total: 5,
    deadline: '2026-05-15',
    members: [
      { name: '李四', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square' },
      { name: '孙八', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square' }
    ],
    comments: [
      {
        name: '周九',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
        content: '我有TensorFlow项目经验，想加入团队',
        time: '2026-04-12 09:00',
        likes: 8,
        replies: []
      }
    ]
  },
  {
    id: 3,
    title: '产品设计团队招募UI设计师',
    name: '产品设计大赛',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20design%20logo&image_size=square',
    publisher: '王五',
    publisherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
    college: '设计学院',
    description: '我们需要一名UI设计师加入产品设计团队，负责APP界面设计和交互优化。有Figma或Sketch经验优先。',
    skills: ['UI设计', '产品经理', '用户研究', 'Figma'],
    progress: 75,
    joined: 3,
    total: 4,
    deadline: '2026-05-20',
    members: [
      { name: '王五', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square' },
      { name: '吴六', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square' },
      { name: '郑七', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square' }
    ],
    comments: []
  },
  {
    id: 4,
    title: '后端开发组队，需要Java工程师',
    name: '程序设计竞赛',
    logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=backend%20development%20logo&image_size=square',
    publisher: '赵六',
    publisherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square',
    college: '软件学院',
    description: '我们正在开发一个校园社交平台，需要后端开发工程师。熟悉Java、Spring Boot和数据库设计优先。',
    skills: ['Java', 'Spring Boot', '数据库', 'MySQL'],
    progress: 50,
    joined: 2,
    total: 4,
    deadline: '2026-05-25',
    members: [
      { name: '赵六', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square' },
      { name: '陈八', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square' }
    ],
    comments: []
  }
];

// 模拟数据 - 人才广场
const talents = [
  {
    id: 1,
    name: '张三',
    major: '计算机科学 · 2024届',
    intro: '专注于AI界面设计，想加入国赛团队。',
    skills: ['UI/UX', '前端开发', 'Figma'],
    competitionTypes: ['互联网+', '挑战杯', 'AI创新大赛'],
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square'
  },
  {
    id: 2,
    name: '王五',
    major: '数字媒体艺术 · 2024届',
    intro: '擅长3D设计与品牌视觉创作。',
    skills: ['3D Design', 'Branding'],
    competitionTypes: ['大广赛', '产品设计大赛', '视觉传达设计大赛'],
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square'
  },
  {
    id: 3,
    name: '孙七',
    major: '市场营销 · 2026届',
    intro: '热衷于市场策划与文案创作。',
    skills: ['Marketing', 'Copywriting'],
    competitionTypes: ['互联网+', '营销策划大赛', '创新创业大赛'],
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square'
  }
];

// 跳转到招募详情页
const goToDetail = (id) => {
  const recruitment = recruitments.find(item => item.id === id);
  if (recruitment) {
    const dataStr = encodeURIComponent(JSON.stringify(recruitment));
    uni.navigateTo({
      url: `/pages/recruitment-detail/recruitment-detail?data=${dataStr}`
    });
  }
};

// 邀请组队
const inviteTeam = (id) => {
  console.log('邀请组队', id);
};

// 打个招呼
const greet = (id) => {
  console.log('打个招呼', id);
};

// 加载更多组队信息
const loadMore = () => {
  // 模拟加载更多数据
  console.log('加载更多组队信息');
};

// 加载更多人才信息
const loadMoreTalent = () => {
  // 模拟加载更多数据
  console.log('加载更多人才信息');
};

// 跳转到发布页面
const goToPublish = () => {
  uni.navigateTo({
    url: '/pages/publish/recruit-teammate'
  });
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

.talent-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.talent-header {
  display: flex;
  margin-bottom: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.major {
  font-size: 12px;
  color: #999;
}

.intro {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  color: #333;
}

.action-buttons {
  display: flex;
  margin-top: 15px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  text-align: center;
  margin-right: 10px;
  font-size: 14px;
  cursor: pointer;
}

.action-btn:last-child {
  margin-right: 0;
}

.action-btn.invite {
  background-color: #4A90E2;
  color: white;
}

.action-btn.greet {
  background-color: #f0f0f0;
  color: #333;
}

.btn-text {
  color: inherit;
}

.load-more {
  text-align: center;
  padding: 15px;
  font-size: 14px;
  color: #4A90E2;
}

/* 悬浮发布按钮 */
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
</style>