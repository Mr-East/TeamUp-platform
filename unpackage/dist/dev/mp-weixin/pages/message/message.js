"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const activeTab = common_vendor.ref("private");
    const privateMessages = common_vendor.ref([]);
    const systemNotifications = common_vendor.ref([]);
    const loading = common_vendor.ref({
      chats: false,
      notifications: false
    });
    const error = common_vendor.ref({
      chats: "",
      notifications: ""
    });
    common_vendor.onLoad(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      await fetchPrivateMessages();
      await fetchSystemNotifications();
    });
    common_vendor.onShow(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        await fetchPrivateMessages();
        await fetchSystemNotifications();
      }
    });
    common_vendor.watch(activeTab, async (newTab) => {
      if (newTab === "private" && privateMessages.value.length === 0) {
        await fetchPrivateMessages();
      } else if (newTab === "system" && systemNotifications.value.length === 0) {
        await fetchSystemNotifications();
      }
    });
    const fetchPrivateMessages = async () => {
      try {
        loading.value.chats = true;
        error.value.chats = "";
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/messages/chats",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          const chatsData = response.data.data || response.data || [];
          privateMessages.value = chatsData.map((chat) => {
            const otherUser = chat.otherUser || {};
            return {
              id: chat.id,
              name: otherUser.name || "未知用户",
              avatar: otherUser.avatar || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
              preview: chat.lastMessage || "暂无消息",
              time: formatTime(chat.updated_at),
              unread: chat.unreadCount || 0,
              otherUserId: otherUser.id
            };
          });
        } else {
          error.value.chats = "获取私信列表失败";
          privateMessages.value = [];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/message/message.vue:192", "获取私信列表错误:", err);
        error.value.chats = "网络错误，请稍后重试";
        privateMessages.value = [];
      } finally {
        loading.value.chats = false;
      }
    };
    const fetchSystemNotifications = async () => {
      try {
        loading.value.notifications = true;
        error.value.notifications = "";
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/notifications",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          systemNotifications.value = response.data.data.map((notification) => ({
            id: notification.id,
            title: notification.title || "系统通知",
            content: notification.content || "",
            time: formatTime(notification.created_at),
            type: notification.type || "reminder"
          }));
        } else {
          error.value.notifications = "获取系统通知失败";
          systemNotifications.value = [];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/message/message.vue:230", "获取系统通知错误:", err);
        error.value.notifications = "网络错误，请稍后重试";
        systemNotifications.value = [];
      } finally {
        loading.value.notifications = false;
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
    const goToChat = (chatId, otherUserId, name, avatar) => {
      const currentUser = common_vendor.index.getStorageSync("userInfo");
      const currentUserId = currentUser == null ? void 0 : currentUser.id;
      if (otherUserId === currentUserId) {
        common_vendor.index.showToast({
          title: "不能与自己聊天",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?chatId=${chatId}&otherUserId=${otherUserId}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar || "")}`
      });
    };
    const goToInvites = () => {
      common_vendor.index.navigateTo({
        url: "/pages/invites/invites"
      });
    };
    const markAsRead = async () => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/notifications/read_all",
          method: "PUT",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({
            title: "已全部标记为已读",
            icon: "success"
          });
          await fetchSystemNotifications();
        } else {
          common_vendor.index.showToast({
            title: "标记失败，请稍后重试",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/message/message.vue:315", "标记通知已读错误:", err);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goToInvites, "64"),
        b: activeTab.value === "private" ? 1 : "",
        c: common_vendor.o(($event) => activeTab.value = "private", "af"),
        d: activeTab.value === "system" ? 1 : "",
        e: common_vendor.o(($event) => activeTab.value = "system", "41"),
        f: activeTab.value === "private"
      }, activeTab.value === "private" ? common_vendor.e({
        g: loading.value.chats
      }, loading.value.chats ? {} : error.value.chats ? {
        i: common_vendor.t(error.value.chats),
        j: common_vendor.o(fetchPrivateMessages, "52")
      } : privateMessages.value.length === 0 ? {} : {
        l: common_vendor.f(privateMessages.value, (message, index, i0) => {
          return common_vendor.e({
            a: message.avatar,
            b: common_vendor.t(message.name),
            c: common_vendor.t(message.time),
            d: common_vendor.t(message.preview),
            e: message.unread
          }, message.unread ? {
            f: common_vendor.t(message.unread)
          } : {}, {
            g: index,
            h: common_vendor.o(($event) => goToChat(message.id, message.otherUserId, message.name, message.avatar), index)
          });
        })
      }, {
        h: error.value.chats,
        k: privateMessages.value.length === 0
      }) : common_vendor.e({
        m: common_vendor.o(markAsRead, "e3"),
        n: loading.value.notifications
      }, loading.value.notifications ? {} : error.value.notifications ? {
        p: common_vendor.t(error.value.notifications),
        q: common_vendor.o(fetchSystemNotifications, "37")
      } : systemNotifications.value.length === 0 ? {} : {
        s: common_vendor.f(systemNotifications.value, (notification, index, i0) => {
          return common_vendor.e({
            a: notification.type === "reminder"
          }, notification.type === "reminder" ? {} : notification.type === "approval" ? {} : {}, {
            b: notification.type === "approval",
            c: common_vendor.t(notification.title),
            d: common_vendor.t(notification.time),
            e: common_vendor.t(notification.content),
            f: index
          });
        })
      }, {
        o: error.value.notifications,
        r: systemNotifications.value.length === 0
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c1b26cf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
