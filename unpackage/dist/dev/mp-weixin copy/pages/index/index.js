"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.onMounted(() => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      }
      fetchCompetitions();
      fetchRecruitments();
    });
    const competitions = common_vendor.ref([]);
    const recruitments = common_vendor.ref([]);
    const showAll = common_vendor.ref(false);
    const displayRecruitments = common_vendor.computed(() => {
      return showAll.value ? recruitments.value : recruitments.value.slice(0, 3);
    });
    const showAllRecruitments = () => {
      showAll.value = !showAll.value;
    };
    const fetchCompetitions = async () => {
      try {
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/competitions",
          method: "GET"
        });
        if (response.data && response.data.success) {
          const competitionData = response.data.data;
          const competitionProjects = competitionData.projects || [];
          const filteredMap = /* @__PURE__ */ new Map();
          competitionProjects.forEach((comp) => {
            const type = comp.competitionType || "其他";
            if (!filteredMap.has(type)) {
              filteredMap.set(type, comp);
            } else {
              const existing = filteredMap.get(type);
              if (!existing.coverImage && comp.coverImage) {
                filteredMap.set(type, comp);
              }
            }
          });
          competitions.value = Array.from(filteredMap.values()).slice(0, 6).map((comp) => ({
            id: comp.id,
            // name 显示竞赛类型（蓝色标题）
            name: comp.competitionType || comp.type || "",
            // title 显示项目标题（黑色主标题）
            title: comp.title || comp.competitionName || "未命名项目",
            date: comp.deadline,
            img: comp.coverImage || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20poster&image_size=square",
            description: comp.description,
            // 竞赛类型/级别单独存储
            type: comp.competitionType || comp.type,
            level: comp.level,
            organization: comp.organization
          }));
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:157", "获取竞赛数据错误:", err);
      }
    };
    const fetchRecruitments = async () => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/projects",
          method: "GET",
          header: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (response.data && response.data.success) {
          const projects = response.data.data.projects || [];
          recruitments.value = projects.map((proj) => {
            var _a;
            return {
              id: proj.id,
              title: proj.title,
              skills: proj.skills || [],
              date: proj.deadline,
              people: proj.peopleNeeded,
              status: proj.status,
              creatorName: (_a = proj.creator) == null ? void 0 : _a.name
            };
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:184", "获取招募数据错误:", err);
      }
    };
    const goToCompetition = (competition) => {
      common_vendor.index.navigateTo({
        url: `/pages/square/square?id=${competition.id}&data=${encodeURIComponent(
          JSON.stringify(competition)
        )}`
      });
    };
    const goToRecruitment = (recruitment) => {
      common_vendor.index.navigateTo({
        url: `/pages/recruitment-detail/recruitment-detail?id=${recruitment.id}&data=${encodeURIComponent(JSON.stringify(recruitment))}`
      });
    };
    const formatDate = (dateString) => {
      if (!dateString)
        return "未设置";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$1,
        b: common_assets._imports_1,
        c: common_assets._imports_2,
        d: common_vendor.f(competitions.value, (item, index, i0) => {
          return {
            a: item.img,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.title),
            d: common_vendor.t(formatDate(item.date)),
            e: index,
            f: common_vendor.o(($event) => goToCompetition(item), index)
          };
        }),
        e: common_vendor.f(displayRecruitments.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.f((item.skills || []).slice(0, 3), (skill, idx, i1) => {
              return {
                a: common_vendor.t(skill),
                b: idx
              };
            }),
            c: common_vendor.t(formatDate(item.date)),
            d: common_vendor.t(item.people || 0),
            e: index,
            f: common_vendor.o(($event) => goToRecruitment(item), index)
          };
        }),
        f: recruitments.value.length > 3
      }, recruitments.value.length > 3 ? {
        g: common_vendor.t(showAll.value ? "收起" : "加载更多"),
        h: common_vendor.o(showAllRecruitments, "fb")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
