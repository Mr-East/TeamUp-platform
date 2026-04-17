"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const route = common_vendor.useRoute();
    const chatId = route.query.id;
    const myInfo = common_vendor.ref({
      name: "张三",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square"
    });
    const messages = common_vendor.ref([
      {
        id: 1,
        content: "你好，我对你们的项目很感兴趣",
        time: "10:30",
        isMine: false,
        avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square"
      },
      {
        id: 2,
        content: "你好，很高兴收到你的消息！请问你对我们的项目有什么问题吗？",
        time: "10:31",
        isMine: true,
        avatar: myInfo.value.avatar
      },
      {
        id: 3,
        content: "我看到你们在招募前端开发，我有Vue开发经验，想了解一下具体的项目情况",
        time: "10:32",
        isMine: false,
        avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square"
      },
      {
        id: 4,
        content: "我们的项目是一个智能校园服务平台，主要功能包括校园导航、活动报名、失物招领等。我们需要前端开发人员负责页面开发和交互实现。",
        time: "10:33",
        isMine: true,
        avatar: myInfo.value.avatar
      }
    ]);
    const inputText = common_vendor.ref("");
    const sendMessage = () => {
      if (inputText.value.trim()) {
        messages.value.push({
          id: messages.value.length + 1,
          content: inputText.value,
          time: (/* @__PURE__ */ new Date()).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          isMine: true,
          avatar: myInfo.value.avatar
        });
        inputText.value = "";
      }
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/chat/chat.vue:90", "获取聊天记录", chatId);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(messages.value, (message, index, i0) => {
          return common_vendor.e({
            a: !message.isMine
          }, !message.isMine ? {
            b: message.avatar
          } : {}, {
            c: common_vendor.t(message.content),
            d: common_vendor.t(message.time),
            e: message.isMine ? 1 : "",
            f: message.isMine
          }, message.isMine ? {
            g: myInfo.value.avatar
          } : {}, {
            h: index,
            i: message.isMine ? 1 : ""
          });
        }),
        b: inputText.value,
        c: common_vendor.o(($event) => inputText.value = $event.detail.value),
        d: common_vendor.o(sendMessage)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
