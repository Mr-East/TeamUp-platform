"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const userInfo = common_vendor.ref({
      name: "张三",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
      college: "计算机学院",
      skills: ["Vue", "JavaScript", "Java", "Python"],
      notification: true
    });
    const editSkills = () => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:104", "编辑技能");
    };
    const addSkill = () => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:109", "添加技能");
    };
    const getSkillColor = (index) => {
      const colors = ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B"];
      return colors[index % colors.length];
    };
    const goToPrivacy = () => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:125", "跳转到编辑信息页面");
      common_vendor.index.navigateTo({
        url: "/pages/profile/edit-profile"
      });
    };
    const toggleNotification = () => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:133", "切换通知状态", userInfo.value.notification);
    };
    const logout = () => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:138", "退出登录");
    };
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatar,
        b: common_vendor.t(userInfo.value.name),
        c: common_vendor.t(userInfo.value.college),
        d: common_vendor.o(editSkills),
        e: common_vendor.f(userInfo.value.skills, (skill, index, i0) => {
          return {
            a: getSkillColor(index),
            b: common_vendor.t(skill),
            c: index
          };
        }),
        f: common_vendor.o(addSkill),
        g: common_vendor.o(goToPrivacy),
        h: userInfo.value.notification ? 1 : "",
        i: common_vendor.o(($event) => userInfo.value.notification = !userInfo.value.notification),
        j: common_vendor.o(toggleNotification),
        k: common_vendor.o(logout)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
