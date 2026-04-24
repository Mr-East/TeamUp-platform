<template>
  <view class="talent-card">
    <view class="talent-header">
      <image :src="avatar" mode="aspectFill" class="avatar" @click="handleAvatarClick" />
      <view class="header-info">
        <text class="name">{{ name }}</text>
        <text class="major">{{ major }}</text>
        <view class="competition-tags" v-if="competitionTypes && competitionTypes.length > 0">
          <view class="competition-tag" v-for="(type, idx) in competitionTypes" :key="idx">
            <text>{{ type }}</text>
          </view>
        </view>
      </view>
    </view>

    <text class="intro">{{ intro }}</text>

    <view class="skill-tags">
      <view class="skill-tag" v-for="(skill, idx) in skills" :key="idx">
        <text>{{ skill }}</text>
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

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #333;
}

.major {
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 5px;
}

.competition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.competition-tag {
  font-size: 10px;
  background-color: #FFF3CD;
  color: #856404;
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid #FFEEBA;
}

.intro {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  color: #333;
  display: block;
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
</style>
