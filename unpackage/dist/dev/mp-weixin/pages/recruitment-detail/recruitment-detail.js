"use strict";
const common_vendor = require("../../common/vendor.js");
const defaultAvatar = "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square";
const _sfc_main = {
  __name: "recruitment-detail",
  setup(__props) {
    const recruitmentId = common_vendor.ref("");
    const recruitment = common_vendor.ref({});
    const comments = common_vendor.ref([]);
    const newComment = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const error = common_vendor.ref("");
    const joinStatus = common_vendor.ref("none");
    const replyToComment = common_vendor.ref(null);
    const replyContent = common_vendor.ref("");
    const isUrgent = common_vendor.computed(() => {
      if (!recruitment.value.deadline)
        return false;
      const deadline = new Date(recruitment.value.deadline);
      const now = /* @__PURE__ */ new Date();
      const diffDays = Math.ceil((deadline - now) / (1e3 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays > 0;
    });
    const formattedDeadline = common_vendor.computed(() => {
      if (!recruitment.value.deadline)
        return "未设置";
      const deadline = new Date(recruitment.value.deadline);
      const now = /* @__PURE__ */ new Date();
      const diffDays = Math.ceil((deadline - now) / (1e3 * 60 * 60 * 24));
      if (diffDays < 0) {
        return `已结束`;
      } else if (diffDays === 0) {
        return `今天截止`;
      } else if (diffDays === 1) {
        return `明天截止`;
      } else if (diffDays <= 7) {
        return `${diffDays}天后截止`;
      } else {
        return deadline.toLocaleDateString("zh-CN", { month: "long", day: "numeric", year: "numeric" });
      }
    });
    const joinButtonText = common_vendor.computed(() => {
      switch (joinStatus.value) {
        case "owner":
          return "我的项目";
        case "member":
          return "已加入";
        case "pending":
          return "等待审核";
        case "rejected":
          return "已拒绝";
        default:
          return "我要加入";
      }
    });
    const fetchProjectDetail = async () => {
      var _a, _b, _c, _d, _e;
      try {
        loading.value = true;
        error.value = "";
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects/${recruitmentId.value}`,
          method: "GET",
          header: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (response.data && response.data.success) {
          const data = response.data.data;
          recruitment.value = {
            id: data.id,
            title: data.title,
            description: data.description,
            logo: data.coverImage,
            publisher: (_a = data.creator) == null ? void 0 : _a.name,
            publisherAvatar: (_b = data.creator) == null ? void 0 : _b.avatar,
            publisherCollege: (_c = data.creator) == null ? void 0 : _c.college,
            publisherMajor: (_d = data.creator) == null ? void 0 : _d.major,
            publisherId: (_e = data.creator) == null ? void 0 : _e.id,
            deadline: data.deadline,
            joined: 0,
            total: data.peopleNeeded,
            skills: data.skills || [],
            status: data.status,
            creatorId: data.createdBy
          };
          await Promise.all([
            fetchProjectMembers(),
            fetchJoinStatus(),
            fetchComments()
          ]);
        } else {
          error.value = "获取项目详情失败";
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:290", "获取项目详情错误:", err);
        error.value = "网络错误，请稍后重试";
      } finally {
        loading.value = false;
      }
    };
    const fetchProjectMembers = async () => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects/${recruitmentId.value}/members`,
          method: "GET",
          header: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (response.data && response.data.success) {
          recruitment.value.members = response.data.data.map((m) => {
            var _a, _b;
            return {
              id: m.userId,
              name: (_a = m.User) == null ? void 0 : _a.name,
              avatar: (_b = m.User) == null ? void 0 : _b.avatar
            };
          });
          recruitment.value.joined = response.data.data.length;
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:315", "获取项目成员错误:", err);
      }
    };
    const fetchJoinStatus = async () => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token)
          return;
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects/${recruitmentId.value}/join-status`,
          method: "GET",
          header: { "Authorization": `Bearer ${token}` }
        });
        if (response.data && response.data.success) {
          joinStatus.value = response.data.data.status;
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:334", "获取加入状态错误:", err);
      }
    };
    const fetchComments = async () => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects/${recruitmentId.value}/comments`,
          method: "GET",
          header: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (response.data && response.data.success) {
          comments.value = response.data.data || [];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:351", "获取评论错误:", err);
      }
    };
    const submitComment = async () => {
      var _a;
      if (!newComment.value.trim()) {
        common_vendor.index.showToast({ title: "请输入评论内容", icon: "none" });
        return;
      }
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.navigateTo({ url: "/pages/login/login" });
          return;
        }
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects/${recruitmentId.value}/comments`,
          method: "POST",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: { content: newComment.value.trim() }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({ title: "评论成功", icon: "success" });
          newComment.value = "";
          await fetchComments();
        } else {
          common_vendor.index.showToast({ title: ((_a = response.data) == null ? void 0 : _a.message) || "评论失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:386", "提交评论错误:", err);
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      }
    };
    const submitReply = async () => {
      var _a;
      if (!replyContent.value.trim()) {
        common_vendor.index.showToast({ title: "请输入回复内容", icon: "none" });
        return;
      }
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.navigateTo({ url: "/pages/login/login" });
          return;
        }
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects/${recruitmentId.value}/comments`,
          method: "POST",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            content: replyContent.value.trim(),
            parentCommentId: replyToComment.value.id
          }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({ title: "回复成功", icon: "success" });
          replyContent.value = "";
          replyToComment.value = null;
          await fetchComments();
        } else {
          common_vendor.index.showToast({ title: ((_a = response.data) == null ? void 0 : _a.message) || "回复失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:426", "提交回复错误:", err);
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      }
    };
    const handleReply = (comment) => {
      replyToComment.value = comment;
      replyContent.value = "";
      common_vendor.index.pageScrollTo({
        selector: ".comment-input-area",
        duration: 300
      });
    };
    const cancelReply = () => {
      replyContent.value = "";
      replyToComment.value = null;
    };
    const sendComment = () => {
      if (replyToComment.value) {
        submitReply();
      } else {
        submitComment();
      }
    };
    const likeComment = async (commentId) => {
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token)
          return;
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects/comments/${commentId}/like`,
          method: "PUT",
          header: { "Authorization": `Bearer ${token}` }
        });
        if (response.data && response.data.success) {
          await fetchComments();
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:472", "点赞评论错误:", err);
      }
    };
    const handleJoin = async () => {
      if (joinStatus.value !== "none") {
        if (joinStatus.value === "pending") {
          common_vendor.index.showToast({ title: "您的申请正在审核中", icon: "none" });
        } else if (joinStatus.value === "member") {
          common_vendor.index.showToast({ title: "您已是项目成员", icon: "none" });
        } else if (joinStatus.value === "owner") {
          common_vendor.index.showToast({ title: "这是您的项目", icon: "none" });
        }
        return;
      }
      common_vendor.index.showModal({
        title: "申请加入",
        editable: true,
        placeholderText: "请输入申请理由（选填）",
        success: async (res) => {
          if (res.confirm) {
            await submitJoinApplication(res.content || "");
          }
        }
      });
    };
    const submitJoinApplication = async (reasonText) => {
      var _a;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.navigateTo({ url: "/pages/login/login" });
          return;
        }
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/projects/${recruitmentId.value}/join`,
          method: "POST",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: { reasonText }
        });
        if (response.data && response.data.success) {
          common_vendor.index.showToast({ title: "申请已提交", icon: "success" });
          await fetchJoinStatus();
        } else {
          common_vendor.index.showToast({ title: ((_a = response.data) == null ? void 0 : _a.message) || "申请失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:525", "提交申请错误:", err);
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      }
    };
    const sendPrivateMessage = () => {
      if (!recruitment.value.publisherId) {
        common_vendor.index.showToast({ title: "无法获取用户信息", icon: "none" });
        return;
      }
      const currentUser = common_vendor.index.getStorageSync("userInfo");
      if (currentUser && currentUser.id === recruitment.value.publisherId) {
        common_vendor.index.showToast({ title: "不能给自己发私信", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?otherUserId=${recruitment.value.publisherId}&name=${encodeURIComponent(recruitment.value.publisher || "用户")}&avatar=${encodeURIComponent(recruitment.value.publisherAvatar || "")}`
      });
    };
    const showComment = () => {
      common_vendor.index.pageScrollTo({
        selector: ".comment-input-area",
        duration: 300
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToPersonInfo = () => {
      if (recruitment.value.publisherId) {
        common_vendor.index.navigateTo({
          url: `/pages/personInfo/personInfo?userId=${recruitment.value.publisherId}`
        });
      }
    };
    const goToMemberInfo = (userId) => {
      if (userId) {
        common_vendor.index.navigateTo({
          url: `/pages/personInfo/personInfo?userId=${userId}`
        });
      }
    };
    const formatCommentTime = (timeString) => {
      if (!timeString)
        return "";
      const date = new Date(timeString);
      const now = /* @__PURE__ */ new Date();
      const diffTime = now - date;
      const diffMinutes = Math.floor(diffTime / (1e3 * 60));
      const diffHours = Math.floor(diffTime / (1e3 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
      if (diffMinutes < 1) {
        return "刚刚";
      } else if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
      } else if (diffHours < 24) {
        return `${diffHours}小时前`;
      } else if (diffDays < 7) {
        return `${diffDays}天前`;
      } else {
        return date.toLocaleDateString("zh-CN");
      }
    };
    common_vendor.onLoad((options) => {
      if (options.data) {
        try {
          const decodedData = decodeURIComponent(options.data);
          const data = JSON.parse(decodedData);
          recruitmentId.value = data.id;
          recruitment.value = {
            ...recruitment.value,
            ...data
          };
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:608", "解析项目数据失败", e);
        }
      }
      if (options.id) {
        recruitmentId.value = options.id;
      }
      if (recruitmentId.value) {
        fetchProjectDetail();
      }
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.o(goBack, "2d"),
        b: loading.value
      }, loading.value ? {} : error.value ? {
        d: common_vendor.t(error.value),
        e: common_vendor.o(fetchProjectDetail, "e2")
      } : common_vendor.e({
        f: common_vendor.t(recruitment.value.status === "active" ? "Recruiting Now" : "已关闭"),
        g: recruitment.value.status !== "active" ? 1 : "",
        h: common_vendor.t(recruitment.value.title),
        i: recruitment.value.logo || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square",
        j: recruitment.value.publisherAvatar || defaultAvatar,
        k: common_vendor.o(goToPersonInfo, "ce"),
        l: common_vendor.t(recruitment.value.publisher || "未知用户"),
        m: common_vendor.t(recruitment.value.publisherCollege || ""),
        n: common_vendor.t(recruitment.value.publisherMajor || ""),
        o: common_vendor.o(sendPrivateMessage, "5c"),
        p: common_vendor.t(recruitment.value.joined || 0),
        q: common_vendor.t(recruitment.value.total || 0),
        r: common_vendor.t(formattedDeadline.value),
        s: isUrgent.value ? 1 : "",
        t: common_vendor.t(recruitment.value.joined || 0),
        v: common_vendor.t(recruitment.value.total || 0),
        w: common_vendor.f(recruitment.value.members, (member, index, i0) => {
          return {
            a: member.avatar || defaultAvatar,
            b: index,
            c: common_vendor.o(($event) => goToMemberInfo(member.id), index)
          };
        }),
        x: (recruitment.value.total || 0) > (recruitment.value.joined || 0)
      }, (recruitment.value.total || 0) > (recruitment.value.joined || 0) ? {
        y: common_vendor.t((recruitment.value.total || 0) - (recruitment.value.joined || 0))
      } : {}, {
        z: common_vendor.t(recruitment.value.description || "暂无描述"),
        A: recruitment.value.skills && recruitment.value.skills.length > 0
      }, recruitment.value.skills && recruitment.value.skills.length > 0 ? {
        B: common_vendor.f(recruitment.value.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: index
          };
        })
      } : {}), {
        c: error.value,
        C: common_vendor.t(comments.value.length),
        D: common_vendor.o(fetchComments, "db"),
        E: common_vendor.f(comments.value, (comment, index, i0) => {
          var _a2, _b2;
          return common_vendor.e({
            a: ((_a2 = comment.user) == null ? void 0 : _a2.avatar) || defaultAvatar,
            b: common_vendor.o(($event) => goToMemberInfo(comment.userId), comment.id),
            c: common_vendor.t(((_b2 = comment.user) == null ? void 0 : _b2.name) || "匿名用户"),
            d: common_vendor.t(formatCommentTime(comment.created_at)),
            e: common_vendor.t(comment.content),
            f: common_vendor.t(comment.likesCount || 0),
            g: common_vendor.o(($event) => likeComment(comment.id), comment.id),
            h: common_vendor.o(($event) => handleReply(comment), comment.id),
            i: comment.replies && comment.replies.length > 0
          }, comment.replies && comment.replies.length > 0 ? {
            j: common_vendor.f(comment.replies, (reply, rIndex, i1) => {
              var _a3, _b3;
              return common_vendor.e({
                a: ((_a3 = reply.user) == null ? void 0 : _a3.avatar) || defaultAvatar,
                b: common_vendor.o(($event) => goToMemberInfo(reply.userId), reply.id),
                c: common_vendor.t(((_b3 = reply.user) == null ? void 0 : _b3.name) || "匿名用户"),
                d: reply.parent && reply.parent.user
              }, reply.parent && reply.parent.user ? {
                e: common_vendor.t(reply.parent.user.name)
              } : {}, {
                f: common_vendor.t(formatCommentTime(reply.created_at)),
                g: common_vendor.t(reply.content),
                h: common_vendor.o(($event) => handleReply(reply), reply.id),
                i: reply.id
              });
            })
          } : {}, {
            k: comment.id
          });
        }),
        F: comments.value.length === 0
      }, comments.value.length === 0 ? {} : {}, {
        G: replyToComment.value
      }, replyToComment.value ? {
        H: common_vendor.t(((_a = replyToComment.value.user) == null ? void 0 : _a.name) || "用户"),
        I: common_vendor.o(cancelReply, "2f")
      } : {}, {
        J: !replyToComment.value
      }, !replyToComment.value ? {
        K: common_vendor.o(submitComment, "3a"),
        L: newComment.value,
        M: common_vendor.o(($event) => newComment.value = $event.detail.value, "ef")
      } : {
        N: `回复 ${((_b = replyToComment.value.user) == null ? void 0 : _b.name) || "用户"}...`,
        O: common_vendor.o(submitReply, "ca"),
        P: replyContent.value,
        Q: common_vendor.o(($event) => replyContent.value = $event.detail.value, "8c")
      }, {
        R: common_vendor.o(sendComment, "a8"),
        S: common_vendor.o(showComment, "c5"),
        T: common_vendor.o(sendPrivateMessage, "a9"),
        U: common_vendor.t(joinButtonText.value),
        V: joinStatus.value !== "none" ? 1 : "",
        W: common_vendor.o(handleJoin, "f8")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-32e38509"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/recruitment-detail/recruitment-detail.js.map
