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
          const data = response.data.data || {};
          const projects = data.projects || [];
          const talentProfile = data.talentProfile;
          recruitPosts.value = projects.map((post) => ({
            id: post.id,
            title: post.title,
            cover: post.coverImage || "",
            competitionName: post.competitionName || "未知竞赛",
            intro: post.description || "",
            skills: post.skills || [],
            competitionType: post.competitionType || "其他",
            deadline: post.deadline || "2026-05-31",
            people: post.peopleNeeded || 1,
            verificationRequired: post.verificationRequired || false,
            date: post.created_at ? new Date(post.created_at).toISOString().split("T")[0] : "2026-04-21",
            status: post.status === "active" ? "active" : "closed",
            statusText: post.status === "active" ? "招募中" : "已关闭",
            isClosed: post.status !== "active"
          }));
          if (talentProfile) {
            seekPosts.value = [
              {
                id: talentProfile.id,
                title: "我的求组队",
                targetTrack: talentProfile.targetTrack || "",
                skills: talentProfile.skills || [],
                bio: talentProfile.bio || "",
                date: talentProfile.created_at ? new Date(talentProfile.created_at).toISOString().split("T")[0] : "2026-04-21",
                status: talentProfile.status === "active" ? "active" : "closed",
                statusText: talentProfile.status === "active" ? "求职中" : "已关闭",
                isClosed: talentProfile.status !== "active"
              }
            ];
          } else {
            seekPosts.value = [];
          }
        } else {
          common_vendor.index.showToast({
            title: "获取帖子失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:194", "获取帖子错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const togglePostStatus = async (id, type) => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        let url = "";
        if (type === "recruit") {
          url = `http://localhost:3000/api/users/projects/${id}/toggle-status`;
        } else if (type === "seek") {
          url = `http://localhost:3000/api/users/talent-profiles/${id}/toggle-status`;
        }
        const response = await common_vendor.index.request({
          url,
          method: "PATCH",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({
            title: "状态切换成功",
            icon: "success"
          });
          await fetchUserPosts();
        } else {
          common_vendor.index.showToast({
            title: "状态切换失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:245", "切换状态错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      }
    };
    const deletePost = (id, type) => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: type === "recruit" ? "确定要删除这个找队友帖子吗？" : "确定要删除这个求组队帖子吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const token = common_vendor.index.getStorageSync("token");
              if (!token) {
                common_vendor.index.showToast({
                  title: "请先登录",
                  icon: "none"
                });
                return;
              }
              let url = "";
              if (type === "recruit") {
                url = `http://localhost:3000/api/users/projects/${id}`;
              } else if (type === "seek") {
                url = `http://localhost:3000/api/users/talent-profiles/${id}`;
              }
              const response = await common_vendor.index.request({
                url,
                method: "DELETE",
                header: {
                  "Authorization": `Bearer ${token}`
                }
              });
              if (response.data && response.data.success) {
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                await fetchUserPosts();
              } else {
                common_vendor.index.showToast({
                  title: "删除失败",
                  icon: "none"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:299", "删除错误:", error);
              common_vendor.index.showToast({
                title: "网络错误，请稍后重试",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const editPost = (id, type) => {
      common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:312", "编辑帖子:", id, type);
      if (type === "recruit") {
        const post = recruitPosts.value.find((p) => p.id === id);
        if (post) {
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:317", "找到帖子:", post);
          const postDataStr = JSON.stringify(post);
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:319", "帖子数据长度:", postDataStr.length);
          const encodedData = encodeURIComponent(postDataStr);
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:321", "编码后长度:", encodedData.length);
          common_vendor.index.navigateTo({
            url: `/pages/publish/recruit-teammate?edit=true&postId=${id}&postData=${encodedData}`,
            success: (res) => {
              common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:325", "跳转成功:", res);
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:328", "跳转失败:", err);
            }
          });
        } else {
          common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:332", "未找到帖子:", id);
        }
      } else if (type === "seek") {
        const post = seekPosts.value.find((p) => p.id === id);
        if (post) {
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:337", "找到帖子:", post);
          const postDataStr = JSON.stringify(post);
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:339", "帖子数据长度:", postDataStr.length);
          const encodedData = encodeURIComponent(postDataStr);
          common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:341", "编码后长度:", encodedData.length);
          common_vendor.index.navigateTo({
            url: `/pages/publish/seek-team?edit=true&postId=${id}&postData=${encodedData}`,
            success: (res) => {
              common_vendor.index.__f__("log", "at pages/profile/my-posts.vue:345", "跳转成功:", res);
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:348", "跳转失败:", err);
            }
          });
        } else {
          common_vendor.index.__f__("error", "at pages/profile/my-posts.vue:352", "未找到帖子:", id);
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
            g: common_vendor.o(($event) => deletePost(post.id, "recruit"), post.id),
            h: common_vendor.t(post.isClosed ? "开启" : "关闭"),
            i: !post.isClosed ? 1 : "",
            j: common_vendor.o(($event) => togglePostStatus(post.id, "recruit"), post.id),
            k: common_vendor.o(($event) => editPost(post.id, "recruit"), post.id),
            l: post.id
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
            f: common_vendor.o(($event) => deletePost(post.id, "seek"), post.id),
            g: common_vendor.t(post.isClosed ? "开启" : "关闭"),
            h: !post.isClosed ? 1 : "",
            i: common_vendor.o(($event) => togglePostStatus(post.id, "seek"), post.id),
            j: common_vendor.o(($event) => editPost(post.id, "seek"), post.id),
            k: post.id
          };
        })
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-16059c8b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/my-posts.js.map
