"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "recruit-teammate",
  setup(__props) {
    const showSuccess = common_vendor.ref(false);
    const showSkillModalFlag = common_vendor.ref(false);
    const showCompetitionModalFlag = common_vendor.ref(false);
    const currentCategoryIndex = common_vendor.ref(0);
    const currentCompetitionCategoryIndex = common_vendor.ref(0);
    const showPeopleInput = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      cover: "",
      competitionName: "",
      intro: "",
      skills: [],
      competitionType: "",
      deadline: "",
      people: 1,
      verificationRequired: true
    });
    common_vendor.onLoad((options) => {
      common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:212", "页面加载，接收到的参数：", options);
      if (options.edit === "true" && options.postData) {
        try {
          common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:215", "开始解析帖子数据...");
          common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:216", "postData原始值：", options.postData);
          const decodedData = decodeURIComponent(options.postData);
          common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:218", "解码后的数据：", decodedData);
          const postData = JSON.parse(decodedData);
          common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:220", "解析后的数据：", postData);
          formData.cover = postData.cover || "";
          formData.competitionName = postData.competitionName || postData.title || "";
          formData.intro = postData.intro || "";
          formData.skills = postData.skills || [];
          formData.competitionType = postData.competitionType || "";
          formData.deadline = postData.deadline || postData.date || "";
          formData.people = postData.people || 1;
          formData.verificationRequired = postData.verificationRequired !== false;
          common_vendor.index.__f__("log", "at pages/publish/recruit-teammate.vue:230", "编辑模式加载成功，表单数据：", formData);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/publish/recruit-teammate.vue:232", "解析帖子数据失败", e);
        }
      }
    });
    const peopleOptions = ["1 人", "2 人", "3 人", "更多"];
    const competitionTypeOptions = {
      "创新创业": ["互联网+", "挑战杯", "创青春", "中国创新创业大赛", "青年红色筑梦之旅", "创业计划大赛"],
      "学科竞赛": ["数学建模", "电子设计大赛", "机械设计大赛", "程序设计大赛", "英语竞赛", "数学竞赛", "物理竞赛", "化学竞赛"],
      "技能大赛": ["职业技能大赛", "软件设计大赛", "网络安全大赛", "云计算大赛", "大数据大赛", "人工智能大赛"],
      "艺术设计": ["大广赛", "广告艺术大赛", "包装设计大赛", "环境设计大赛", "动画设计大赛", "工业设计大赛"],
      "科研项目": ["大创项目", "挑战杯学术赛道", "实验室项目", "学术论文竞赛", "暑期社会实践"]
    };
    const competitionCategories = Object.keys(competitionTypeOptions);
    const skillOptions = {
      "前端": ["Vue", "React", "Angular", "JavaScript", "TypeScript", "HTML/CSS", "小程序开发", "Node.js"],
      "后端": ["Python", "Java", "Go", "PHP", "C++", "C#", "Spring Boot", "Django"],
      "移动端": ["Android", "iOS", "Flutter", "React Native", "Uni-app"],
      "AI/数据": ["机器学习", "深度学习", "数据分析", "数据挖掘", "计算机视觉", "自然语言处理"],
      "设计": ["UI设计", "UX设计", "视觉设计", "产品设计", "交互设计", "Photoshop", "Figma"],
      "产品/运营": ["产品经理", "需求分析", "项目管理", "运营策划", "市场营销"],
      "其他": ["测试工程", "DevOps", "云计算", "网络安全", "区块链", "硬件开发"]
    };
    const skillCategories = Object.keys(skillOptions);
    const switchToSeek = () => {
      common_vendor.index.redirectTo({
        url: "/pages/publish/seek-team"
      });
    };
    const uploadCover = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths;
          common_vendor.index.showLoading({ title: "上传中..." });
          common_vendor.index.uploadFile({
            url: "http://localhost:3000/api/upload",
            filePath: tempFilePaths[0],
            name: "file",
            header: {
              "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
            },
            success: (uploadRes) => {
              common_vendor.index.hideLoading();
              try {
                const data = JSON.parse(uploadRes.data);
                if (data.success) {
                  formData.cover = data.data.url;
                  common_vendor.index.showToast({ title: "上传成功", icon: "success" });
                } else {
                  common_vendor.index.showToast({ title: "上传失败", icon: "none" });
                }
              } catch (e) {
                common_vendor.index.showToast({ title: "上传失败", icon: "none" });
              }
            },
            fail: (err) => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "上传失败", icon: "none" });
              common_vendor.index.__f__("error", "at pages/publish/recruit-teammate.vue:307", "上传失败", err);
            }
          });
        }
      });
    };
    const removeSkill = (index) => {
      formData.skills.splice(index, 1);
    };
    const showSkillModal = () => {
      showSkillModalFlag.value = true;
      currentCategoryIndex.value = 0;
    };
    const closeSkillModal = () => {
      showSkillModalFlag.value = false;
    };
    const toggleSkill = (skill) => {
      const index = formData.skills.indexOf(skill);
      if (index > -1) {
        formData.skills.splice(index, 1);
      } else {
        if (formData.skills.length < 5) {
          formData.skills.push(skill);
        } else {
          common_vendor.index.showToast({ title: "最多选择5个技能", icon: "none" });
        }
      }
    };
    const showCompetitionModal = () => {
      showCompetitionModalFlag.value = true;
      currentCompetitionCategoryIndex.value = 0;
    };
    const closeCompetitionModal = () => {
      showCompetitionModalFlag.value = false;
    };
    const selectCompetition = (competition) => {
      formData.competitionType = competition;
    };
    const togglePeopleInput = () => {
      showPeopleInput.value = !showPeopleInput.value;
    };
    const onPeopleChange = (e) => {
      const index = e.detail.value;
      formData.people = index + 1;
    };
    const onDateChange = (e) => {
      formData.deadline = e.detail.value;
    };
    const toggleVerification = (e) => {
      formData.verificationRequired = e.detail.value;
    };
    const submitForm = async () => {
      var _a;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          return;
        }
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/projects",
          method: "POST",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            title: formData.competitionName,
            competitionName: formData.competitionName,
            description: formData.intro,
            skills: formData.skills,
            competitionType: formData.competitionType,
            deadline: formData.deadline,
            peopleNeeded: formData.people,
            coverImage: formData.cover,
            verificationRequired: formData.verificationRequired
          }
        });
        if (response.data && response.data.success) {
          showSuccess.value = true;
          setTimeout(() => {
            showSuccess.value = false;
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: ((_a = response.data) == null ? void 0 : _a.message) || "发布失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/publish/recruit-teammate.vue:408", "发布失败", error);
        common_vendor.index.showToast({ title: "发布失败，请重试", icon: "none" });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(switchToSeek, "e1"),
        b: formData.cover
      }, formData.cover ? {
        c: formData.cover
      } : {}, {
        d: common_vendor.o(uploadCover, "f3"),
        e: formData.competitionName,
        f: common_vendor.o(($event) => formData.competitionName = $event.detail.value, "f0"),
        g: formData.intro,
        h: common_vendor.o(($event) => formData.intro = $event.detail.value, "91"),
        i: common_vendor.f(formData.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        j: common_vendor.o(showSkillModal, "3e"),
        k: showSkillModalFlag.value
      }, showSkillModalFlag.value ? {
        l: common_vendor.o(closeSkillModal, "d2"),
        m: common_vendor.f(common_vendor.unref(skillCategories), (category, index, i0) => {
          return {
            a: common_vendor.t(category),
            b: index,
            c: common_vendor.n({
              active: currentCategoryIndex.value === index
            }),
            d: common_vendor.o(($event) => currentCategoryIndex.value = index, index)
          };
        }),
        n: common_vendor.f(skillOptions[common_vendor.unref(skillCategories)[currentCategoryIndex.value]], (skill, sIndex, i0) => {
          return {
            a: common_vendor.t(skill),
            b: sIndex,
            c: common_vendor.n({
              selected: formData.skills.includes(skill)
            }),
            d: common_vendor.o(($event) => toggleSkill(skill), sIndex)
          };
        }),
        o: common_vendor.t(formData.skills.length),
        p: common_vendor.o(closeSkillModal, "31"),
        q: common_vendor.o(() => {
        }, "21"),
        r: common_vendor.o(closeSkillModal, "b0")
      } : {}, {
        s: showCompetitionModalFlag.value
      }, showCompetitionModalFlag.value ? {
        t: common_vendor.o(closeCompetitionModal, "96"),
        v: common_vendor.f(common_vendor.unref(competitionCategories), (category, index, i0) => {
          return {
            a: common_vendor.t(category),
            b: index,
            c: common_vendor.n({
              active: currentCompetitionCategoryIndex.value === index
            }),
            d: common_vendor.o(($event) => currentCompetitionCategoryIndex.value = index, index)
          };
        }),
        w: common_vendor.f(competitionTypeOptions[common_vendor.unref(competitionCategories)[currentCompetitionCategoryIndex.value]], (competition, cIndex, i0) => {
          return {
            a: common_vendor.t(competition),
            b: cIndex,
            c: common_vendor.n({
              selected: formData.competitionType === competition
            }),
            d: common_vendor.o(($event) => selectCompetition(competition), cIndex)
          };
        }),
        x: common_vendor.t(formData.competitionType || "请选择赛事类型"),
        y: common_vendor.o(closeCompetitionModal, "90"),
        z: common_vendor.o(() => {
        }, "16"),
        A: common_vendor.o(closeCompetitionModal, "c4")
      } : {}, {
        B: common_vendor.t(formData.competitionType || "请选择赛事类型"),
        C: common_vendor.o(showCompetitionModal, "83"),
        D: common_vendor.t(formData.deadline || "请选择日期"),
        E: common_vendor.o(onDateChange, "44"),
        F: !showPeopleInput.value
      }, !showPeopleInput.value ? {
        G: common_vendor.t(formData.people),
        H: peopleOptions,
        I: common_vendor.o(onPeopleChange, "6f")
      } : {
        J: formData.people,
        K: common_vendor.o(common_vendor.m(($event) => formData.people = $event.detail.value, {
          number: true
        }), "33")
      }, {
        L: common_vendor.t(showPeopleInput.value ? "选择" : "输入"),
        M: common_vendor.o(togglePeopleInput, "dc"),
        N: formData.verificationRequired,
        O: common_vendor.o(toggleVerification, "33"),
        P: common_vendor.o(submitForm, "53"),
        Q: showSuccess.value
      }, showSuccess.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5f23ae20"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/recruit-teammate.js.map
