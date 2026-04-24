"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const formData = common_vendor.reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      college: "",
      major: ""
    });
    const handleRegister = async () => {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.college || !formData.major) {
        common_vendor.index.showToast({
          title: "请填写所有必填字段",
          icon: "none"
        });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        common_vendor.index.showToast({
          title: "请输入有效的邮箱地址",
          icon: "none"
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      if (formData.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度至少6位",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "注册中..." });
        const response = await common_vendor.index.request({
          url: "http://localhost:3000/api/auth/register",
          method: "POST",
          data: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            college: formData.college,
            major: formData.major
          }
        });
        if (response.data.success) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success"
          });
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        } else {
          common_vendor.index.showToast({
            title: response.data.message || "注册失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const goToLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: formData.name,
        c: common_vendor.o(($event) => formData.name = $event.detail.value, "86"),
        d: formData.email,
        e: common_vendor.o(($event) => formData.email = $event.detail.value, "de"),
        f: formData.password,
        g: common_vendor.o(($event) => formData.password = $event.detail.value, "40"),
        h: formData.confirmPassword,
        i: common_vendor.o(($event) => formData.confirmPassword = $event.detail.value, "05"),
        j: formData.college,
        k: common_vendor.o(($event) => formData.college = $event.detail.value, "8d"),
        l: formData.major,
        m: common_vendor.o(($event) => formData.major = $event.detail.value, "dd"),
        n: common_vendor.o(handleRegister, "33"),
        o: common_vendor.o(goToLogin, "f6")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bac4a35d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
