<template>
  <view class="chat-container">
    <!-- 聊天内容区域 -->
    <scroll-view class="chat-content" scroll-y>
      <view class="message-item" v-for="(message, index) in messages" :key="index" :class="{ 'my-message': message.isMine }">
        <image v-if="!message.isMine" :src="message.avatar" mode="aspectFill" class="avatar" />
        <view class="message-bubble" :class="{ 'my-bubble': message.isMine }">
          <text class="message-text">{{ message.content }}</text>
          <text class="message-time">{{ message.time }}</text>
        </view>
        <image v-if="message.isMine" :src="myInfo.avatar" mode="aspectFill" class="avatar" />
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <text class="emoji-btn">😊</text>
      <input type="text" placeholder="输入消息..." class="input" v-model="inputText" />
      <text class="image-btn">📷</text>
      <text class="send-btn" @click="sendMessage">发送</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const chatId = route.query.id;

// 模拟我的信息
const myInfo = ref({
  name: '张三',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square'
});

// 模拟聊天数据
const messages = ref([
  {
    id: 1,
    content: '你好，我对你们的项目很感兴趣',
    time: '10:30',
    isMine: false,
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square'
  },
  {
    id: 2,
    content: '你好，很高兴收到你的消息！请问你对我们的项目有什么问题吗？',
    time: '10:31',
    isMine: true,
    avatar: myInfo.value.avatar
  },
  {
    id: 3,
    content: '我看到你们在招募前端开发，我有Vue开发经验，想了解一下具体的项目情况',
    time: '10:32',
    isMine: false,
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square'
  },
  {
    id: 4,
    content: '我们的项目是一个智能校园服务平台，主要功能包括校园导航、活动报名、失物招领等。我们需要前端开发人员负责页面开发和交互实现。',
    time: '10:33',
    isMine: true,
    avatar: myInfo.value.avatar
  }
]);

// 输入文本
const inputText = ref('');

// 发送消息
const sendMessage = () => {
  if (inputText.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      content: inputText.value,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      avatar: myInfo.value.avatar
    });
    inputText.value = '';
  }
};

// 页面加载时获取数据
onMounted(() => {
  // 实际项目中这里会根据id从服务器获取聊天记录
  console.log('获取聊天记录', chatId);
});
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
}

.chat-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-end;
}

.message-item.my-message {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  position: relative;
}

.message-bubble:not(.my-bubble) {
  background-color: white;
  border-bottom-left-radius: 5px;
}

.message-bubble.my-bubble {
  background-color: #4A90E2;
  color: white;
  border-bottom-right-radius: 5px;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  color: #999;
  margin-top: 5px;
  display: block;
  text-align: right;
}

.message-bubble.my-bubble .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.input-area {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #f0f0f0;
}

.emoji-btn {
  font-size: 20px;
  margin-right: 10px;
}

.input {
  flex: 1;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 14px;
}

.image-btn {
  font-size: 20px;
  margin: 0 10px;
}

.send-btn {
  color: #4A90E2;
  font-size: 14px;
  font-weight: bold;
}
</style>