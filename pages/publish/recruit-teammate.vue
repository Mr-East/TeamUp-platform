<template>
  <view class="publish-container">
    <!-- 顶部导航栏 -->
    

    <!-- 标签切换 -->
    <view class="tab-switcher">
      <view class="tab-btn active">
        <text class="tab-text">招队友</text>
      </view>
      <view class="tab-btn" @click="switchToSeek">
        <text class="tab-text">求组队</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <view class="form-content">
      <!-- 封面上传区域 -->
      <view class="cover-upload" @click="uploadCover">
        <image v-if="formData.cover" :src="formData.cover" mode="aspectFill" class="cover-img" />
        <view v-else class="upload-placeholder">
          <text class="upload-icon">📷</text>
          <text class="upload-text">上传赛事封面 / 背景</text>
        </view>
      </view>

      <!-- 赛事名称 -->
      <view class="form-field">
        <text class="field-label">赛事名称</text>
        <input type="text" v-model="formData.competitionName" class="field-input" placeholder="例如：2024 全国大学生数学建模竞赛" />
      </view>

      <!-- 项目简介 -->
      <view class="form-field">
        <text class="field-label">项目简介 & 招募要求</text>
        <textarea v-model="formData.intro" class="field-textarea" placeholder="请简要介绍项目背景，以及你对队友的具体期待（专业、技术栈、沟通习惯等）..." rows="5"></textarea>
      </view>

      <!-- 技能标签 -->
      <view class="form-field">
        <view class="field-header">
          <text class="field-label">技能标签</text>
          <text class="field-hint">最多选择 5 个</text>
        </view>
        <view class="skill-tags">
          <view class="skill-tag" v-for="(skill, index) in formData.skills" :key="index">
            <text class="skill-text">{{ skill }}</text>
            <text class="remove-btn" @click="removeSkill(index)">×</text>
          </view>
          <view class="add-skill-btn" @click="showSkillPicker">
            <text class="add-icon">+</text>
            <text class="add-text">添加技能</text>
          </view>
        </view>
      </view>

      <!-- 赛事类型 -->
      <view class="form-field">
        <text class="field-label">赛事类型</text>
        <picker mode="selector" :range="competitionTypeOptions" @change="onCompetitionTypeChange">
          <view class="field-input picker-value">
            <text>{{ formData.competitionType || '请选择赛事类型' }}</text>
          </view>
        </picker>
      </view>

      <!-- 截止日期和人数 -->
      <view class="form-row">
        <view class="form-field">
          <text class="field-label">招募截止日期</text>
          <input type="date" v-model="formData.deadline" class="field-input" />
        </view>
        <view class="form-field">
          <text class="field-label">缺口人数</text>
          <picker mode="selector" :range="peopleOptions" @change="onPeopleChange">
            <view class="field-input picker-value">
              <text>{{ formData.people }} 人</text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 实名认证开关 -->
      <view class="option-card">
        <view class="option-left">
          <text class="option-icon">✓</text>
          <view class="option-text">
            <text class="option-title">仅限实名学生申请</text>
            <text class="option-desc">开启后，非本校或未认证用户不可投递简历</text>
          </view>
        </view>
        <switch :checked="formData.verificationRequired" @change="toggleVerification" class="toggle-switch" />
      </view>

      <!-- 发布按钮 -->
      <view class="submit-section">
        <view class="submit-btn" @click="submitForm">
          <text class="submit-text">发布招募需求</text>
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
  cover: '',
  competitionName: '',
  intro: '',
  skills: ['UI/UX 设计', 'Python'],
  competitionType: '',
  deadline: '',
  people: 1,
  verificationRequired: true
});

const peopleOptions = ['1 人', '2 人', '3 人', '更多'];

const competitionTypeOptions = ['互联网+', '挑战杯', '大广赛', '数学建模', 'AI创新大赛', '产品设计大赛', '其他'];

const goBack = () => {
  uni.navigateBack();
};

const switchToSeek = () => {
  uni.redirectTo({
    url: '/pages/publish/seek-team'
  });
};

const uploadCover = () => {
  console.log('上传封面');
};

const removeSkill = (index) => {
  formData.skills.splice(index, 1);
};

const showSkillPicker = () => {
  console.log('选择技能标签');
};

const onCompetitionTypeChange = (e) => {
  const index = e.detail.value;
  formData.competitionType = competitionTypeOptions[index];
};

const onPeopleChange = (e) => {
  const index = e.detail.value;
  formData.people = index + 1;
};

const toggleVerification = (e) => {
  formData.verificationRequired = e.detail.value;
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

/* 封面上传 */
.cover-upload {
  width: 100%;
  box-sizing: border-box;
  height: 150px;
  background-color: #eceef1;
  border-radius: 12px;
  border: 2px dashed #c1c6d5;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  cursor: pointer;
}

.cover-img {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 40px;
}

.upload-text {
  font-size: 14px;
  color: #717784;
  font-weight: 500;
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

.field-input {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  font-size: 14px;
  color: #191c1e;
  border: 1px solid #c1c6d5;
  outline: none;
}

.field-input:focus {
  border-color: #4A90E2;
}

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

/* 表单行 */
.form-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field.half {
  flex: 1;
}

.picker-value {
  display: flex;
  align-items: center;
}

/* 选项卡片 */
.option-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.option-left {
  display: flex;
  align-items: center;
}

.option-icon {
  font-size: 20px;
  color: #006c52;
  margin-right: 12px;
}

.option-text {
  display: flex;
  flex-direction: column;
}

.option-title {
  font-size: 14px;
  font-weight: bold;
  color: #191c1e;
}

.option-desc {
  font-size: 11px;
  color: #717784;
}

.toggle-switch {
  transform: scale(0.8);
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
  max-width: 100%;
  box-sizing: border-box;
  padding: 20px;
  background: linear-gradient(135deg, #005bb2 0%, #1173db 100%);
  color: white;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 91, 178, 0.2);
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