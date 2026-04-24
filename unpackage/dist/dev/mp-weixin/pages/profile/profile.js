"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
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
    common_vendor.onShow(async () => {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        await fetchUserInfo();
      }
    });
    const userInfo = common_vendor.ref({
      name: "默认用户",
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
      college: "默认学院",
      skills: [],
      notification: true
    });
    const loading = common_vendor.ref(true);
    const fetchUserInfo = async () => {
      try {
        loading.value = true;
        const token = common_vendor.index.getStorageSync("token");
        const userInfoFromStorage = common_vendor.index.getStorageSync("userInfo");
        const userId = userInfoFromStorage == null ? void 0 : userInfoFromStorage.id;
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/users/${userId}`,
          method: "GET",
          header: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.data && response.data.success) {
          userInfo.value = {
            ...response.data.data,
            skills: response.data.data.skills || [],
            notification: response.data.data.notificationEnabled || true
          };
        } else {
          common_vendor.index.showToast({
            title: "获取用户信息失败",
            icon: "none"
          });
          userInfo.value = {
            name: "张三",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20male&image_size=square",
            college: "计算机学院",
            skills: ["Vue", "JavaScript", "Java", "Python"],
            notification: true
          };
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:165", "获取用户信息错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
        userInfo.value = {
          name: "默认用户",
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20default&image_size=square",
          college: "默认学院",
          skills: [],
          notification: true
        };
      } finally {
        loading.value = false;
      }
    };
    const getSkillColor = (index) => {
      const colors = ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B"];
      return colors[index % colors.length];
    };
    const goToPrivacy = () => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:213", "跳转到编辑信息页面");
      common_vendor.index.navigateTo({
        url: "/pages/profile/edit-profile"
      });
    };
    const goToMyPosts = () => {
      common_vendor.index.__f__("log", "at pages/profile/profile.vue:221", "跳转到我的发布页面");
      common_vendor.index.navigateTo({
        url: "/pages/profile/my-posts"
      });
    };
    const toggleNotification = async () => {
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
        const response = await common_vendor.index.request({
          url: `http://localhost:3000/api/users/${userId}`,
          method: "PUT",
          header: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            notificationEnabled: !userInfo.value.notification
          }
        });
        if (response.data && response.data.success) {
          userInfo.value.notification = !userInfo.value.notification;
          common_vendor.index.showToast({
            title: "设置成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: "设置失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:266", "切换通知状态错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
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
                userInfo.value.avatar = response.data.avatar;
                const userInfoFromStorage = common_vendor.index.getStorageSync("userInfo");
                userInfoFromStorage.avatar = response.data.avatar;
                common_vendor.index.setStorageSync("userInfo", userInfoFromStorage);
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
              common_vendor.index.__f__("error", "at pages/profile/profile.vue:335", "解析上传响应错误:", error);
              common_vendor.index.showToast({
                title: "上传失败，请稍后重试",
                icon: "none"
              });
            }
          },
          fail: function(error) {
            common_vendor.index.__f__("error", "at pages/profile/profile.vue:343", "上传头像错误:", error);
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
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:354", "上传头像错误:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      }
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "退出登录",
        content: "确定要退出登录吗？",
        success: function(res) {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatar,
        b: common_vendor.o(changeAvatar, "9f"),
        c: common_vendor.t(userInfo.value.name),
        d: common_vendor.t(userInfo.value.college),
        e: common_vendor.f(userInfo.value.skills, (skill, index, i0) => {
          return {
            a: getSkillColor(index),
            b: common_vendor.t(skill),
            c: index
          };
        }),
        f: common_vendor.o(goToPrivacy, "e0"),
        g: common_vendor.o(goToMyPosts, "6e"),
        h: userInfo.value.notification ? 1 : "",
        i: userInfo.value.notification ? 1 : "",
        j: common_vendor.o(toggleNotification, "4b"),
        k: common_vendor.o(toggleNotification, "72"),
        l: common_vendor.o(logout, "0c")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
