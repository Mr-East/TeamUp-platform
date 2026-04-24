"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "edit-profile",
  setup(__props) {
    const profileForm = common_vendor.ref({
      name: "默认用户",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
      college: "默认学院",
      major: "默认专业",
      skills: [],
      bio: ""
    });
    const showSuccess = common_vendor.ref(false);
    const loading = common_vendor.ref(true);
    common_vendor.onMounted(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return;
      }
      await fetchUserInfo();
    });
    const fetchUserInfo = async () => {
      try {
        loading.value = true;
        const token = common_vendor.index.getStorageSync("token");
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/users/me",
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          profileForm.value = {
            name: response.data.data.name || "张三",
            avatar: response.data.data.avatar || "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
            college: response.data.data.college || "计算机学院",
            major: response.data.data.major || "Computer Science",
            skills: response.data.data.skills || ["Vue", "JavaScript", "Java", "Python"],
            bio: response.data.data.bio || "Finalist at the 2023 Global Hackathon. Passionate about building scalable cloud solutions and intuitive user interfaces. Looking for a hardware enthusiast for the upcoming Robotics Challenge."
          };
        } else {
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
          profileForm.value = {
            name: "张三",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
            college: "计算机学院",
            major: "Computer Science",
            skills: ["Vue", "JavaScript", "Java", "Python"],
            bio: "Finalist at the 2023 Global Hackathon. Passionate about building scalable cloud solutions and intuitive user interfaces. Looking for a hardware enthusiast for the upcoming Robotics Challenge."
          };
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/edit-profile.vue:162", "获取用户信息错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
        profileForm.value = {
          name: "默认用户",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
          college: "默认学院",
          major: "默认专业",
          skills: [],
          bio: ""
        };
      } finally {
        loading.value = false;
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const saveProfile = async () => {
      var _a;
      try {
        const token = common_vendor.index.getStorageSync("token");
        const userId = (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.id;
        if (!token || !userId) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        common_vendor.index.showLoading({ title: "保存中..." });
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/users/${userId}`,
          method: "PUT",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            name: profileForm.value.name,
            avatar: profileForm.value.avatar,
            college: profileForm.value.college,
            major: profileForm.value.major,
            skills: profileForm.value.skills,
            bio: profileForm.value.bio
          }
        });
        if (response.data && response.data.success) {
          common_vendor.index.setStorageSync("userInfo", response.data.data);
          showSuccess.value = true;
          setTimeout(() => {
            showSuccess.value = false;
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: "保存失败，请稍后重试",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/edit-profile.vue:234", "保存个人资料错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const changeAvatar = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: function(res) {
          const tempFilePaths = res.tempFilePaths;
          uploadAvatar(tempFilePaths[0]);
        }
      });
    };
    const uploadAvatar = async (tempFilePath) => {
      var _a;
      try {
        const token = common_vendor.index.getStorageSync("token");
        const userId = (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.id;
        if (!token || !userId) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        common_vendor.index.showLoading({ title: "上传中..." });
        const uploadTask = common_vendor.index.uploadFile({
          url: "http://localhost:3000/api/users/avatar",
          filePath: tempFilePath,
          name: "avatar",
          header: {
            "Authorization": `Bearer ${token}`
          },
          formData: {
            "userId": userId
          },
          success: async function(uploadRes) {
            try {
              const response = JSON.parse(uploadRes.data);
              if (response && response.success) {
                profileForm.value.avatar = response.data.avatar;
                const userInfo = common_vendor.index.getStorageSync("userInfo");
                userInfo.avatar = response.data.avatar;
                common_vendor.index.setStorageSync("userInfo", userInfo);
                common_vendor.index.showToast({
                  title: "头像上传成功",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({
                  title: "上传失败，请稍后重试",
                  icon: "none"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/profile/edit-profile.vue:305", "解析上传响应错误:", error);
              common_vendor.index.showToast({
                title: "上传失败，请稍后重试",
                icon: "none"
              });
            }
          },
          fail: function(error) {
            common_vendor.index.__f__("error", "at pages/profile/edit-profile.vue:313", "上传头像错误:", error);
            common_vendor.index.showToast({
              title: "上传失败，请稍后重试",
              icon: "none"
            });
          },
          complete: function() {
            common_vendor.index.hideLoading();
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/edit-profile.vue:324", "上传头像错误:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      }
    };
    const selectSchool = () => {
      common_vendor.index.__f__("log", "at pages/profile/edit-profile.vue:335", "选择学院");
    };
    const addSkillTag = async () => {
      common_vendor.index.showModal({
        title: "添加技能",
        editable: true,
        placeholderText: "请输入技能名称",
        success: async (res) => {
          if (res.confirm && res.content.trim() !== "") {
            const newSkill = res.content.trim();
            if (!profileForm.value.skills.includes(newSkill)) {
              profileForm.value.skills.push(newSkill);
              await updateSkillsToServer();
            } else {
              common_vendor.index.showToast({
                title: "技能已存在",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const removeSkill = async (index) => {
      profileForm.value.skills.splice(index, 1);
      await updateSkillsToServer();
    };
    const updateSkillsToServer = async () => {
      var _a;
      try {
        const token = common_vendor.index.getStorageSync("token");
        const userId = (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.id;
        if (!token || !userId) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        common_vendor.index.showLoading({ title: "更新中..." });
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/users/${userId}`,
          method: "PUT",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: { skills: profileForm.value.skills }
        });
        if (response.data && response.data.success) {
          common_vendor.index.setStorageSync("userInfo", response.data.data);
          common_vendor.index.showToast({
            title: "技能已更新",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: "更新失败，请稍后重试",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/edit-profile.vue:407", "更新技能错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const findSkills = () => {
      common_vendor.index.__f__("log", "at pages/profile/edit-profile.vue:419", "查找技能");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack, "f1"),
        b: common_vendor.o(saveProfile, "10"),
        c: profileForm.value.avatar,
        d: common_vendor.o(changeAvatar, "97"),
        e: profileForm.value.name,
        f: common_vendor.o(($event) => profileForm.value.name = $event.detail.value, "4a"),
        g: common_vendor.t(profileForm.value.college),
        h: common_vendor.o(selectSchool, "b6"),
        i: profileForm.value.major,
        j: common_vendor.o(($event) => profileForm.value.major = $event.detail.value, "5b"),
        k: common_vendor.o(addSkillTag, "26"),
        l: common_vendor.f(profileForm.value.skills, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill),
            b: common_vendor.o(($event) => removeSkill(index), index),
            c: index
          };
        }),
        m: common_vendor.o(findSkills, "7e"),
        n: profileForm.value.bio,
        o: common_vendor.o(($event) => profileForm.value.bio = $event.detail.value, "a8"),
        p: showSuccess.value
      }, showSuccess.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4438b7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/edit-profile.js.map
