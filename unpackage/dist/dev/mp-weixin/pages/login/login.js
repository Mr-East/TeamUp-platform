"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const formData = common_vendor.reactive({
      email: "123@qq.com",
      password: "123456"
    });
    const handleLogin = async () => {
      if (!formData.email || !formData.password) {
        common_vendor.index.showToast({
          title: "请输入邮箱和密码",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "登录中..." });
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/auth/login",
          method: "POST",
          data: {
            email: formData.email,
            password: formData.password
          }
        });
        common_vendor.index.__f__("log", "at pages/login/login.vue:70", "登录响应:", response);
        if (response.data && response.data.success) {
          common_vendor.index.setStorageSync("token", response.data.data.token);
          common_vendor.index.setStorageSync("userInfo", response.data.data.user);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1e3,
            success: function() {
              common_vendor.index.switchTab({
                url: "/pages/index/index",
                success: function(res) {
                  common_vendor.index.__f__("log", "at pages/login/login.vue:86", "跳转成功:", res);
                },
                fail: function(err) {
                  common_vendor.index.__f__("log", "at pages/login/login.vue:89", "跳转失败:", err);
                }
              });
            }
          });
        } else {
          common_vendor.index.showToast({
            title: response.data.message || "登录失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:101", "登录错误:", error);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: formData.email,
        c: common_vendor.o(($event) => formData.email = $event.detail.value, "15"),
        d: formData.password,
        e: common_vendor.o(($event) => formData.password = $event.detail.value, "17"),
        f: common_vendor.o(handleLogin, "5d"),
        g: common_vendor.o(goToRegister, "86")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
