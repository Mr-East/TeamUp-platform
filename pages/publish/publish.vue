<template>
  <view class="publish-container">
    <!-- 顶部标签切换 -->
    <view class="tab-bar">
      <view class="tab-item" :class="{ active: activeTab === 'recruit' }" @click="activeTab = 'recruit'">
        <text class="tab-text">招队友</text>
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'join' }" @click="activeTab = 'join'">
        <text class="tab-text">求组队</text>
      </view>
    </view>

    <!-- 招队友模式 -->
    <view v-if="activeTab === 'recruit'" class="form-container">
      <view class="form-item">
        <text class="form-label">竞赛名称</text>
        <input type="text" placeholder="请输入竞赛名称" class="form-input" v-model="recruitForm.competitionName" />
      </view>

      <view class="form-item">
        <text class="form-label">项目简介</text>
        <textarea placeholder="请输入项目简介" class="form-textarea" v-model="recruitForm.description"></textarea>
      </view>

      <view class="form-item">
        <text class="form-label">所需技能标签</text>
        <view class="skill-tags">
          <view class="skill-tag" v-for="(skill, index) in recruitForm.skills" :key="index">
            <text>{{ skill }}</text>
            <text class="remove-skill" @click="removeSkill(index)">×</text>
          </view>
          <view class="add-skill" @click="showSkillPicker">
            <text>+ 添加技能</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">截止时间</text>
        <input type="date" class="form-input" v-model="recruitForm.deadline" />
      </view>

      <view class="form-item">
        <text class="form-label">上传封面</text>
        <view class="upload-area" @click="uploadCover">
          <text class="upload-icon">📷</text>
          <text class="upload-text">点击上传封面</text>
          <image v-if="recruitForm.cover" :src="recruitForm.cover" mode="aspectFill" class="cover-preview" />
        </view>
      </view>

      <view class="submit-btn" @click="publishRecruit">
        <text class="submit-text">发布招募</text>
      </view>
    </view>

    <!-- 求组队模式 -->
    <view v-else class="form-container">
      <view class="form-item">
        <text class="form-label">目标竞赛</text>
        <input type="text" placeholder="请输入目标竞赛" class="form-input" v-model="joinForm.competitionName" />
      </view>

      <view class="form-item">
        <text class="form-label">我的技能标签</text>
        <view class="skill-tags">
          <view class="skill-tag" v-for="(skill, index) in joinForm.skills" :key="index">
            <text>{{ skill }}</text>
            <text class="remove-skill" @click="removeJoinSkill(index)">×</text>
          </view>
          <view class="add-skill" @click="showJoinSkillPicker">
            <text>+ 添加技能</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">期望队伍类型</text>
        <input type="text" placeholder="请输入期望队伍类型" class="form-input" v-model="joinForm.teamType" />
      </view>

      <view class="submit-btn" @click="publishJoin">
        <text class="submit-text">发布求组队信息</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 激活的标签
const activeTab = ref('recruit');

// 招队友表单数据
const recruitForm = ref({
  competitionName: '',
  description: '',
  skills: [],
  deadline: '',
  cover: ''
});

// 求组队表单数据
const joinForm = ref({
  competitionName: '',
  skills: [],
  teamType: ''
});

// 移除技能标签
const removeSkill = (index) => {
  recruitForm.value.skills.splice(index, 1);
};

const removeJoinSkill = (index) => {
  joinForm.value.skills.splice(index, 1);
};

// 显示技能选择器
const showSkillPicker = () => {
  // 实际项目中这里会显示技能选择器
  // 这里模拟添加技能
  recruitForm.value.skills.push('Vue');
};

const showJoinSkillPicker = () => {
  // 实际项目中这里会显示技能选择器
  // 这里模拟添加技能
  joinForm.value.skills.push('JavaScript');
};

// 上传封面
const uploadCover = () => {
  // 实际项目中这里会调用上传接口
  // 这里模拟上传
  recruitForm.value.cover = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=project%20cover%20design&image_size=landscape_16_9';
};

// 发布招募
const publishRecruit = () => {
  console.log('发布招募', recruitForm.value);
  // 实际项目中这里会调用发布接口
};

// 发布求组队信息
const publishJoin = () => {
  console.log('发布求组队信息', joinForm.value);
  // 实际项目中这里会调用发布接口
};
</script>

<style scoped>
.publish-container {
  padding-bottom: 20px;
}

.tab-bar {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  padding: 15px;
  text-align: center;
  position: relative;
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

.form-container {
  padding: 20px;
  background-color: #f8f8f8;
}

.form-item {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.form-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.form-input {
  width: 100%;
  font-size: 14px;
  border: none;
  outline: none;
  padding: 5px 0;
}

.form-textarea {
  width: 100%;
  font-size: 14px;
  border: none;
  outline: none;
  padding: 5px 0;
  resize: none;
  min-height: 100px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.skill-tag {
  display: flex;
  align-items: center;
  background-color: #E8F0FE;
  color: #4A90E2;
  padding: 5px 12px;
  border-radius: 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 12px;
}

.remove-skill {
  margin-left: 5px;
  font-size: 14px;
  cursor: pointer;
}

.add-skill {
  display: flex;
  align-items: center;
  padding: 5px 12px;
  border: 1px dashed #999;
  border-radius: 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
}

.upload-area {
  width: 100%;
  height: 150px;
  border: 1px dashed #999;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 14px;
  color: #999;
}

.cover-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.submit-btn {
  background-color: #4A90E2;
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.submit-text {
  color: white;
}
</style>