"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const competitions = [
      {
        title: "全国大学生互联网+创新创业大赛",
        name: "互联网+",
        date: "2026-06-30",
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=innovation%20competition%20poster&image_size=square"
      },
      {
        title: "全国大学生数学建模竞赛",
        name: "数学建模",
        date: "2026-09-15",
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mathematical%20modeling%20competition&image_size=square"
      },
      {
        title: "全国大学生程序设计竞赛",
        name: "程序设计",
        date: "2026-10-20",
        img: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=programming%20competition%20banner&image_size=square"
      }
    ];
    const recruitments = [
      {
        title: "寻找前端开发队友",
        skills: ["Vue", "React", "JavaScript"],
        date: "2026-05-10",
        people: 2
      },
      {
        title: "AI项目组队",
        skills: ["Python", "TensorFlow", "机器学习"],
        date: "2026-05-15",
        people: 3
      },
      {
        title: "产品设计团队招募",
        skills: ["UI设计", "产品经理", "用户研究"],
        date: "2026-05-20",
        people: 2
      },
      {
        title: "后端开发组队",
        skills: ["Java", "Spring Boot", "数据库"],
        date: "2026-05-25",
        people: 2
      }
    ];
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(competitions, (item, index, i0) => {
          return {
            a: item.img,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.date),
            e: index
          };
        }),
        b: common_vendor.f(recruitments, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.f(item.skills, (skill, idx, i1) => {
              return {
                a: common_vendor.t(skill),
                b: idx
              };
            }),
            c: common_vendor.t(item.date),
            d: common_vendor.t(item.people),
            e: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
