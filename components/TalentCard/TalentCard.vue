<template>
  <view class="talent-card">
    <view class="talent-card-bg"></view>
    <view class="talent-content">
      <view class="talent-user">
        <view class="talent-avatar-wrapper">
          <image :src="avatar" mode="aspectFill" class="talent-avatar" @click="handleAvatarClick" />
          <view class="online-indicator"></view>
        </view>
        <view class="talent-user-info">
          <view class="talent-name-row">
            <text class="talent-name">{{ name }}</text>
          </view>
          <text class="talent-school">{{ major }}</text>
        </view>
        <view class="talent-status">
          <text class="status-text">寻找中</text>
        </view>
      </view>
      <view class="talent-track" v-if="targetTrack">
        <text class="track-label">意向赛道：</text>
        <text class="track-value">{{ targetTrack }}</text>
      </view>
      <text class="talent-bio">"{{ intro }}"</text>
      <view class="talent-footer">
        <view class="talent-skill-tags">
          <view class="skill-tag" v-for="(skill, idx) in skills" :key="idx">
            <text>{{ skill }}</text>
          </view>
          <text class="no-skills" v-if="skills.length === 0">待添加技能标签</text>
        </view>
      </view>
      <view class="action-buttons">
        <view class="action-btn invite" @click="handleInvite">
          <text class="btn-text">邀请组队</text>
        </view>
        <view class="action-btn greet" @click="handleGreet">
          <text class="btn-text">打个招呼</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  avatar: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  skills: {
    type: Array,
    required: true
  },
  targetTrack: {
    type: String,
    default: ''
  },
  competitionTypes: {
    type: Array,
    default: () => []
  },
  id: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['invite', 'greet', 'avatar-click']);

const handleInvite = () => {
  emit('invite', props.id);
};

const handleGreet = () => {
  emit('greet', props.id);
};

const handleAvatarClick = () => {
  emit('avatar-click', props.id);
};
</script>

<style scoped>
.talent-card {
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(63, 142, 247, 0.06);
}

.talent-card-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 128px;
  height: 128px;
  background: rgba(74, 144, 226, 0.05);
  border-radius: 50%;
  filter: blur(48px);
}

.talent-content {
  position: relative;
  z-index: 1;
}

.talent-user {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.talent-avatar-wrapper {
  position: relative;
  margin-right: 16px;
}

.talent-avatar {
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

.talent-user-info {
  flex: 1;
}

.talent-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.talent-name {
  font-size: 16px;
  font-weight: bold;
  color: #191c1e;
}

.talent-school {
  font-size: 10px;
  color: #4A90E2;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.talent-status {
  background-color: rgba(107, 251, 203, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.status-text {
  font-size: 10px;
  font-weight: bold;
  color: #006c52;
}

.talent-bio {
  font-size: 12px;
  color: #414753;
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 16px;
  display: block;
}

.talent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f2f4f7;
  margin-bottom: 16px;
}

.talent-skill-tags {
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

/* 预览卡片样式 */
.talent-track {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 12px;
  background-color: #f2f4f7;
  border-radius: 8px;
}

.track-label {
  font-size: 12px;
  color: #717784;
  font-weight: bold;
}

.track-value {
  font-size: 12px;
  color: #4A90E2;
  font-weight: bold;
  margin-left: 4px;
}

.no-skills {
  font-size: 12px;
  color: #717784;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border-radius: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.invite {
  background: linear-gradient(135deg, #005bb2 0%, #1173db 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 91, 178, 0.2);
}

.action-btn.greet {
  background-color: #f2f4f7;
  color: #414753;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 91, 178, 0.25);
}

.action-btn.greet:hover {
  background-color: #e8f0fe;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
}

.btn-text {
  color: inherit;
}
</style>
