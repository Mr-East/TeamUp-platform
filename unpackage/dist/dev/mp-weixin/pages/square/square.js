"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  TalentCard();
}
const TalentCard = () => "../../components/TalentCard/TalentCard.js";
const _sfc_main = {
  __name: "square",
  setup(__props) {
    const loading = common_vendor.ref({
      team: false,
      talent: false
    });
    const error = common_vendor.ref({
      team: "",
      talent: ""
    });
    const showInviteModal = common_vendor.ref(false);
    const showFilterModal = common_vendor.ref(false);
    const currentFilterType = common_vendor.ref("");
    const talentFilters = common_vendor.ref({
      grade: "",
      major: "",
      skill: ""
    });
    const filterOptions = common_vendor.ref([]);
    const gradeOptions = ["2020届", "2021届", "2022届", "2023届", "2024届", "2025届", "2026届"];
    const majorOptions = ["计算机科学", "软件工程", "人工智能", "数字媒体艺术", "市场营销", "电子工程", "机械工程"];
    const skillOptions = ["Vue", "React", "JavaScript", "TypeScript", "Python", "Java", "Go", "C++", "UI设计", "产品经理", "机器学习", "数据分析", "App开发", "微信小程序"];
    const competitionOptions = ["创新创业", "学科竞赛", "技能大赛", "艺术设计", "科研项目"];
    const currentTalentId = common_vendor.ref(null);
    const selectedProject = common_vendor.ref(null);
    const myProjects = common_vendor.ref([]);
    const inviteReason = common_vendor.ref("我看你的技能很适合我们的项目，邀请你加入！");
    common_vendor.onLoad(() => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      }
    });
    common_vendor.onShow(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        await Promise.all([
          fetchTeamRecruitments(),
          fetchTalentList(),
          fetchMyProjects()
        ]);
      }
    });
    const activeTab = common_vendor.ref("team");
    const recruitments = common_vendor.ref([]);
    const talents = common_vendor.ref([]);
    const teamFilters = common_vendor.ref({
      competitionType: "",
      skill: "",
      deadline: ""
    });
    const switchTab = (tab) => {
      activeTab.value = tab;
    };
    const fetchTeamRecruitments = async () => {
      try {
        loading.value.team = true;
        error.value.team = "";
        const token = common_vendor.index.getStorageSync("token");
        let queryParams = "";
        const params = [];
        if (teamFilters.value.competitionType)
          params.push(`competitionType=${encodeURIComponent(teamFilters.value.competitionType)}`);
        if (teamFilters.value.skill)
          params.push(`skill=${encodeURIComponent(teamFilters.value.skill)}`);
        if (teamFilters.value.deadline)
          params.push(`deadline=${encodeURIComponent(teamFilters.value.deadline)}`);
        if (params.length > 0)
          queryParams = "?" + params.join("&");
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects${queryParams}`,
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          const projectList = response.data.data.projects || [];
          recruitments.value = projectList.map((project) => {
            var _a, _b, _c;
            return {
              id: project.id,
              title: project.title,
              name: project.competitionName,
              logo: project.coverImage || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square",
              publisher: ((_a = project.creator) == null ? void 0 : _a.name) || "未知发布者",
              publisherAvatar: ((_b = project.creator) == null ? void 0 : _b.avatar) || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
              college: ((_c = project.creator) == null ? void 0 : _c.college) || "未知学院",
              description: project.description,
              skills: project.skills || [],
              progress: project.progress || 0,
              joined: project.joined || 0,
              total: project.total || project.peopleNeeded || 1,
              deadline: project.deadline || "2026-05-31",
              members: project.members || [],
              comments: project.comments || []
            };
          });
        } else {
          error.value.team = "获取组队广场数据失败";
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:346", "获取组队广场数据错误:", err);
        error.value.team = "网络错误，请稍后重试";
      } finally {
        loading.value.team = false;
      }
    };
    const fetchTalentList = async () => {
      try {
        loading.value.talent = true;
        error.value.talent = "";
        const token = common_vendor.index.getStorageSync("token");
        let queryParams = "";
        const params = [];
        if (talentFilters.value.grade)
          params.push(`grade=${encodeURIComponent(talentFilters.value.grade)}`);
        if (talentFilters.value.major)
          params.push(`major=${encodeURIComponent(talentFilters.value.major)}`);
        if (talentFilters.value.skill)
          params.push(`skill=${encodeURIComponent(talentFilters.value.skill)}`);
        if (params.length > 0)
          queryParams = "?" + params.join("&");
        const url = `http://localhost:3000/api/users/talents${queryParams}`;
        const response = await common_vendor.index.request({
          url,
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          talents.value = response.data.data.map((user) => ({
            id: user.id,
            name: user.name,
            major: `${user.major}${user.grade ? " · " + user.grade : ""}`,
            intro: user.bio || "暂无简介",
            skills: user.skills || [],
            competitionTypes: user.competitionTypes || [],
            avatar: user.avatar || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square"
          }));
        } else {
          error.value.talent = "获取人才广场数据失败";
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:393", "获取人才广场数据错误:", err);
        error.value.talent = "网络错误，请稍后重试";
      } finally {
        loading.value.talent = false;
      }
    };
    const fetchMyProjects = async () => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/projects/my",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          myProjects.value = response.data.data || [];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:416", "获取我的项目错误:", err);
      }
    };
    const goToDetail = (id) => {
      const recruitment = recruitments.value.find((item) => item.id === id);
      if (recruitment) {
        const dataStr = encodeURIComponent(JSON.stringify(recruitment));
        common_vendor.index.navigateTo({
          url: `/pages/recruitment-detail/recruitment-detail?data=${dataStr}`
        });
      }
    };
    const viewProfile = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/personInfo/personInfo?userId=${id}`
      });
    };
    const inviteTeam = async (id) => {
      currentTalentId.value = id;
      selectedProject.value = null;
      inviteReason.value = "我看你的技能很适合我们的项目，邀请你加入！";
      await fetchMyProjects();
      showInviteModal.value = true;
    };
    const selectProject = (project) => {
      selectedProject.value = project;
    };
    const sendInvitation = async () => {
      var _a;
      if (!selectedProject.value) {
        common_vendor.index.showToast({
          title: "请选择项目",
          icon: "none"
        });
        return;
      }
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/applications/invite",
          method: "POST",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            projectId: selectedProject.value.id,
            userId: currentTalentId.value,
            reasonText: inviteReason.value
          }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({
            title: "邀请发送成功",
            icon: "success"
          });
          closeInviteModal();
        } else {
          common_vendor.index.showToast({
            title: ((_a = response.data) == null ? void 0 : _a.message) || "发送失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:493", "发送邀请错误:", err);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      }
    };
    const closeInviteModal = () => {
      showInviteModal.value = false;
      currentTalentId.value = null;
      selectedProject.value = null;
    };
    const greet = async (id) => {
      const talent = talents.value.find((t) => t.id === id);
      if (!talent)
        return;
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || "")}`
      });
    };
    const toggleTalentFilter = (type) => {
      currentFilterType.value = type;
      if (type === "grade") {
        filterOptions.value = gradeOptions;
      } else if (type === "major") {
        filterOptions.value = majorOptions;
      } else if (type === "skill") {
        filterOptions.value = skillOptions;
      }
      showFilterModal.value = true;
    };
    const selectFilter = (option) => {
      talentFilters.value[currentFilterType.value] = option;
      closeFilterModal();
      fetchTalentList();
    };
    const clearFilter = () => {
      talentFilters.value[currentFilterType.value] = "";
      closeFilterModal();
      fetchTalentList();
    };
    const closeFilterModal = () => {
      showFilterModal.value = false;
    };
    const toggleFilter = (type) => {
      currentFilterType.value = type;
      if (type === "competition") {
        filterOptions.value = competitionOptions;
      } else if (type === "skill") {
        filterOptions.value = skillOptions;
      } else if (type === "deadline") {
        filterOptions.value = ["一周内", "两周内", "一个月内", "三个月内"];
      }
      showFilterModal.value = true;
    };
    const selectTeamFilter = (option) => {
      if (currentFilterType.value === "competition") {
        teamFilters.value.competitionType = option;
      } else if (currentFilterType.value === "skill") {
        teamFilters.value.skill = option;
      } else if (currentFilterType.value === "deadline") {
        teamFilters.value.deadline = option;
      }
      closeFilterModal();
      fetchTeamRecruitments();
    };
    const clearTeamFilter = () => {
      if (currentFilterType.value === "competition") {
        teamFilters.value.competitionType = "";
      } else if (currentFilterType.value === "skill") {
        teamFilters.value.skill = "";
      } else if (currentFilterType.value === "deadline") {
        teamFilters.value.deadline = "";
      }
      closeFilterModal();
      fetchTeamRecruitments();
    };
    const loadMore = () => {
      common_vendor.index.__f__("log", "at pages/square/square.vue:595", "加载更多组队信息");
    };
    const loadMoreTalent = () => {
      common_vendor.index.__f__("log", "at pages/square/square.vue:600", "加载更多人才信息");
    };
    const goToPublish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/publish/recruit-teammate"
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
        a: activeTab.value === "team" ? 1 : "",
        b: common_vendor.o(($event) => switchTab("team"), "e0"),
        c: activeTab.value === "talent" ? 1 : "",
        d: common_vendor.o(($event) => switchTab("talent"), "70"),
        e: activeTab.value === "team"
      }, activeTab.value === "team" ? {
        f: common_vendor.t(teamFilters.value.competitionType || "竞赛类型"),
        g: common_vendor.o(($event) => toggleFilter("competition"), "af"),
        h: common_vendor.t(teamFilters.value.skill || "技能标签"),
        i: common_vendor.o(($event) => toggleFilter("skill"), "08"),
        j: common_vendor.t(teamFilters.value.deadline || "截止时间"),
        k: common_vendor.o(($event) => toggleFilter("deadline"), "2d")
      } : {
        l: common_vendor.t(talentFilters.value.grade || "年级"),
        m: common_vendor.o(($event) => toggleTalentFilter("grade"), "c5"),
        n: common_vendor.t(talentFilters.value.major || "专业"),
        o: common_vendor.o(($event) => toggleTalentFilter("major"), "6c"),
        p: common_vendor.t(talentFilters.value.skill || "技能"),
        q: common_vendor.o(($event) => toggleTalentFilter("skill"), "7f")
      }, {
        r: activeTab.value === "team"
      }, activeTab.value === "team" ? common_vendor.e({
        s: loading.value.team
      }, loading.value.team ? {} : error.value.team ? {
        v: common_vendor.t(error.value.team),
        w: common_vendor.o(fetchTeamRecruitments, "17")
      } : recruitments.value.length === 0 ? {} : {
        y: common_vendor.f(recruitments.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.logo,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.publisher),
            e: common_vendor.f(item.skills.slice(0, 3), (skill, idx, i1) => {
              return {
                a: common_vendor.t(skill),
                b: idx
              };
            }),
            f: item.skills.length > 3
          }, item.skills.length > 3 ? {
            g: common_vendor.t(item.skills.length - 3)
          } : {}, {
            h: item.progress + "%",
            i: common_vendor.t(item.joined),
            j: common_vendor.t(item.total),
            k: common_vendor.t(formatDate(item.deadline)),
            l: index,
            m: common_vendor.o(($event) => goToDetail(item.id), index)
          });
        }),
        z: common_vendor.o(loadMore, "98")
      }, {
        t: error.value.team,
        x: recruitments.value.length === 0
      }) : common_vendor.e({
        A: loading.value.talent
      }, loading.value.talent ? {} : error.value.talent ? {
        C: common_vendor.t(error.value.talent),
        D: common_vendor.o(fetchTalentList, "43")
      } : talents.value.length === 0 ? {} : {
        F: common_vendor.f(talents.value, (talent, index, i0) => {
          return {
            a: index,
            b: talent.id,
            c: common_vendor.o(inviteTeam, index),
            d: common_vendor.o(greet, index),
            e: common_vendor.o(viewProfile, index),
            f: "6bc6c6b7-0-" + i0,
            g: common_vendor.p({
              id: talent.id,
              avatar: talent.avatar,
              name: talent.name,
              major: talent.major,
              intro: talent.intro,
              skills: talent.skills,
              ["competition-types"]: talent.competitionTypes
            })
          };
        }),
        G: common_vendor.o(loadMoreTalent, "19")
      }, {
        B: error.value.talent,
        E: talents.value.length === 0
      }), {
        H: showInviteModal.value
      }, showInviteModal.value ? common_vendor.e({
        I: common_vendor.o(closeInviteModal, "e4"),
        J: myProjects.value.length === 0
      }, myProjects.value.length === 0 ? {} : {
        K: common_vendor.f(myProjects.value, (project, k0, i0) => {
          var _a, _b, _c;
          return common_vendor.e({
            a: common_vendor.t(project.title),
            b: common_vendor.t(project.competitionName),
            c: ((_a = selectedProject.value) == null ? void 0 : _a.id) === project.id
          }, ((_b = selectedProject.value) == null ? void 0 : _b.id) === project.id ? {} : {}, {
            d: project.id,
            e: ((_c = selectedProject.value) == null ? void 0 : _c.id) === project.id ? 1 : "",
            f: common_vendor.o(($event) => selectProject(project), project.id)
          });
        }),
        L: inviteReason.value,
        M: common_vendor.o(($event) => inviteReason.value = $event.detail.value, "f4"),
        N: common_vendor.o(closeInviteModal, "83"),
        O: common_vendor.o(sendInvitation, "12"),
        P: !selectedProject.value ? 1 : ""
      }, {
        Q: common_vendor.o(() => {
        }, "c0"),
        R: common_vendor.o(closeInviteModal, "a3")
      }) : {}, {
        S: showFilterModal.value
      }, showFilterModal.value ? {
        T: common_vendor.t(currentFilterType.value === "grade" ? "年级" : currentFilterType.value === "major" ? "专业" : "技能"),
        U: common_vendor.o(closeFilterModal, "45"),
        V: common_vendor.f(filterOptions.value, (option, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(option),
            b: activeTab.value === "team" ? teamFilters.value[currentFilterType.value] === option : talentFilters.value[currentFilterType.value] === option
          }, (activeTab.value === "team" ? teamFilters.value[currentFilterType.value] === option : talentFilters.value[currentFilterType.value] === option) ? {} : {}, {
            c: option,
            d: (activeTab.value === "team" ? teamFilters.value[currentFilterType.value] === option : talentFilters.value[currentFilterType.value] === option) ? 1 : "",
            e: common_vendor.o(($event) => activeTab.value === "team" ? selectTeamFilter(option) : selectFilter(option), option)
          });
        }),
        W: common_vendor.o(($event) => activeTab.value === "team" ? clearTeamFilter() : clearFilter(), "be"),
        X: common_vendor.o(() => {
        }, "79"),
        Y: common_vendor.o(closeFilterModal, "bf")
      } : {}, {
        Z: common_vendor.o(goToPublish, "fe")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6bc6c6b7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/square/square.js.map
