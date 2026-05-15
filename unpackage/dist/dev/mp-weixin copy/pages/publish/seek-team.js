"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "seek-team",
  setup(__props) {
    const showSuccess = common_vendor.ref(false);
    const isSkillPickerVisible = common_vendor.ref(false);
    const currentCategoryIndex = common_vendor.ref(0);
    const isEditMode = common_vendor.ref(false);
    const editPostId = common_vendor.ref(null);
    const userInfo = common_vendor.ref({
      name: "",
      role: "",
      school: "",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square"
    });
    const formData = common_vendor.reactive({
      targetTrack: "",
      skills: [],
      bio: ""
    });
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
    common_vendor.onLoad(async (options) => {
      common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:191", "页面加载，接收到的参数：", options);
      await getUserInfo();
      if (options.edit === "true" && options.postData) {
        isEditMode.value = true;
        editPostId.value = options.postId;
        try {
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:200", "开始解析帖子数据...");
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:201", "postData原始值：", options.postData);
          const decodedData = decodeURIComponent(options.postData);
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:203", "解码后的数据：", decodedData);
          const postData = JSON.parse(decodedData);
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:205", "解析后的数据：", postData);
          formData.targetTrack = postData.targetTrack || postData.title || "";
          formData.skills = postData.skills || [];
          formData.bio = postData.bio || "";
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:210", "编辑模式加载成功，表单数据：", formData);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/publish/seek-team.vue:212", "解析帖子数据失败", e);
        }
      }
    });
    const getUserInfo = async () => {
      var _a;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:222", "未找到token，用户可能未登录");
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          return;
        }
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/users/me",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:235", "获取用户信息响应:", response);
        if (response.data && response.data.success) {
          const user = response.data.data;
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:239", "用户数据:", user);
          userInfo.value = {
            name: user.name || user.username || "未设置用户名",
            role: user.role || "",
            school: user.college && user.major ? `${user.college} · ${user.major}` : user.college || user.major || "",
            avatar: user.avatar || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square"
          };
          common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:246", "设置后的userInfo:", userInfo.value);
        } else {
          common_vendor.index.__f__("error", "at pages/publish/seek-team.vue:248", "获取用户信息失败:", (_a = response.data) == null ? void 0 : _a.message);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/publish/seek-team.vue:251", "获取用户信息失败:", error);
      }
    };
    const switchToRecruit = () => {
      common_vendor.index.redirectTo({
        url: "/pages/publish/recruit-teammate"
      });
    };
    const removeSkill = (index) => {
      formData.skills.splice(index, 1);
    };
    const openSkillPicker = () => {
      isSkillPickerVisible.value = true;
      currentCategoryIndex.value = 0;
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
    const closeSkillPicker = () => {
      isSkillPickerVisible.value = false;
    };
    const submitForm = async () => {
      var _a;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.showToast({ title: "请先登录", icon: "none" });
          return;
        }
        common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:301", "submitForm - isEditMode:", isEditMode.value, "editPostId:", editPostId.value);
        const isEdit = isEditMode.value && editPostId.value;
        const url = isEdit ? `http://localhost:3000/api/talent-profiles/${editPostId.value}` : "http://localhost:3000/api/talent-profiles";
        const method = isEdit ? "PUT" : "POST";
        common_vendor.index.__f__("log", "at pages/publish/seek-team.vue:307", "submitForm - isEdit:", isEdit, "url:", url, "method:", method);
        const response = await common_vendor.index.request({
          url,
          method,
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            targetTrack: formData.targetTrack,
            skills: formData.skills,
            bio: formData.bio
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
        common_vendor.index.__f__("error", "at pages/publish/seek-team.vue:333", "发布失败", error);
        common_vendor.index.showToast({ title: "发布失败，请重试", icon: "none" });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(switchToRecruit, "24"),
        b: formData.targetTrack,
        c: common_vendor.o(($event) => formData.targetTrack = $event.detail.value, "29"),
        d: common_vendor.f(formData.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        e: common_vendor.o(openSkillPicker, "10"),
        f: common_vendor.t(formData.bio.length),
        g: formData.bio,
        h: common_vendor.o(($event) => formData.bio = $event.detail.value, "d7"),
        i: userInfo.value.avatar || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
        j: common_vendor.t(userInfo.value.name || "加载中..."),
        k: common_vendor.t(userInfo.value.role || ""),
        l: common_vendor.t(userInfo.value.school || ""),
        m: formData.targetTrack
      }, formData.targetTrack ? {
        n: common_vendor.t(formData.targetTrack)
      } : {}, {
        o: common_vendor.t(formData.bio || "正在输入个人简介..."),
        p: common_vendor.f(formData.skills, (skill, idx, i0) => {
          return {
            a: common_vendor.t(skill),
            b: idx
          };
        }),
        q: formData.skills.length === 0
      }, formData.skills.length === 0 ? {} : {}, {
        r: common_vendor.o(submitForm, "3c"),
        s: showSuccess.value
      }, showSuccess.value ? {} : {}, {
        t: isSkillPickerVisible.value
      }, isSkillPickerVisible.value ? {
        v: common_vendor.o(closeSkillPicker, "13"),
        w: common_vendor.o(closeSkillPicker, "99"),
        x: common_vendor.f(common_vendor.unref(skillCategories), (category, index, i0) => {
          return {
            a: common_vendor.t(category),
            b: index,
            c: common_vendor.n({
              active: currentCategoryIndex.value === index
            }),
            d: common_vendor.o(($event) => currentCategoryIndex.value = index, index)
          };
        }),
        y: common_vendor.f(skillOptions[common_vendor.unref(skillCategories)[currentCategoryIndex.value]], (skill, sIndex, i0) => {
          return {
            a: common_vendor.t(skill),
            b: sIndex,
            c: common_vendor.n({
              selected: formData.skills.includes(skill)
            }),
            d: common_vendor.o(($event) => toggleSkill(skill), sIndex)
          };
        }),
        z: common_vendor.t(formData.skills.length),
        A: common_vendor.o(closeSkillPicker, "32")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9520fa2f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/seek-team.js.map
