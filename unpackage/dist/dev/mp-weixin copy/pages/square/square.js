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
    const gradeOptions = ["大一", "大二", "大三", "大四", "研究生"];
    const majorOptions = ["计算机科学与技术", "软件工程", "人工智能", "数字媒体艺术", "市场营销", "电子工程", "机械工程"];
    const skillOptions = ["Vue", "React", "JavaScript", "TypeScript", "Python", "Java", "Go", "C++", "UI设计", "产品经理", "机器学习", "数据分析", "App开发", "微信小程序"];
    const competitionOptions = ["创新创业", "学科竞赛", "技能大赛", "艺术设计", "科研项目"];
    const currentTalentId = common_vendor.ref(null);
    const selectedProject = common_vendor.ref(null);
    const myProjects = common_vendor.ref([]);
    const inviteReason = common_vendor.ref("我看你的技能很适合我们的项目，邀请你加入！");
    const currentUser = common_vendor.ref({
      id: null,
      name: "",
      avatar: ""
    });
    const activeTab = common_vendor.ref("team");
    const recruitments = common_vendor.ref([]);
    const recruitmentPage = common_vendor.ref(1);
    const recruitmentHasMore = common_vendor.ref(true);
    const talents = common_vendor.ref([]);
    const talentPage = common_vendor.ref(1);
    const talentHasMore = common_vendor.ref(true);
    const teamFilters = common_vendor.ref({
      competitionType: "",
      skill: "",
      deadline: ""
    });
    const getUserInfo = async () => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token)
          return;
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/users/me",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          const user = response.data.data;
          currentUser.value = {
            id: user.id,
            name: user.name || user.username || "",
            avatar: user.avatar || ""
          };
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:315", "获取用户信息错误:", err);
      }
    };
    common_vendor.onLoad(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      } else {
        await getUserInfo();
      }
    });
    common_vendor.onShow(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        await Promise.all([
          getUserInfo(),
          fetchTeamRecruitments(),
          fetchTalentList(),
          fetchMyProjects()
        ]);
      }
    });
    common_vendor.onPullDownRefresh(async () => {
      if (activeTab.value === "team") {
        recruitmentPage.value = 1;
        recruitmentHasMore.value = true;
        await fetchTeamRecruitments(false);
      } else {
        talentPage.value = 1;
        talentHasMore.value = true;
        await fetchTalentList(false);
      }
      common_vendor.index.stopPullDownRefresh();
    });
    common_vendor.onReachBottom(() => {
      if (activeTab.value === "team") {
        loadMore();
      } else {
        loadMoreTalent();
      }
    });
    const switchTab = (tab) => {
      activeTab.value = tab;
    };
    const fetchTeamRecruitments = async (isLoadMore = false) => {
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
        const page = isLoadMore ? recruitmentPage.value + 1 : 1;
        const limit = 10;
        params.push(`page=${page}`);
        params.push(`limit=${limit}`);
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
          const newRecruitments = projectList.map((project) => {
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
          if (isLoadMore) {
            recruitments.value = [...recruitments.value, ...newRecruitments];
            recruitmentPage.value = page;
          } else {
            recruitments.value = newRecruitments;
            recruitmentPage.value = 1;
          }
          recruitmentHasMore.value = newRecruitments.length === limit && recruitments.value.length > 0;
        } else {
          error.value.team = "获取组队广场数据失败";
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:437", "获取组队广场数据错误:", err);
        error.value.team = "网络错误，请稍后重试";
      } finally {
        loading.value.team = false;
      }
    };
    const fetchTalentList = async (isLoadMore = false) => {
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
        const page = isLoadMore ? talentPage.value + 1 : 1;
        const limit = 10;
        params.push(`page=${page}`);
        params.push(`limit=${limit}`);
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
          const newTalents = response.data.data.map((user) => ({
            id: user.id,
            name: user.name,
            major: `${user.major}${user.grade ? " · " + user.grade : ""}`,
            intro: user.bio || "暂无简介",
            skills: user.skills || [],
            targetTrack: user.targetTrack || "",
            competitionTypes: user.competitionTypes || [],
            avatar: user.avatar || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square"
          }));
          if (isLoadMore) {
            talents.value = [...talents.value, ...newTalents];
            talentPage.value = page;
          } else {
            talents.value = newTalents;
            talentPage.value = 1;
          }
          talentHasMore.value = newTalents.length === limit && talents.value.length > 0;
        } else {
          error.value.talent = "获取人才广场数据失败";
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:503", "获取人才广场数据错误:", err);
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
          const projects = response.data.data || [];
          myProjects.value = projects.filter((project) => project.status !== "deleted");
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:528", "获取我的项目错误:", err);
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
      if (currentUser.value.id === id) {
        common_vendor.index.showToast({
          title: "不能邀请自己",
          icon: "none"
        });
        return;
      }
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
        common_vendor.index.__f__("error", "at pages/square/square.vue:614", "发送邀请错误:", err);
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
      if (currentUser.value.id === id) {
        common_vendor.index.showToast({
          title: "不能对自己打招呼",
          icon: "none"
        });
        return;
      }
      const talent = talents.value.find((t) => t.id === id);
      if (!talent)
        return;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.navigateTo({
            url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || "")}`
          });
          return;
        }
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/messages/chats`,
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          const chats = response.data.data || [];
          const chat = chats.find((c) => c.otherUser && c.otherUser.id === id);
          if (chat) {
            common_vendor.index.navigateTo({
              url: `/pages/chat/chat?chatId=${chat.id}&otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || "")}`
            });
          } else {
            common_vendor.index.navigateTo({
              url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || "")}`
            });
          }
        } else {
          common_vendor.index.navigateTo({
            url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || "")}`
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/square/square.vue:684", "获取聊天列表错误:", err);
        common_vendor.index.navigateTo({
          url: `/pages/chat/chat?otherUserId=${id}&name=${encodeURIComponent(talent.name)}&avatar=${encodeURIComponent(talent.avatar || "")}`
        });
      }
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
      if (activeTab.value === "team") {
        teamFilters.value[currentFilterType.value === "competition" ? "competitionType" : currentFilterType.value] = option;
        closeFilterModal();
        fetchTeamRecruitments();
      } else {
        talentFilters.value[currentFilterType.value] = option;
        closeFilterModal();
        fetchTalentList();
      }
    };
    const clearFilter = () => {
      if (activeTab.value === "team") {
        teamFilters.value[currentFilterType.value === "competition" ? "competitionType" : currentFilterType.value] = "";
        closeFilterModal();
        fetchTeamRecruitments();
      } else {
        talentFilters.value[currentFilterType.value] = "";
        closeFilterModal();
        fetchTalentList();
      }
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
    const loadMore = async () => {
      if (loading.value.team || !recruitmentHasMore.value)
        return;
      await fetchTeamRecruitments(true);
    };
    const loadMoreTalent = async () => {
      if (loading.value.talent || !talentHasMore.value)
        return;
      await fetchTalentList(true);
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
      } : recruitments.value.length === 0 ? {} : common_vendor.e({
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
        z: recruitmentHasMore.value
      }, recruitmentHasMore.value ? common_vendor.e({
        A: loading.value.team
      }, loading.value.team ? {} : {
        B: common_vendor.o(loadMore, "35")
      }) : {}), {
        t: error.value.team,
        x: recruitments.value.length === 0
      }) : common_vendor.e({
        C: loading.value.talent
      }, loading.value.talent ? {} : error.value.talent ? {
        E: common_vendor.t(error.value.talent),
        F: common_vendor.o(fetchTalentList, "6c")
      } : talents.value.length === 0 ? {} : common_vendor.e({
        H: common_vendor.f(talents.value, (talent, index, i0) => {
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
              ["target-track"]: talent.targetTrack,
              ["competition-types"]: talent.competitionTypes
            })
          };
        }),
        I: talentHasMore.value
      }, talentHasMore.value ? common_vendor.e({
        J: loading.value.talent
      }, loading.value.talent ? {} : {
        K: common_vendor.o(loadMoreTalent, "aa")
      }) : {}), {
        D: error.value.talent,
        G: talents.value.length === 0
      }), {
        L: showInviteModal.value
      }, showInviteModal.value ? common_vendor.e({
        M: common_vendor.o(closeInviteModal, "64"),
        N: myProjects.value.length === 0
      }, myProjects.value.length === 0 ? {} : {
        O: common_vendor.f(myProjects.value, (project, k0, i0) => {
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
        P: inviteReason.value,
        Q: common_vendor.o(($event) => inviteReason.value = $event.detail.value, "17"),
        R: common_vendor.o(closeInviteModal, "ac"),
        S: common_vendor.o(sendInvitation, "a2"),
        T: !selectedProject.value ? 1 : ""
      }, {
        U: common_vendor.o(() => {
        }, "4e"),
        V: common_vendor.o(closeInviteModal, "86")
      }) : {}, {
        W: showFilterModal.value
      }, showFilterModal.value ? {
        X: common_vendor.t(currentFilterType.value === "grade" ? "年级" : currentFilterType.value === "major" ? "专业" : "技能"),
        Y: common_vendor.o(closeFilterModal, "8b"),
        Z: common_vendor.f(filterOptions.value, (option, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(option),
            b: activeTab.value === "team" ? teamFilters.value[currentFilterType.value === "competition" ? "competitionType" : currentFilterType.value] === option : talentFilters.value[currentFilterType.value] === option
          }, (activeTab.value === "team" ? teamFilters.value[currentFilterType.value === "competition" ? "competitionType" : currentFilterType.value] === option : talentFilters.value[currentFilterType.value] === option) ? {} : {}, {
            c: option,
            d: (activeTab.value === "team" ? teamFilters.value[currentFilterType.value === "competition" ? "competitionType" : currentFilterType.value] === option : talentFilters.value[currentFilterType.value] === option) ? 1 : "",
            e: common_vendor.o(($event) => activeTab.value === "team" ? selectTeamFilter(option) : selectFilter(option), option)
          });
        }),
        aa: common_vendor.o(($event) => activeTab.value === "team" ? clearTeamFilter() : clearFilter(), "9c"),
        ab: common_vendor.o(() => {
        }, "35"),
        ac: common_vendor.o(closeFilterModal, "e6")
      } : {}, {
        ad: common_vendor.o(goToPublish, "24")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6bc6c6b7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/square/square.js.map
