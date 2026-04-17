<template>
  <view class="publish-container">
    <!-- 顶部导航栏 -->
   

    <!-- 标签切换 -->
    <view class="tab-switcher">
      <view class="tab-btn" @click="switchToRecruit">
        <text class="tab-text">招队友</text>
      </view>
      <view class="tab-btn active">
        <text class="tab-text">求组队</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <view class="form-content">
      <!-- 意向赛道 -->
      <view class="form-field">
        <text class="field-label">意向赛道 / 领域</text>
        <view class="search-input-wrapper">
          <text class="search-icon">🔍</text>
          <input type="text" v-model="formData.targetTrack" class="search-input" placeholder="搜索并指定你想加入的比赛..." />
        </view>
      </view>

      <!-- 技能标签 -->
      <view class="form-field">
        <view class="field-header">
          <text class="field-label">核心技能标签</text>
          <text class="field-hint-en">Most Wanted Skills</text>
        </view>
        <view class="skill-tags">
          <view class="skill-tag" v-for="(skill, index) in formData.skills" :key="index">
            <text class="skill-text">{{ skill }}</text>
            <text class="remove-btn" @click="removeSkill(index)">×</text>
          </view>
          <view class="add-skill-btn" @click="showSkillPicker">
            <text class="add-icon">+</text>
            <text class="add-text">添加</text>
          </view>
        </view>
      </view>

      <!-- 个人简介 -->
      <view class="form-field">
        <view class="field-header">
          <text class="field-label">个人简介 / 组队诉求</text>
          <text class="field-hint">{{ formData.bio.length }} / 500</text>
        </view>
        <textarea v-model="formData.bio" class="field-textarea" placeholder="描述你的技术栈、获奖经历以及对理想团队的期望..." rows="5"></textarea>
      </view>

      <!-- 预览卡片 -->
      <view class="preview-section">
        <view class="preview-header">
          <view class="pulse-dot"></view>
          <text class="preview-title">预览你的求组队名片</text>
        </view>
        <view class="preview-card">
          <view class="preview-card-bg"></view>
          <view class="preview-content">
            <view class="preview-user">
              <view class="preview-avatar-wrapper">
                <image :src="userInfo.avatar" mode="aspectFill" class="preview-avatar" />
                <view class="online-indicator"></view>
              </view>
              <view class="preview-user-info">
                <view class="preview-name-row">
                  <text class="preview-name">{{ userInfo.name }}</text>
                  <text class="preview-role">{{ userInfo.role }}</text>
                </view>
                <text class="preview-school">{{ userInfo.school }}</text>
              </view>
              <view class="preview-status">
                <text class="status-text">寻找中</text>
              </view>
            </view>
            <text class="preview-bio">"{{ formData.bio || '正在输入个人简介...' }}"</text>
            <view class="preview-footer">
              <view class="preview-skill-tags">
                <view class="skill-tag" v-for="(skill, idx) in formData.skills" :key="idx">
                  <text>{{ skill }}</text>
                </view>
              </view>
              <text class="preview-time">刚刚更新于人才广场</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 发布按钮 -->
      <view class="submit-section">
        <view class="submit-btn" @click="submitForm">
          <text class="submit-icon">↑</text>
          <text class="submit-text">发布名片到人才广场</text>
        </view>
        <text class="submit-hint">发布即代表您同意《学术脉搏社区准则》并承诺发布信息的真实有效性。</text>
      </view>
    </view>

    <!-- 成功提示 -->
    <view class="success-toast" v-if="showSuccess">
      <text class="success-icon">✅</text>
      <text class="success-text">发布成功！</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';

const showSuccess = ref(false);

const formData = reactive({
  targetTrack: '',
  skills: ['UI/UX Design', 'React Native', 'Data Analysis'],
  bio: '拥有3年大厂实习经验，擅长从0到1构建产品视觉体系，希望寻找具有强大后端支持的团队参加挑战杯...'
});

const userInfo = {
  name: '张梦颖',
  role: 'UI/UX Designer',
  school: '清华大学 · 交互设计',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square'
};

const goBack = () => {
  uni.navigateBack();
};

const switchToRecruit = () => {
  uni.redirectTo({
    url: '/pages/publish/recruit-teammate'
  });
};

const removeSkill = (index) => {
  formData.skills.splice(index, 1);
};

