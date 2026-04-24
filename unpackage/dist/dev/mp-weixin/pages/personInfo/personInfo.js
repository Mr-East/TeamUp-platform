"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "personInfo",
  setup(__props) {
    const userInfo = common_vendor.ref({
      id: "",
      name: "默认用户",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
      college: "默认学院",
      major: "",
      bio: "",
      skills: [],
      verified: false,
      projects: []
    });
    common_vendor.ref(false);
    const loading = common_vendor.ref(true);
    common_vendor.onLoad(async (options) => {
      const userId = options.userId;
      if (userId) {
        await fetchUserInfo(userId);
      }
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const fetchUserInfo = async (userId) => {
      try {
        loading.value = true;
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/users/${userId}`,
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          userInfo.value = {
            ...response.data.data,
            skills: response.data.data.skills || [],
            projects: response.data.data.projects || []
          };
        } else {
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
          userInfo.value = {
            id: userId,
            name: "用户",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
            college: "默认学院",
            major: "",
            bio: "",
            skills: [],
            verified: false,
            projects: []
          };
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/personInfo/personInfo.vue:164", "获取用户信息错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
        userInfo.value = {
          id: userId,
          name: "默认用户",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
          college: "默认学院",
          major: "",
          bio: "",
          skills: [],
          verified: false,
          projects: []
        };
      } finally {
        loading.value = false;
      }
    };
    const getSkillColor = (index) => {
      const colors = ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B"];
      return colors[index % colors.length];
    };
    const startChat = async () => {
      if (!userInfo.value.id) {
        common_vendor.index.showToast({
          title: "用户信息错误",
          icon: "none"
        });
        return;
      }
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/messages/chats",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        let chatId = null;
        if (response.data && response.data.success) {
          const chats = response.data.data || response.data || [];
          const existingChat = chats.find((chat) => {
            return chat.otherUser && chat.otherUser.id === userInfo.value.id;
          });
          if (existingChat) {
            chatId = existingChat.id;
          }
        }
        if (!chatId) {
          common_vendor.index.showToast({
            title: "请先发送消息建立聊天",
            icon: "none"
          });
        }
        common_vendor.index.navigateTo({
          url: `/pages/chat/chat?chatId=${chatId || ""}&otherUserId=${userInfo.value.id}&name=${encodeURIComponent(userInfo.value.name)}&avatar=${encodeURIComponent(userInfo.value.avatar || "")}`
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/personInfo/personInfo.vue:236", "发起私聊错误:", err);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      }
    };
    const shareUser = () => {
      common_vendor.index.showToast({
        title: "分享功能开发中",
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack, "6d"),
        b: common_vendor.o(shareUser, "42"),
        c: userInfo.value.avatar,
        d: common_vendor.t(userInfo.value.name),
        e: userInfo.value.verified
      }, userInfo.value.verified ? {} : {}, {
        f: common_vendor.t(userInfo.value.college),
        g: userInfo.value.major
      }, userInfo.value.major ? {
        h: common_vendor.t(userInfo.value.major)
      } : {}, {
        i: common_vendor.o(startChat, "1a"),
        j: userInfo.value.bio
      }, userInfo.value.bio ? {
        k: common_vendor.t(userInfo.value.bio)
      } : {}, {
        l: common_vendor.f(userInfo.value.skills, (skill, index, i0) => {
          return {
            a: getSkillColor(index),
            b: common_vendor.t(skill),
            c: index
          };
        }),
        m: userInfo.value.skills.length === 0
      }, userInfo.value.skills.length === 0 ? {} : {}, {
        n: common_vendor.f(userInfo.value.projects, (project, index, i0) => {
          return {
            a: common_vendor.t(project.title),
            b: common_vendor.t(project.role),
            c: common_vendor.t(project.description),
            d: index
          };
        }),
        o: userInfo.value.projects.length === 0
      }, userInfo.value.projects.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0ef0eab5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/personInfo/personInfo.js.map
