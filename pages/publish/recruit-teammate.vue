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
          <view class="add-skill-btn" @click="showSkillModal">
            <text class="add-icon">+</text>
            <text class="add-text">添加技能</text>
          </view>
        </view>
      </view>

    <!-- 技能选择弹窗 -->
    <view class="skill-modal" v-if="showSkillModalFlag" @click="closeSkillModal">
      <view class="skill-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择技能标签</text>
          <text class="modal-close" @click="closeSkillModal">×</text>
        </view>
        <view class="category-tabs">
          <view 
            v-for="(category, index) in skillCategories" 
            :key="index"
            :class="['category-tab', { active: currentCategoryIndex === index }]"
            @click="currentCategoryIndex = index">
            <text>{{ category }}</text>
          </view>
        </view>
        <view class="skill-grid">
          <view 
            v-for="(skill, sIndex) in skillOptions[skillCategories[currentCategoryIndex]]" 
            :key="sIndex"
            :class="['skill-item', { selected: formData.skills.includes(skill) }]"
            @click="toggleSkill(skill)">
            <text>{{ skill }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <text class="selected-count">已选 {{ formData.skills.length }}/5</text>
          <view class="confirm-btn" @click="closeSkillModal">
            <text>确定</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 赛事类型选择弹窗 -->
    <view class="skill-modal" v-if="showCompetitionModalFlag" @click="closeCompetitionModal">
      <view class="skill-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择赛事类型</text>
          <text class="modal-close" @click="closeCompetitionModal">×</text>
        </view>
        <view class="category-tabs">
          <view
            v-for="(category, index) in competitionCategories"
            :key="index"
            :class="['category-tab', { active: currentCompetitionCategoryIndex === index }]"
            @click="currentCompetitionCategoryIndex = index">
            <text>{{ category }}</text>
          </view>
        </view>
        <view class="skill-grid">
          <view
            v-for="(competition, cIndex) in competitionTypeOptions[competitionCategories[currentCompetitionCategoryIndex]]"
            :key="cIndex"
            :class="['skill-item', { selected: formData.competitionType === competition }]"
            @click="selectCompetition(competition)">
            <text>{{ competition }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <text class="selected-count">{{ formData.competitionType || '请选择赛事类型' }}</text>
          <view class="confirm-btn" @click="closeCompetitionModal">
            <text>确定</text>
          </view>
        </view>
      </view>
    </view>

      <!-- 赛事类型 -->
      <view class="form-field">
        <text class="field-label">赛事类型</text>
        <view class="field-input picker-value" @click="showCompetitionModal">
          <text>{{ formData.competitionType || '请选择赛事类型' }}</text>
        </view>
      </view>

      <!-- 截止日期和人数 -->
      <view class="form-row">
        <view class="form-field">
          <text class="field-label">招募截止日期</text>
          <picker mode="date" @change="onDateChange">
            <view class="field-input picker-value">
              <text>{{ formData.deadline || '请选择日期' }}</text>
            </view>
          </picker>
        </view>
        <view class="form-field">
          <text class="field-label">缺口人数</text>
          <view class="people-picker-container">
            <picker v-if="!showPeopleInput" mode="selector" :range="peopleOptions" @change="onPeopleChange">
              <view class="field-input picker-value">
                <text>{{ formData.people }} 人</text>
              </view>
            </picker>
            <input v-else type="number" v-model.number="formData.people" min="1" class="field-input" placeholder="请输入人数" />
            <view class="toggle-input-btn" @click="togglePeopleInput">
              <text>{{ showPeopleInput ? '选择' : '输入' }}</text>
            </view>
          </view>
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
import { onLoad } from '@dcloudio/uni-app';

const showSuccess = ref(false);
const showSkillModalFlag = ref(false);
const showCompetitionModalFlag = ref(false);
const currentCategoryIndex = ref(0);
const currentCompetitionCategoryIndex = ref(0);
const showPeopleInput = ref(false);

const formData = reactive({
  cover: '',
  competitionName: '',
  intro: '',
  skills: [],
  competitionType: '',
  deadline: '',
  people: 1,
  verificationRequired: true
});

// 页面加载时检查是否为编辑模式
onLoad((options) => {
  console.log('页面加载，接收到的参数：', options);
  if (options.edit === 'true' && options.postData) {
    try {
      console.log('开始解析帖子数据...');
      console.log('postData原始值：', options.postData);
      const decodedData = decodeURIComponent(options.postData);
      console.log('解码后的数据：', decodedData);
      const postData = JSON.parse(decodedData);
      console.log('解析后的数据：', postData);
      // 回显帖子信息
      formData.cover = postData.cover || '';
      formData.competitionName = postData.competitionName || postData.title || '';
      formData.intro = postData.intro || '';
      formData.skills = postData.skills || [];
      formData.competitionType = postData.competitionType || '';
      formData.deadline = postData.deadline || postData.date || '';
      formData.people = postData.people || 1;
      formData.verificationRequired = postData.verificationRequired !== false;
      console.log('编辑模式加载成功，表单数据：', formData);
    } catch (e) {
      console.error('解析帖子数据失败', e);
    }
  }
});

const peopleOptions = ['1 人', '2 人', '3 人', '更多'];

const competitionTypeOptions = {
  '创新创业': ['互联网+', '挑战杯', '创青春', '中国创新创业大赛', '青年红色筑梦之旅', '创业计划大赛'],
  '学科竞赛': ['数学建模', '电子设计大赛', '机械设计大赛', '程序设计大赛', '英语竞赛', '数学竞赛', '物理竞赛', '化学竞赛'],
  '技能大赛': ['职业技能大赛', '软件设计大赛', '网络安全大赛', '云计算大赛', '大数据大赛', '人工智能大赛'],
  '艺术设计': ['大广赛', '广告艺术大赛', '包装设计大赛', '环境设计大赛', '动画设计大赛', '工业设计大赛'],
  '科研项目': ['大创项目', '挑战杯学术赛道', '实验室项目', '学术论文竞赛', '暑期社会实践']
};

const competitionCategories = Object.keys(competitionTypeOptions);

// 统一筛选选项（与广场页面一致）
const filterCompetitionOptions = ['创新创业', '学科竞赛', '技能大赛', '艺术设计', '科研项目'];
const filterSkillOptions = ['Vue', 'React', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C++', 'UI设计', '产品经理', '机器学习', '数据分析', 'App开发', '微信小程序'];

const skillOptions = {
  '前端': ['Vue', 'React', 'Angular', 'JavaScript', 'TypeScript', 'HTML/CSS', '小程序开发', 'Node.js'],
  '后端': ['Python', 'Java', 'Go', 'PHP', 'C++', 'C#', 'Spring Boot', 'Django'],
  '移动端': ['Android', 'iOS', 'Flutter', 'React Native', 'Uni-app'],
  'AI/数据': ['机器学习', '深度学习', '数据分析', '数据挖掘', '计算机视觉', '自然语言处理'],
  '设计': ['UI设计', 'UX设计', '视觉设计', '产品设计', '交互设计', 'Photoshop', 'Figma'],
  '产品/运营': ['产品经理', '需求分析', '项目管理', '运营策划', '市场营销'],
  '其他': ['测试工程', 'DevOps', '云计算', '网络安全', '区块链', '硬件开发']
};

const skillCategories = Object.keys(skillOptions);

const goBack = () => {
  uni.navigateBack();
};

const switchToSeek = () => {
  uni.redirectTo({
    url: '/pages/publish/seek-team'
  });
};

const uploadCover = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      uni.showLoading({ title: '上传中...' });
      uni.uploadFile({
        url: 'http://localhost:3000/api/upload',
        filePath: tempFilePaths[0],
        name: 'file',
        header: {
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (uploadRes) => {
          uni.hideLoading();
          try {
            const data = JSON.parse(uploadRes.data);
            if (data.success) {
              formData.cover = data.data.url;
              uni.showToast({ title: '上传成功', icon: 'success' });
            } else {
              uni.showToast({ title: '上传失败', icon: 'none' });
            }
          } catch (e) {
            uni.showToast({ title: '上传失败', icon: 'none' });
          }
        },
        fail: (err) => {
          uni.hideLoading();
          uni.showToast({ title: '上传失败', icon: 'none' });
          console.error('上传失败', err);
        }
      });
    }
  });
};

