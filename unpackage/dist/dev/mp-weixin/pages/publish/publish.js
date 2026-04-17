"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "publish",
  setup(__props) {
    const activeTab = common_vendor.ref("recruit");
    const recruitForm = common_vendor.ref({
      competitionName: "",
      description: "",
      skills: [],
      deadline: "",
      cover: ""
    });
    const joinForm = common_vendor.ref({
      competitionName: "",
      skills: [],
      teamType: ""
    });
    const removeSkill = (index) => {
      recruitForm.value.skills.splice(index, 1);
    };
    const removeJoinSkill = (index) => {
      joinForm.value.skills.splice(index, 1);
    };
    const showSkillPicker = () => {
      recruitForm.value.skills.push("Vue");
    };
    const showJoinSkillPicker = () => {
      joinForm.value.skills.push("JavaScript");
    };
    const uploadCover = () => {
      recruitForm.value.cover = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=project%20cover%20design&image_size=landscape_16_9";
    };
    const publishRecruit = () => {
      common_vendor.index.__f__("log", "at pages/publish/publish.vue:142", "发布招募", recruitForm.value);
    };
    const publishJoin = () => {
      common_vendor.index.__f__("log", "at pages/publish/publish.vue:148", "发布求组队信息", joinForm.value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: activeTab.value === "recruit" ? 1 : "",
        b: common_vendor.o(($event) => activeTab.value = "recruit"),
        c: activeTab.value === "join" ? 1 : "",
        d: common_vendor.o(($event) => activeTab.value = "join"),
        e: activeTab.value === "recruit"
      }, activeTab.value === "recruit" ? common_vendor.e({
        f: recruitForm.value.competitionName,
        g: common_vendor.o(($event) => recruitForm.value.competitionName = $event.detail.value),
        h: recruitForm.value.description,
        i: common_vendor.o(($event) => recruitForm.value.description = $event.detail.value),
        j: common_vendor.f(recruitForm.value.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        k: common_vendor.o(showSkillPicker),
        l: recruitForm.value.deadline,
        m: common_vendor.o(($event) => recruitForm.value.deadline = $event.detail.value),
        n: recruitForm.value.cover
      }, recruitForm.value.cover ? {
        o: recruitForm.value.cover
      } : {}, {
        p: common_vendor.o(uploadCover),
        q: common_vendor.o(publishRecruit)
      }) : {
        r: joinForm.value.competitionName,
        s: common_vendor.o(($event) => joinForm.value.competitionName = $event.detail.value),
        t: common_vendor.f(joinForm.value.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeJoinSkill(index), index),
            c: index
          };
        }),
        v: common_vendor.o(showJoinSkillPicker),
        w: joinForm.value.teamType,
        x: common_vendor.o(($event) => joinForm.value.teamType = $event.detail.value),
        y: common_vendor.o(publishJoin)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bfce3555"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/publish.js.map
