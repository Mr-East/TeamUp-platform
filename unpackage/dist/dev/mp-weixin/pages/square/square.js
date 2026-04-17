"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  TalentCard();
}
const TalentCard = () => "../../components/TalentCard/TalentCard.js";
const _sfc_main = {
  __name: "square",
  setup(__props) {
    const activeTab = common_vendor.ref("team");
    const switchTab = (tab) => {
      activeTab.value = tab;
    };
    const recruitments = [
      {
        id: 1,
        title: "寻找前端开发队友参加互联网+大赛",
        name: "互联网+",
        logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=competition%20logo%20design&image_size=square",
        publisher: "张三",
        publisherAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
        college: "计算机学院",
        description: "我们正在组建团队参加全国大学生互联网+创新创业大赛，需要前端开发人员。项目是一个智能校园服务平台，主要功能包括校园导航、活动报名、失物招领等。希望有Vue或React开发经验的同学加入我们。",
        skills: ["Vue", "React", "JavaScript", "CSS", "HTML"],
        progress: 60,
        joined: 3,
        total: 5,
        deadline: "2026-05-10",
        members: [
          { name: "张三", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square" },
          { name: "李四", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square" },
          { name: "王五", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square" }
        ],
        comments: [
          {
            name: "赵六",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
            content: "这个项目看起来很有意思，我有Vue开发经验，希望能加入",
            time: "2026-04-10 10:00",
            likes: 5,
            replies: []
          },
          {
            name: "钱七",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square",
            content: "我对这个项目很感兴趣，请问还需要人吗？",
            time: "2026-04-11 14:30",
            likes: 3,
            replies: [
              { content: "还需要的，欢迎加入！" }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "AI项目组队，寻找机器学习专家",
        name: "人工智能挑战赛",
        logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20project%20logo&image_size=square",
        publisher: "李四",
        publisherAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square",
        college: "人工智能学院",
        description: "我们正在开发一个基于深度学习的图像识别系统，用于校园场景的智能分析。项目需要机器学习算法工程师，熟悉Python和TensorFlow优先。",
        skills: ["Python", "TensorFlow", "机器学习", "深度学习"],
        progress: 40,
        joined: 2,
        total: 5,
        deadline: "2026-05-15",
        members: [
          { name: "李四", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square" },
          { name: "孙八", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square" }
        ],
        comments: [
          {
            name: "周九",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
            content: "我有TensorFlow项目经验，想加入团队",
            time: "2026-04-12 09:00",
            likes: 8,
            replies: []
          }
        ]
      },
      {
        id: 3,
        title: "产品设计团队招募UI设计师",
        name: "产品设计大赛",
        logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20design%20logo&image_size=square",
        publisher: "王五",
        publisherAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
        college: "设计学院",
        description: "我们需要一名UI设计师加入产品设计团队，负责APP界面设计和交互优化。有Figma或Sketch经验优先。",
        skills: ["UI设计", "产品经理", "用户研究", "Figma"],
        progress: 75,
        joined: 3,
        total: 4,
        deadline: "2026-05-20",
        members: [
          { name: "王五", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square" },
          { name: "吴六", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square" },
          { name: "郑七", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square" }
        ],
        comments: []
      },
      {
        id: 4,
        title: "后端开发组队，需要Java工程师",
        name: "程序设计竞赛",
        logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=backend%20development%20logo&image_size=square",
        publisher: "赵六",
        publisherAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
        college: "软件学院",
        description: "我们正在开发一个校园社交平台，需要后端开发工程师。熟悉Java、Spring Boot和数据库设计优先。",
        skills: ["Java", "Spring Boot", "数据库", "MySQL"],
        progress: 50,
        joined: 2,
        total: 4,
        deadline: "2026-05-25",
        members: [
          { name: "赵六", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square" },
          { name: "陈八", avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square" }
        ],
        comments: []
      }
    ];
    const talents = [
      {
        id: 1,
        name: "张三",
        major: "计算机科学 · 2024届",
        intro: "专注于AI界面设计，想加入国赛团队。",
        skills: ["UI/UX", "前端开发", "Figma"],
        competitionTypes: ["互联网+", "挑战杯", "AI创新大赛"],
        avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square"
      },
      {
        id: 2,
        name: "王五",
        major: "数字媒体艺术 · 2024届",
        intro: "擅长3D设计与品牌视觉创作。",
        skills: ["3D Design", "Branding"],
        competitionTypes: ["大广赛", "产品设计大赛", "视觉传达设计大赛"],
        avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20female&image_size=square"
      },
      {
        id: 3,
        name: "孙七",
        major: "市场营销 · 2026届",
        intro: "热衷于市场策划与文案创作。",
        skills: ["Marketing", "Copywriting"],
        competitionTypes: ["互联网+", "营销策划大赛", "创新创业大赛"],
        avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square"
      }
    ];
    const goToDetail = (id) => {
      const recruitment = recruitments.find((item) => item.id === id);
      if (recruitment) {
        const dataStr = encodeURIComponent(JSON.stringify(recruitment));
        common_vendor.index.navigateTo({
          url: `/pages/recruitment-detail/recruitment-detail?data=${dataStr}`
        });
      }
    };
    const inviteTeam = (id) => {
      common_vendor.index.__f__("log", "at pages/square/square.vue:260", "邀请组队", id);
    };
    const greet = (id) => {
      common_vendor.index.__f__("log", "at pages/square/square.vue:265", "打个招呼", id);
    };
    const loadMore = () => {
      common_vendor.index.__f__("log", "at pages/square/square.vue:271", "加载更多组队信息");
    };
    const loadMoreTalent = () => {
      common_vendor.index.__f__("log", "at pages/square/square.vue:277", "加载更多人才信息");
    };
    const goToPublish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/publish/recruit-teammate"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: activeTab.value === "team" ? 1 : "",
        b: common_vendor.o(($event) => switchTab("team")),
        c: activeTab.value === "talent" ? 1 : "",
        d: common_vendor.o(($event) => switchTab("talent")),
        e: activeTab.value === "team"
      }, activeTab.value === "team" ? {} : {}, {
        f: activeTab.value === "team"
      }, activeTab.value === "team" ? {
        g: common_vendor.f(recruitments, (item, index, i0) => {
          return {
            a: item.logo,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.publisher),
            e: common_vendor.f(item.skills, (skill, idx, i1) => {
              return {
                a: common_vendor.t(skill),
                b: idx
              };
            }),
            f: item.progress + "%",
            g: common_vendor.t(item.joined),
            h: common_vendor.t(item.total),
            i: common_vendor.t(item.deadline),
            j: index,
            k: common_vendor.o(($event) => goToDetail(item.id), index)
          };
        }),
        h: common_vendor.o(loadMore)
      } : {
        i: common_vendor.f(talents, (talent, index, i0) => {
          return {
            a: index,
            b: talent.id,
            c: common_vendor.o(inviteTeam, index),
            d: common_vendor.o(greet, index),
            e: "6bc6c6b7-0-" + i0,
            f: common_vendor.p({
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
        j: common_vendor.o(loadMoreTalent)
      }, {
        k: common_vendor.o(goToPublish)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6bc6c6b7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/square/square.js.map
