"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "publish",
  setup(__props) {
    const activeTab = common_vendor.ref("recruit");
    const competitionCategories = ["创新创业", "学科竞赛", "技能大赛", "艺术设计", "科研项目"];
    const recruitForm = common_vendor.ref({
      competitionCategory: "",
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
    const onCategoryChange = (e) => {
      const index = e.detail.value;
      recruitForm.value.competitionCategory = competitionCategories[index];
    };
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
    const publishRecruit = async () => {
      if (!recruitForm.value.competitionCategory) {
        common_vendor.index.showToast({ title: "请选择竞赛大类", icon: "none" });
        return;
      }
      if (!recruitForm.value.competitionName) {
        common_vendor.index.showToast({ title: "请输入竞赛名称", icon: "none" });
        return;
      }
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/projects",
          method: "POST",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            title: recruitForm.value.competitionName,
            description: recruitForm.value.description,
            competitionName: recruitForm.value.competitionName,
            competitionType: recruitForm.value.competitionCategory,
            deadline: recruitForm.value.deadline || "2026-05-31",
            peopleNeeded: 1,
            skills: recruitForm.value.skills,
            coverImage: recruitForm.value.cover
          }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({ title: "发布成功", icon: "success" });
          recruitForm.value = {
            competitionCategory: "",
            competitionName: "",
            description: "",
            skills: [],
            deadline: "",
            cover: ""
          };
        } else {
          common_vendor.index.showToast({ title: "发布失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/publish/publish.vue:208", "发布错误:", error);
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      }
    };
    const publishJoin = () => {
      common_vendor.index.__f__("log", "at pages/publish/publish.vue:215", "发布求组队信息", joinForm.value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: activeTab.value === "recruit" ? 1 : "",
        b: common_vendor.o(($event) => activeTab.value = "recruit", "f4"),
        c: activeTab.value === "join" ? 1 : "",
        d: common_vendor.o(($event) => activeTab.value = "join", "eb"),
        e: activeTab.value === "recruit"
      }, activeTab.value === "recruit" ? common_vendor.e({
        f: common_vendor.t(recruitForm.value.competitionCategory || "请选择竞赛大类"),
        g: competitionCategories,
        h: common_vendor.o(onCategoryChange, "f0"),
        i: recruitForm.value.competitionName,
        j: common_vendor.o(($event) => recruitForm.value.competitionName = $event.detail.value, "21"),
        k: recruitForm.value.description,
        l: common_vendor.o(($event) => recruitForm.value.description = $event.detail.value, "3b"),
        m: common_vendor.f(recruitForm.value.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        n: common_vendor.o(showSkillPicker, "23"),
        o: recruitForm.value.deadline,
        p: common_vendor.o(($event) => recruitForm.value.deadline = $event.detail.value, "e4"),
        q: recruitForm.value.cover
      }, recruitForm.value.cover ? {
        r: recruitForm.value.cover
      } : {}, {
        s: common_vendor.o(uploadCover, "72"),
        t: common_vendor.o(publishRecruit, "ff")
      }) : {
        v: joinForm.value.competitionName,
        w: common_vendor.o(($event) => joinForm.value.competitionName = $event.detail.value, "5d"),
        x: common_vendor.f(joinForm.value.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeJoinSkill(index), index),
            c: index
          };
        }),
        y: common_vendor.o(showJoinSkillPicker, "fe"),
        z: joinForm.value.teamType,
        A: common_vendor.o(($event) => joinForm.value.teamType = $event.detail.value, "a3"),
        B: common_vendor.o(publishJoin, "69")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bfce3555"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/publish.js.map