const removeSkill = (index) => {
  formData.skills.splice(index, 1);
};

const showSkillModal = () => {
  showSkillModalFlag.value = true;
  currentCategoryIndex.value = 0;
};

const closeSkillModal = () => {
  showSkillModalFlag.value = false;
};

const toggleSkill = (skill) => {
  const index = formData.skills.indexOf(skill);
  if (index > -1) {
    formData.skills.splice(index, 1);
  } else {
    if (formData.skills.length < 5) {
      formData.skills.push(skill);
    } else {
      uni.showToast({ title: '最多选择5个技能', icon: 'none' });
    }
  }
};

const showCompetitionModal = () => {
  showCompetitionModalFlag.value = true;
  currentCompetitionCategoryIndex.value = 0;
};

const closeCompetitionModal = () => {
  showCompetitionModalFlag.value = false;
};

const selectCompetition = (competition) => {
  formData.competitionType = competition;
};

const togglePeopleInput = () => {
  showPeopleInput.value = !showPeopleInput.value;
};

const onPeopleChange = (e) => {
  const index = e.detail.value;
  formData.people = index + 1;
};

const onDateChange = (e) => {
  formData.deadline = e.detail.value;
};

const toggleVerification = (e) => {
  formData.verificationRequired = e.detail.value;
};

