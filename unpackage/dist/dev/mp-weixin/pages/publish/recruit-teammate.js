"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "recruit-teammate",
  setup(__props) {
    const showSuccess = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      cover: "",
      competitionName: "",
      intro: "",
      skills: ["UI/UX 设计", "Python"],
      competitionType: "",
      deadline: "",
      people: 1,
      verificationRequired: true
    });
    const peopleOptions = ["1 人", "2 人", "3 人", "更多"];
    const competitionTypeOptions = ["互联网+", "挑战杯", "大广赛", "数学建模", "AI创新大赛", "产品设计大赛", "其他"];
    const switchToSeek = () => {
      common_vendor.index.redirectTo({
        url: "/pages/publish/seek-team"
      });
    };
    const uploadCover = () => {
      common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:143", "上传封面");
    };
    const removeSkill = (index) => {
      formData.skills.splice(index, 1);
    };
    const showSkillPicker = () => {
      common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:151", "选择技能标签");
    };
    const onCompetitionTypeChange = (e) => {
      const index = e.detail.value;
      formData.competitionType = competitionTypeOptions[index];
    };
    const onPeopleChange = (e) => {
      const index = e.detail.value;
      formData.people = index + 1;
    };
    const toggleVerification = (e) => {
      formData.verificationRequired = e.detail.value;
    };
    const submitForm = () => {
      common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:169", "提交表单", formData);
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
        common_vendor.index.navigateBack();
      }, 1500);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(switchToSeek),
        b: formData.cover
      }, formData.cover ? {
        c: formData.cover
      } : {}, {
        d: common_vendor.o(uploadCover),
        e: formData.competitionName,
        f: common_vendor.o(($event) => formData.competitionName = $event.detail.value),
        g: formData.intro,
        h: common_vendor.o(($event) => formData.intro = $event.detail.value),
        i: common_vendor.f(formData.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        j: common_vendor.o(showSkillPicker),
        k: common_vendor.t(formData.competitionType || "请选择赛事类型"),
        l: competitionTypeOptions,
        m: common_vendor.o(onCompetitionTypeChange),
        n: formData.deadline,
        o: common_vendor.o(($event) => formData.deadline = $event.detail.value),
        p: common_vendor.t(formData.people),
        q: peopleOptions,
        r: common_vendor.o(onPeopleChange),
        s: formData.verificationRequired,
        t: common_vendor.o(toggleVerification),
        v: common_vendor.o(submitForm),
        w: showSuccess.value
      }, showSuccess.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f23ae20"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/recruit-teammate.js.map
