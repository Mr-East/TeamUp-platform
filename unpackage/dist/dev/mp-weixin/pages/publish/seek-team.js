"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "seek-team",
  setup(__props) {
    const showSuccess = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      targetTrack: "",
      skills: ["UI/UX Design", "React Native", "Data Analysis"],
      bio: "拥有3年大厂实习经验，擅长从0到1构建产品视觉体系，希望寻找具有强大后端支持的团队参加挑战杯..."
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
      common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:143", "选择技能标签");
    };
    const submitForm = () => {
      common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:147", "提交表单", formData);
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
        common_vendor.index.navigateBack();
      }, 1500);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(switchToRecruit),
        b: formData.targetTrack,
        c: common_vendor.o(($event) => formData.targetTrack = $event.detail.value),
        d: common_vendor.f(formData.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        e: common_vendor.o(showSkillPicker),
        f: common_vendor.t(formData.bio.length),
        g: formData.bio,
        h: common_vendor.o(($event) => formData.bio = $event.detail.value),
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
        o: common_vendor.o(submitForm),
        p: showSuccess.value
      }, showSuccess.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9520fa2f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/seek-team.js.map
