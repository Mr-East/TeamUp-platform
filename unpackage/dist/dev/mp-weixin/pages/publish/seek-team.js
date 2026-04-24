"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "seek-team",
  setup(__props) {
    const showSuccess = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      targetTrack: "",
      skills: [],
      bio: ""
    });
    common_vendor.onLoad((options) => {
      common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:124", "页面加载，接收到的参数：", options);
      if (options.edit === "true" && options.postData) {
        try {
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:127", "开始解析帖子数据...");
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:128", "postData原始值：", options.postData);
          const decodedData = decodeURIComponent(options.postData);
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:130", "解码后的数据：", decodedData);
          const postData = JSON.parse(decodedData);
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:132", "解析后的数据：", postData);
          formData.targetTrack = postData.targetTrack || postData.title || "";
          formData.skills = postData.skills || [];
          formData.bio = postData.bio || "";
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:137", "编辑模式加载成功，表单数据：", formData);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/publish/seek-team.vue:139", "解析帖子数据失败", e);
        }
      }
    });
    const userInfo = {
      name: "张梦颖",
      role: "UI/UX Designer",
      school: "清华大学 · 交互设计",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square"
    };
    const switchToRecruit = () => {
      common_vendor.index.redirectTo({
        url: "/pages/publish/recruit-teammate"
      });
    };
    const removeSkill = (index) => {
      formData.skills.splice(index, 1);
    };
    const showSkillPicker = () => {
      common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:166", "选择技能标签");
    };
    const submitForm = async () => {
      var _a;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          return;
        }
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/talent-profiles",
          method: "POST",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            targetTrack: formData.targetTrack,
            skills: formData.skills,
            bio: formData.bio
          }
        });
        if (response.data && response.data.success) {
          showSuccess.value = true;
          setTimeout(() => {
            showSuccess.value = false;
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: ((_a = response.data) == null ? void 0 : _a.message) || "发布失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/publish/seek-team.vue:201", "发布失败", error);
        common_vendor.index.showToast({ title: "发布失败，请重试", icon: "none" });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(switchToRecruit, "24"),
        b: formData.targetTrack,
        c: common_vendor.o(($event) => formData.targetTrack = $event.detail.value, "29"),
        d: common_vendor.f(formData.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        e: common_vendor.o(showSkillPicker, "fa"),
        f: common_vendor.t(formData.bio.length),
        g: formData.bio,
        h: common_vendor.o(($event) => formData.bio = $event.detail.value, "d7"),
        i: userInfo.avatar,
        j: common_vendor.t(userInfo.name),
        k: common_vendor.t(userInfo.role),
        l: common_vendor.t(userInfo.school),
        m: common_vendor.t(formData.bio || "正在输入个人简介..."),
        n: common_vendor.f(formData.skills, (skill, idx, i0) => {
          return {
            a: common_vendor.t(skill),
            b: idx
          };
        }),
        o: common_vendor.o(submitForm, "2d"),
        p: showSuccess.value
      }, showSuccess.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9520fa2f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/seek-team.js.map
