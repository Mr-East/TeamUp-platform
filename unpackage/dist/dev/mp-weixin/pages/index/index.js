"use strict";
const common_vendor = require("../../common/vendor.js");
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
          competitions.value = response.data.data.map((comp) => ({
            id: comp.id,
            name: comp.name,
            title: comp.name,
            date: comp.deadline,
            img: comp.image || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20poster&image_size=square",
            description: comp.description,
            type: comp.type,
            level: comp.level,
            organization: comp.organization
          }));
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:120", "获取竞赛数据错误:", err);
      }
    };
    const fetchRecruitments = async () => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/projects",
          method: "GET",
          header: token ? { "Authorization": `Bearer ${token}` } : {}
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
        common_vendor.index.__f__("error", "at pages/index/index.vue:147", "获取招募数据错误:", err);
      }
    };
    const goToCompetition = (competition) => {
      common_vendor.index.navigateTo({
        url: `/pages/square/square?id=${competition.id}&data=${encodeURIComponent(JSON.stringify(competition))}`
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
        a: common_vendor.f(competitions.value, (item, index, i0) => {
          return {
            a: item.img,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.title),
            d: common_vendor.t(formatDate(item.date)),
            e: index,
            f: common_vendor.o(($event) => goToCompetition(item), index)
          };
        }),
        b: common_vendor.f(displayRecruitments.value, (item, index, i0) => {
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
        c: recruitments.value.length > 3
      }, recruitments.value.length > 3 ? {
        d: common_vendor.t(showAll.value ? "收起" : "加载更多"),
        e: common_vendor.o(showAllRecruitments, "fd")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
