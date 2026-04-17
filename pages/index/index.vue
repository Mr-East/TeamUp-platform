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
      <view class="competition-cards">
        <view class="competition-card" v-for="(item, index) in competitions" :key="index">
          <image :src="item.img" mode="aspectFill" class="card-img" />
          <view class="card-content">
            <text class="card-name">{{ item.name }}</text>
            <text class="card-title">{{ item.title }}</text>
            <text class="card-date">{{ item.date }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门招募 -->
    <view class="section">
      <view class="section-title">热门招募</view>
      <view class="recruitment-scroll">
        <scroll-view scroll-x>
          <view class="recruitment-card" v-for="(item, index) in recruitments" :key="index">
            <text class="recruitment-title">{{ item.title }}</text>
            <view class="skill-tags">
              <view class="skill-tag" v-for="(skill, idx) in item.skills" :key="idx">{{ skill }}</view>
            </view>
            <text class="recruitment-date">截止时间：{{ item.date }}</text>
            <text class="recruitment-people">人数：{{ item.people }}人</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 模拟数据
const competitions = [
  {
    title: '全国大学生互联网+创新创业大赛',
    name: '互联网+',
    date: '2026-06-30',
    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=innovation%20competition%20poster&image_size=square'
  },
  {
    title: '全国大学生数学建模竞赛',
    name: '数学建模',
    date: '2026-09-15',
    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mathematical%20modeling%20competition&image_size=square'
  },
  {
    title: '全国大学生程序设计竞赛',
    name: '程序设计',
    date: '2026-10-20',
    img: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=programming%20competition%20banner&image_size=square'
  }
];

const recruitments = [
  {
    title: '寻找前端开发队友',
    skills: ['Vue', 'React', 'JavaScript'],
    date: '2026-05-10',
    people: 2
  },
  {
    title: 'AI项目组队',
    skills: ['Python', 'TensorFlow', '机器学习'],
    date: '2026-05-15',
    people: 3
  },
  {
    title: '产品设计团队招募',
    skills: ['UI设计', '产品经理', '用户研究'],
    date: '2026-05-20',
    people: 2
  },
  {
    title: '后端开发组队',
    skills: ['Java', 'Spring Boot', '数据库'],
    date: '2026-05-25',
    people: 2
  }
];
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

.competition-cards {
  display: flex;
  justify-content: space-between;
}

.competition-card {
  width: 30%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-img {
  width: 100%;
  height: 100px;
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

.recruitment-scroll {
  width: 100%;
}

.recruitment-card {
  width: 280px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-right: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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