const showSkillPicker = () => {
  console.log('选择技能标签');
};

const submitForm = () => {
  console.log('提交表单', formData);
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
    uni.navigateBack();
  }, 1500);
};
</script>

<style scoped>
.publish-container {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 100px;
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

.help-btn {
  font-size: 18px;
  color: #717784;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 标签切换 */
.tab-switcher {
  display: flex;
  background-color: #eceef1;
  border-radius: 25px;
  padding: 4px;
  margin: 20px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  border-radius: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #717784;
  transition: all 0.3s;
}

.tab-btn.active {
  background-color: white;
  color: #4A90E2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 表单内容 */
.form-content {
  padding: 0 20px;
}

/* 表单字段 */
.form-field {
  margin-bottom: 24px;
}

.field-label {
  font-size: 12px;
  font-weight: bold;
  color: #717784;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
  display: block;
  padding-left: 4px;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.field-hint {
  font-size: 10px;
  color: #717784;
}

.field-hint-en {
  font-size: 10px;
  color: #717784;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  border-radius: 12px;
  padding: 0 16px;
  border: 1px solid #c1c6d5;
}

.search-icon {
  font-size: 20px;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  padding: 16px 0;
  font-size: 14px;
  color: #191c1e;
  border: none;
  outline: none;
}

.search-input:focus {
  outline: none;
}

/* 技能标签 */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
}

.skill-tag {
  display: flex;
  align-items: center;
  background-color: #6bfbcb;
  color: #007257;
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: bold;
}

.remove-btn {
  margin-left: 6px;
  font-size: 14px;
  opacity: 0.6;
  cursor: pointer;
}

.add-skill-btn {
  display: flex;
  align-items: center;
  background-color: #eceef1;
  color: #4A90E2;
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.add-icon {
  margin-right: 4px;
}

/* 文本域 */
.field-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  font-size: 14px;
  color: #191c1e;
  border: 1px solid #c1c6d5;
  outline: none;
  resize: none;
}

.field-textarea:focus {
  border-color: #4A90E2;
}

/* 预览区域 */
.preview-section {
  margin-top: 32px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: #6bfbcb;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.preview-title {
  font-size: 16px;
  font-weight: bold;
  color: #191c1e;
}

.preview-card {
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(63, 142, 247, 0.06);
}

.preview-card-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 128px;
  height: 128px;
  background: rgba(74, 144, 226, 0.05);
  border-radius: 50%;
  filter: blur(48px);
}

.preview-content {
  position: relative;
  z-index: 1;
}

.preview-user {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.preview-avatar-wrapper {
  position: relative;
  margin-right: 16px;
}

.preview-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 4px solid #f2f4f7;
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background-color: #3ED6A9;
  border-radius: 50%;
  border: 2px solid white;
}

.preview-user-info {
  flex: 1;
}

.preview-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.preview-name {
  font-size: 16px;
  font-weight: bold;
  color: #191c1e;
}

.preview-role {
  font-size: 12px;
  color: #717784;
  font-weight: normal;
}

.preview-school {
  font-size: 10px;
  color: #4A90E2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.preview-status {
  background-color: rgba(107, 251, 203, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.status-text {
  font-size: 10px;
  font-weight: bold;
  color: #006c52;
}

.preview-bio {
  font-size: 12px;
  color: #414753;
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 16px;
  display: block;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f2f4f7;
}

.preview-skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

.skill-icon-wrapper {
  width: 24px;
  height: 24px;
  background-color: rgba(74, 144, 226, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-icon {
  font-size: 12px;
}

.preview-time {
  font-size: 10px;
  color: #717784;
}

/* 提交按钮 */
.submit-section {
  padding: 16px 0;
  width: 100%;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
}

.submit-btn {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  background: linear-gradient(135deg, #005bb2 0%, #1173db 100%);
  color: white;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 91, 178, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-icon {
  font-size: 18px;
}

.submit-text {
  font-size: 16px;
  font-weight: bold;
}

.submit-hint {
  display: block;
  text-align: center;
  font-size: 11px;
  color: #717784;
  margin-top: 16px;
  padding: 0 32px;
  line-height: 1.5;
}

/* 成功提示 */
.success-toast {
  position: fixed;
  bottom: 120px;
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