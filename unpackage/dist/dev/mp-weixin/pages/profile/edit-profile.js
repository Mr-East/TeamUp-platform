"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "edit-profile",
  setup(__props) {
    const profileForm = common_vendor.ref({
      name: "张三",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
      college: "计算机学院",
      major: "Computer Science",
      skills: ["Vue", "JavaScript", "Java", "Python"],
      bio: "Finalist at the 2023 Global Hackathon. Passionate about building scalable cloud solutions and intuitive user interfaces. Looking for a hardware enthusiast for the upcoming Robotics Challenge."
    });
    const showSuccess = common_vendor.ref(false);
    common_vendor.onMounted(() => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const saveProfile = () => {
      common_vendor.index.__f__("log", "at pages/profile/edit-profile.vue:124", "保存个人资料", profileForm.value);
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
        common_vendor.index.navigateBack();
      }, 1500);
    };
    const changeAvatar = () => {
      common_vendor.index.__f__("log", "at pages/profile/edit-profile.vue:135", "更换头像");
    };
    const selectSchool = () => {
      common_vendor.index.__f__("log", "at pages/profile/edit-profile.vue:140", "选择学院");
    };
    const addSkillTag = () => {
      common_vendor.index.__f__("log", "at pages/profile/edit-profile.vue:145", "添加技能标签");
    };
    const removeSkill = (index) => {
      profileForm.value.skills.splice(index, 1);
    };
    const findSkills = () => {
      common_vendor.index.__f__("log", "at pages/profile/edit-profile.vue:155", "查找技能");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.o(saveProfile),
        c: profileForm.value.avatar,
        d: common_vendor.o(changeAvatar),
        e: profileForm.value.name,
        f: common_vendor.o(($event) => profileForm.value.name = $event.detail.value),
        g: common_vendor.t(profileForm.value.college),
        h: common_vendor.o(selectSchool),
        i: profileForm.value.major,
        j: common_vendor.o(($event) => profileForm.value.major = $event.detail.value),
        k: common_vendor.o(addSkillTag),
        l: common_vendor.f(profileForm.value.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        m: common_vendor.o(findSkills),
        n: profileForm.value.bio,
        o: common_vendor.o(($event) => profileForm.value.bio = $event.detail.value),
        p: showSuccess.value
      }, showSuccess.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4438b7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/edit-profile.js.map