const submitForm = async () => {
  try {
    const token = uni.getStorageSync('token');
    if (!token) {
      uni.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const response = await uni.request({
      url: 'http://localhost:3000/api/projects',
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        title: formData.competitionName,
        competitionName: formData.competitionName,
        description: formData.intro,
        skills: formData.skills,
        competitionType: formData.competitionType,
        deadline: formData.deadline,
        peopleNeeded: formData.people,
        coverImage: formData.cover,
        verificationRequired: formData.verificationRequired
      }
    });

    if (response.data && response.data.success) {
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({ title: response.data?.message || '发布失败', icon: 'none' });
    }
  } catch (error) {
    console.error('发布失败', error);
    uni.showToast({ title: '发布失败，请重试', icon: 'none' });
  }
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
  text-align: left;
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
  align-items: center;
  gap: 10px;
}

.skill-tag {
  display: flex;
  align-items: center;
  background-color: #6bfbcb;
  color: #007257;
  padding: 8px 12px;
  border-radius: 8px;
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

.people-picker-container {
  position: relative;
  width: 100%;
}

.toggle-input-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #4A90E2;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  z-index: 1;
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

/* 技能选择弹窗 */
.skill-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.skill-modal-content {
  width: 100%;
  max-height: 70vh;
  background-color: white;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #191c1e;
}

.modal-close {
  font-size: 28px;
  color: #717784;
  line-height: 1;
}

.category-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.category-tab {
  padding: 8px 16px;
  background-color: #eceef1;
  border-radius: 20px;
  font-size: 14px;
  color: #717784;
  white-space: nowrap;
}

.category-tab.active {
  background-color: #4A90E2;
  color: white;
}

.skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 40vh;
  overflow-y: auto;
  padding-bottom: 20px;
}

.skill-item {
  padding: 10px 16px;
  background-color: #f0f0f0;
  border-radius: 8px;
  font-size: 14px;
  color: #191c1e;
  border: 2px solid transparent;
}

.skill-item.selected {
  background-color: #e8f0fe;
  color: #4A90E2;
  border-color: #4A90E2;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.selected-count {
  font-size: 14px;
  color: #717784;
}

.confirm-btn {
  padding: 10px 30px;
  background-color: #4A90E2;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}
</style>