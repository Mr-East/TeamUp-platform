"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "recruitment-detail",
  setup(__props) {
    const recruitmentId = common_vendor.ref("");
    const recruitment = common_vendor.ref({
      id: 1,
      title: "AI 驱动的校园二手交易平台 - 算法优化项目",
      logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square",
      publisher: "Alex Zhang",
      publisherAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
      college: "计算机科学与技术学院",
      description: "我们正在开发一个AI驱动的校园二手交易平台，通过机器学习算法实现智能推荐和价格预测。项目已经获得校级立项，现需要前端开发和算法优化的同学加入。我们的目标是参加互联网+大赛，希望有相关经验的同学一起合作。",
      skills: ["Vue", "React", "JavaScript", "Python", "机器学习"],
      joined: 2,
      total: 4,
      deadline: "2026-05-10",
      members: [
        { name: "Alex Zhang", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square" },
        { name: "Lisa Wang", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square" }
      ],
      comments: [
        {
          name: "Li Wei",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square",
          content: "大三小白可以申请吗？我熟悉 Python 但是没有做过推荐算法相关的项目。",
          time: "2h ago",
          likes: 14,
          replies: [
            {
              content: "可以的，只要有学习热情就行，我们可以一起讨论。"
            }
          ]
        },
        {
          name: "Wang Tao",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
          content: "我对这个项目很感兴趣，有前端开发经验，希望能加入",
          time: "5h ago",
          likes: 8,
          replies: []
        }
      ]
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const toggleFavorite = () => {
      common_vendor.index.__f__("log", "at pages/recruitment-detail/recruitment-detail.vue:184", "切换收藏状态");
    };
    const showComment = () => {
      common_vendor.index.__f__("log", "at pages/recruitment-detail/recruitment-detail.vue:188", "显示评论输入框");
    };
    const sendMessage = () => {
      common_vendor.index.__f__("log", "at pages/recruitment-detail/recruitment-detail.vue:192", "发送私信");
    };
    const joinTeam = () => {
      common_vendor.index.__f__("log", "at pages/recruitment-detail/recruitment-detail.vue:196", "加入团队");
    };
    common_vendor.onLoad((options) => {
      if (options.data) {
        try {
          const decodedData = decodeURIComponent(options.data);
          const data = JSON.parse(decodedData);
          recruitment.value = data;
          recruitmentId.value = data.id;
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/recruitment-detail/recruitment-detail.vue:208", "解析项目数据失败", e);
        }
      }
      common_vendor.index.__f__("log", "at pages/recruitment-detail/recruitment-detail.vue:211", "获取招募详情数据", recruitmentId.value);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.t(recruitment.value.title),
        c: recruitment.value.logo,
        d: recruitment.value.publisherAvatar,
        e: common_vendor.t(recruitment.value.publisher),
        f: common_vendor.t(recruitment.value.college),
        g: common_vendor.t(recruitment.value.joined),
        h: common_vendor.t(recruitment.value.total),
        i: common_vendor.t(recruitment.value.deadline),
        j: common_vendor.t(recruitment.value.joined),
        k: common_vendor.t(recruitment.value.total),
        l: common_vendor.f(recruitment.value.members, (member, index, i0) => {
          return {
            a: member.avatar,
            b: index
          };
        }),
        m: recruitment.value.total > recruitment.value.joined
      }, recruitment.value.total > recruitment.value.joined ? {
        n: common_vendor.t(recruitment.value.total - recruitment.value.joined)
      } : {}, {
        o: common_vendor.t(recruitment.value.description),
        p: common_vendor.f(recruitment.value.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: index
          };
        }),
        q: common_vendor.t(recruitment.value.comments.length),
        r: common_vendor.f(recruitment.value.comments, (comment, index, i0) => {
          return common_vendor.e({
            a: comment.avatar,
            b: common_vendor.t(comment.name),
            c: common_vendor.t(comment.time),
            d: common_vendor.t(comment.content),
            e: common_vendor.t(comment.likes),
            f: comment.replies && comment.replies.length > 0
          }, comment.replies && comment.replies.length > 0 ? {
            g: recruitment.value.publisherAvatar,
            h: common_vendor.t(recruitment.value.publisher),
            i: common_vendor.t(comment.name),
            j: common_vendor.t(comment.replies[0].content)
          } : {}, {
            k: index
          });
        }),
        s: common_vendor.o(toggleFavorite),
        t: common_vendor.o(showComment),
        v: common_vendor.o(sendMessage),
        w: common_vendor.o(joinTeam)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-32e38509"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/recruitment-detail/recruitment-detail.js.map
