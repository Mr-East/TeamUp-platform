<template>
  <view class="index-container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <input type="text" placeholder="搜索竞赛 / 技能 / 队伍" class="input" />
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner">
      <swiper autoplay indicator-dots>
        <swiper-item>
          <image src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20competition%20banner%20design%20with%20modern%20style&image_size=landscape_16_9" mode="aspectFill" class="banner-img" />
        </swiper-item>
        <swiper-item>
          <image src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20team%20building%20event%20promotion&image_size=landscape_16_9" mode="aspectFill" class="banner-img" />
        </swiper-item>
        <swiper-item>
          <image src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tech%20competition%20announcement%20banner&image_size=landscape_16_9" mode="aspectFill" class="banner-img" />
        </swiper-item>
      </swiper>
    </view>

    <!-- 官方竞赛推荐 -->
    <view class="section">
      <view class="section-title">官方竞赛推荐</view>
      <view class="competition-scroll">
        <scroll-view scroll-x show-scrollbar="false" enable-flex>
          <view class="competition-cards-container">
            <view class="competition-card" v-for="(item, index) in competitions" :key="index" @click="goToCompetition(item)">
              <image :src="item.img" mode="aspectFill" class="card-img" />
              <view class="card-content">
                <text class="card-name">{{ item.name }}</text>
                <text class="card-title">{{ item.title }}</text>
                <text class="card-date">截止：{{ formatDate(item.date) }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 热门招募 -->
    <view class="section">
      <view class="section-title">热门招募</view>
      <view class="recruitment-list">
        <view class="recruitment-card" v-for="(item, index) in displayRecruitments" :key="index" @click="goToRecruitment(item)">
          <text class="recruitment-title">{{ item.title }}</text>
          <view class="skill-tags">
            <view class="skill-tag" v-for="(skill, idx) in (item.skills || []).slice(0, 3)" :key="idx">{{ skill }}</view>
          </view>
          <text class="recruitment-date">截止时间：{{ formatDate(item.date) }}</text>
          <text class="recruitment-people">招募人数：{{ item.people || 0 }}人</text>
        </view>
        <view v-if="recruitments.length > 3" class="load-more-btn" @click="showAllRecruitments">
          <text class="load-more-text">{{ showAll ? '收起' : '加载更多' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// 检查登录状态
onMounted(() => {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    });
  }

  // 加载数据
  fetchCompetitions();
  fetchRecruitments();
});

// 竞赛数据
const competitions = ref([]);

// 招募数据
const recruitments = ref([]);

// 招募显示控制
const showAll = ref(false);
const displayRecruitments = computed(() => {
  return showAll.value ? recruitments.value : recruitments.value.slice(0, 3);
});

const showAllRecruitments = () => {
  showAll.value = !showAll.value;
};

// 获取竞赛数据
const fetchCompetitions = async () => {
  try {
    const response = await uni.request({
      url: 'http://localhost:3000/api/competitions',
      method: 'GET'
    });

    if (response.data && response.data.success) {
      competitions.value = response.data.data.map(comp => ({
        id: comp.id,
        name: comp.name,
        title: comp.name,
        date: comp.deadline,
        img: comp.image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20poster&image_size=square',
        description: comp.description,
        type: comp.type,
        level: comp.level,
        organization: comp.organization
      }));
    }
  } catch (err) {
    console.error('获取竞赛数据错误:', err);
  }
};

// 获取招募数据
const fetchRecruitments = async () => {
  try {
    const token = uni.getStorageSync('token');
    const response = await uni.request({
      url: 'http://localhost:3000/api/projects',
      method: 'GET',
      header: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (response.data && response.data.success) {
      const projects = response.data.data.projects || [];
      recruitments.value = projects.map(proj => ({
        id: proj.id,
        title: proj.title,
        skills: proj.skills || [],
        date: proj.deadline,
        people: proj.peopleNeeded,
        status: proj.status,
        creatorName: proj.creator?.name
      }));
    }
  } catch (err) {
    console.error('获取招募数据错误:', err);
  }
};

// 跳转到竞赛详情
const goToCompetition = (competition) => {
  // 暂时跳转到广场页面，因为竞赛详情页面不存在
  uni.navigateTo({
    url: `/pages/square/square?id=${competition.id}&data=${encodeURIComponent(JSON.stringify(competition))}`
  });
};

// 跳转到招募详情
const goToRecruitment = (recruitment) => {
  uni.navigateTo({
    url: `/pages/recruitment-detail/recruitment-detail?id=${recruitment.id}&data=${encodeURIComponent(JSON.stringify(recruitment))}`
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
.index-container {
  padding-bottom: 60px;
}

.search-bar {
  padding: 10px;
  background-color: #4A90E2;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  padding: 8px 15px;
}

.search-icon {
  margin-right: 10px;
  font-size: 16px;
}

.input {
  flex: 1;
  font-size: 14px;
  border: none;
  outline: none;
}

.banner {
  width: 100%;
  height: 200px;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.section {
  margin-top: 20px;
  padding: 0 15px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.competition-scroll {
  width: 100%;
  margin-bottom: 20px;
}

.competition-cards-container {
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;
}

.competition-card {
  width: calc(50% - 7.5px);
  min-width: 180px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-right: 15px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.competition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.card-img {
  width: 100%;
  height: 120px;
}

.card-content {
  padding: 10px;
}

.card-name {
  font-size: 12px;
  color: #4A90E2;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #333;
  line-height: 1.3;
}

.card-date {
  font-size: 12px;
  color: #999;
}

.recruitment-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recruitment-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.load-more-btn {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
}

.load-more-text {
  color: #4A90E2;
  font-size: 14px;
  font-weight: 500;
}

.recruitment-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  display: block;
  color: #333;
  line-height: 1.4;
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
  padding: 4px 10px;
  border-radius: 15px;
  margin-right: 8px;
  margin-bottom: 8px;
  font-weight: 500;
}

.recruitment-date {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.recruitment-people {
  font-size: 13px;
  color: #666;
  display: block;
}
</style>