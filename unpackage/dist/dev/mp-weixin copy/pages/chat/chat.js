"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const chatId = common_vendor.ref("");
    const chatName = common_vendor.ref("");
    const chatAvatar = common_vendor.ref("");
    const isOnline = common_vendor.ref(false);
    const otherUserId = common_vendor.ref(null);
    const myInfo = common_vendor.ref({
      id: null,
      name: "我",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square"
    });
    const messages = common_vendor.ref([]);
    const inputText = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const fetchChatMessages = async () => {
      var _a, _b, _c, _d;
      try {
        loading.value = true;
        const token = common_vendor.index.getStorageSync("token");
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          myInfo.value.id = userInfo.id;
          myInfo.value.name = userInfo.name || "我";
          myInfo.value.avatar = userInfo.avatar || myInfo.value.avatar;
        }
        if (chatId.value) {
          const response = await common_vendor.index.request({
            url: `http://localhost:3000/api/messages/chat/${chatId.value}`,
            method: "GET",
            header: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.data && response.data.success) {
            const msgs = response.data.data || [];
            messages.value = msgs.map((msg) => {
              var _a2;
              return {
                id: msg.id,
                content: msg.content,
                time: formatTime(msg.created_at),
                isMine: msg.senderId === myInfo.value.id,
                avatar: msg.senderId === myInfo.value.id ? myInfo.value.avatar || myInfo.value.avatar : ((_a2 = msg.sender) == null ? void 0 : _a2.avatar) || chatAvatar.value || myInfo.value.avatar,
                senderId: msg.senderId,
                receiverId: msg.receiverId
              };
            });
            if (msgs.length > 0) {
              const lastMsg = msgs[msgs.length - 1];
              if (lastMsg.senderId === myInfo.value.id) {
                chatAvatar.value = ((_a = lastMsg.receiver) == null ? void 0 : _a.avatar) || chatAvatar.value;
                chatName.value = ((_b = lastMsg.receiver) == null ? void 0 : _b.name) || chatName.value;
                otherUserId.value = lastMsg.receiverId;
              } else {
                chatAvatar.value = ((_c = lastMsg.sender) == null ? void 0 : _c.avatar) || chatAvatar.value;
                chatName.value = ((_d = lastMsg.sender) == null ? void 0 : _d.name) || chatName.value;
                otherUserId.value = lastMsg.senderId;
              }
            }
          } else {
            common_vendor.index.showToast({
              title: "获取消息失败",
              icon: "none"
            });
          }
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:123", "获取聊天消息错误:", err);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const sendMessage = async () => {
      if (inputText.value.trim() && otherUserId.value) {
        try {
          const token = common_vendor.index.getStorageSync("token");
          const response = await common_vendor.index.request({
            url: "http://localhost:3000/api/messages/send",
            method: "POST",
            header: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            data: {
              receiverId: otherUserId.value,
              content: inputText.value.trim()
            }
          });
          if (response.data && response.data.success) {
            const newMsg = response.data.data;
            messages.value.push({
              id: newMsg.id,
              content: newMsg.content,
              time: formatTime(newMsg.created_at),
              isMine: true,
              avatar: myInfo.value.avatar,
              senderId: newMsg.senderId,
              receiverId: newMsg.receiverId
            });
            if (newMsg.chatId && !chatId.value) {
              chatId.value = newMsg.chatId;
            }
            inputText.value = "";
          } else {
            common_vendor.index.showToast({
              title: "发送失败",
              icon: "none"
            });
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/chat/chat.vue:176", "发送消息错误:", err);
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      } else if (!otherUserId.value) {
        common_vendor.index.showToast({
          title: "无法发送消息",
          icon: "none"
        });
      }
    };
    const formatTime = (timeString) => {
      if (!timeString)
        return "";
      const date = new Date(timeString);
      const now = /* @__PURE__ */ new Date();
      const diffTime = now - date;
      const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
      if (diffDays === 0) {
        return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
      } else if (diffDays === 1) {
        return "昨天";
      } else if (diffDays < 7) {
        const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        return weekdays[date.getDay()];
      } else {
        return date.toLocaleDateString("zh-CN");
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onLoad(async (options) => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      if (options.chatId) {
        chatId.value = options.chatId;
      }
      if (options.name) {
        chatName.value = options.name;
      }
      if (options.avatar) {
        chatAvatar.value = options.avatar;
      }
      if (options.otherUserId) {
        otherUserId.value = parseInt(options.otherUserId);
      }
      await fetchChatMessages();
    });
    common_vendor.onShow(async () => {
      if (chatId.value) {
        await fetchChatMessages();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(chatName.value),
        b: isOnline.value
      }, isOnline.value ? {} : {}, {
        c: common_vendor.o(goBack, "ff"),
        d: common_vendor.f(messages.value, (message, index, i0) => {
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
            g: message.avatar
          } : {}, {
            h: index,
            i: message.isMine ? 1 : ""
          });
        }),
        e: common_vendor.o(sendMessage, "84"),
        f: inputText.value,
        g: common_vendor.o(($event) => inputText.value = $event.detail.value, "31"),
        h: common_vendor.o(sendMessage, "77")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
