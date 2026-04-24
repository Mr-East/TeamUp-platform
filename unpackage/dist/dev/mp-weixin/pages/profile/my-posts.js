"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "my-posts",
  setup(__props) {
    const activeTab = common_vendor.ref("recruit");
    const recruitPosts = common_vendor.ref([]);
    const seekPosts = common_vendor.ref([]);
    const loading = common_vendor.ref(true);
    common_vendor.onMounted(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      await fetchUserPosts();
    });
    const fetchUserPosts = async () => {
      var _a;
      try {
        loading.value = true;
        const token = common_vendor.index.getStorageSync("token");
        const userId = (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.id;
        if (!userId) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/users/${userId}/posts`,
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          const posts = response.data.data || [];
          recruitPosts.value = posts.map((post) => ({
            id: post.id,
            title: post.title,
            cover: post.coverImage || "",
            competitionName: post.competitionName || "未知竞赛",
            intro: post.description || "",
            skills: post.requiredSkills || [],
            competitionType: post.competitionType || "其他",
            deadline: post.deadline || "2026-05-31",
            people: post.recruitmentCount || 1,
            verificationRequired: post.verificationRequired || false,
            date: post.created_at ? new Date(post.created_at).toISOString().split("T")[0] : "2026-04-21",
            status: post.status === "active" ? "active" : "closed",
            statusText: post.status === "active" ? "招募中" : "已关闭",
            isClosed: post.status !== "active" ? true : false
          }));
        } else {
          common_vendor.index.showToast({
            title: "获取帖子失败",
            icon: "none"
          });
          recruitPosts.value = [
            {
              id: 1,
              title: "寻找前端开发队友",
              cover: "",
              competitionName: "互联网+",
              intro: "我们正在开发一个校园竞赛平台，需要前端开发队友一起完成项目。",
              skills: ["Vue", "React", "JavaScript"],
              competitionType: "互联网+",
              deadline: "2026-05-15",
              people: 2,
              verificationRequired: true,
              date: "2026-04-15",
              status: "active",
              statusText: "招募中",
              isClosed: false
            },
            {
              id: 2,
              title: "AI项目组队",
              cover: "",
              competitionName: "挑战杯",
              intro: "我们正在开发一个基于AI的智能推荐系统，需要机器学习相关技能的队友。",
              skills: ["Python", "TensorFlow", "机器学习"],
              competitionType: "挑战杯",
              deadline: "2026-05-10",
              people: 3,
              verificationRequired: false,
              date: "2026-04-10",
              status: "closed",
              statusText: "已关闭",
              isClosed: true
            }
          ];
          seekPosts.value = [
            {
              id: 1,
              title: "寻找机器学习项目组队",
              targetTrack: "机器学习",
              skills: ["Python", "机器学习", "数据挖掘"],
              bio: "我是计算机专业大三学生，有丰富的机器学习经验，希望加入一个有潜力的项目团队。",
              date: "2026-04-12",
              status: "active",
              statusText: "求职中",
              isClosed: false
            }
          ];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:216", "获取帖子错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
        recruitPosts.value = [];
        seekPosts.value = [];
      } finally {
        loading.value = false;
      }
    };
    const togglePostStatus = (id, type) => {
      if (type === "recruit") {
        const postIndex = recruitPosts.value.findIndex((p) => p.id === id);
        if (postIndex !== -1) {
          recruitPosts.value.splice(postIndex, 1);
        }
      } else if (type === "seek") {
        const postIndex = seekPosts.value.findIndex((p) => p.id === id);
        if (postIndex !== -1) {
          seekPosts.value.splice(postIndex, 1);
        }
      }
    };
    const editPost = (id, type) => {
      common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:246", "编辑帖子:", id, type);
      if (type === "recruit") {
        const post = recruitPosts.value.find((p) => p.id === id);
        if (post) {
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:251", "找到帖子:", post);
          const postDataStr = JSON.stringify(post);
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:253", "帖子数据长度:", postDataStr.length);
          const encodedData = encodeURIComponent(postDataStr);
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:255", "编码后长度:", encodedData.length);
          common_vendor.index.navigateTo({
            url: `/pages/publish/recruit-teammate?edit=true&postId=${id}&postData=${encodedData}`,
            success: (res) => {
              common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:259", "跳转成功:", res);
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:262", "跳转失败:", err);
            }
          });
        } else {
          common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:266", "未找到帖子:", id);
        }
      } else if (type === "seek") {
        const post = seekPosts.value.find((p) => p.id === id);
        if (post) {
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:271", "找到帖子:", post);
          const postDataStr = JSON.stringify(post);
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:273", "帖子数据长度:", postDataStr.length);
          const encodedData = encodeURIComponent(postDataStr);
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:275", "编码后长度:", encodedData.length);
          common_vendor.index.navigateTo({
            url: `/pages/publish/seek-team?edit=true&postId=${id}&postData=${encodedData}`,
            success: (res) => {
              common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:279", "跳转成功:", res);
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:282", "跳转失败:", err);
            }
          });
        } else {
          common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:286", "未找到帖子:", id);
        }
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack, "18"),
        b: activeTab.value === "recruit" ? 1 : "",
        c: common_vendor.o(($event) => activeTab.value = "recruit", "47"),
        d: activeTab.value === "seek" ? 1 : "",
        e: common_vendor.o(($event) => activeTab.value = "seek", "53"),
        f: activeTab.value === "recruit"
      }, activeTab.value === "recruit" ? common_vendor.e({
        g: recruitPosts.value.length === 0
      }, recruitPosts.value.length === 0 ? {} : {
        h: common_vendor.f(recruitPosts.value, (post, index, i0) => {
          return {
            a: common_vendor.t(post.title),
            b: common_vendor.t(post.statusText),
            c: common_vendor.n(post.status),
            d: common_vendor.t(post.date),
            e: common_vendor.t(post.people),
            f: common_vendor.f(post.skills, (skill, idx, i1) => {
              return {
                a: common_vendor.t(skill),
                b: idx
              };
            }),
            g: common_vendor.t(post.isClosed ? "开启" : "关闭"),
            h: !post.isClosed ? 1 : "",
            i: common_vendor.o(($event) => togglePostStatus(post.id, "recruit"), post.id),
            j: common_vendor.o(($event) => editPost(post.id, "recruit"), post.id),
            k: post.id
          };
        })
      }) : common_vendor.e({
        i: seekPosts.value.length === 0
      }, seekPosts.value.length === 0 ? {} : {
        j: common_vendor.f(seekPosts.value, (post, index, i0) => {
          return {
            a: common_vendor.t(post.title),
            b: common_vendor.t(post.statusText),
            c: common_vendor.n(post.status),
            d: common_vendor.t(post.date),
            e: common_vendor.f(post.skills, (skill, idx, i1) => {
              return {
                a: common_vendor.t(skill),
                b: idx
              };
            }),
            f: common_vendor.t(post.isClosed ? "开启" : "关闭"),
            g: !post.isClosed ? 1 : "",
            h: common_vendor.o(($event) => togglePostStatus(post.id, "seek"), post.id),
            i: common_vendor.o(($event) => editPost(post.id, "seek"), post.id),
            j: post.id
          };
        })
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-16059c8b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/my-posts.js.map
