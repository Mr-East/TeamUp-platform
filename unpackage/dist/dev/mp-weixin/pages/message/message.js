"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const router = common_vendor.useRouter();
    const activeTab = common_vendor.ref("private");
    const privateMessages = common_vendor.ref([
      {
        id: 1,
        name: "李明华 (AI Lab)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0KAcwGbxp7qLD7ncmDLQhVaSzAmlfwYwprJh2mk4dotcs7fUNcbJSKgxsuJbHh17SxPsZdXprCVjg7xowqdR9m_aKtV_5B5ld9-MScfU9gTkAwJ2qz6eIjWPhKNKVxBxxnMTKu3pB8OSosYMrrhCiZnl_thkEaa-lPB7KCYkBabs7_hWMOc7mMi0wyQpL5uH6EKEACIlSjw2V_3Y1s1ob-kXwexpLuKPzzLHv1CB7DIyzOuwfZOC4QiafYcpuiAI1UpNF4Cr9RVs",
        preview: "关于这次的数学建模比赛，我想请教一下关于算法优化的部分...",
        time: "14:20",
        unread: 3
      },
      {
        id: 2,
        name: "Sarah Zhang",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgn616qrqIQu_QRYcw2uzUWYBJcR-XheCAZGTEISq5T3PtDR6daDfeEbbqWoI2Vr_AqKdnXYTm5vMFx9P-hHD-Vc_0fElkm1gyhFfGmi8_ctvcfpLUy-EJqEQjBA-MgzaVO4RpD0zq1VqPK0IEzIQhZtBf7ksTsV9NzfIVqGqwigYNDh-nQlC1TW_QrOjecUi0p0O8qXhti1BvbmvLbVSzCCYpR8zVr74RKsg4F6LDAlenMZHCa5ISbEqCyCjf_RA-xUH336JAS4k",
        preview: "Great progress on the UI design! Let's sync tomorrow at the hub.",
        time: "11:05"
      },
      {
        id: 3,
        name: "陈教授",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEca5vDCgdHjuz7DJGYhyzDAR7r9ovibbthmVmnhGglmpEudEZaFB4j2vRq8SUUItB2uL1YmRm4HYuyVSq9b-2pzfp4R07lbyqDzAe6bjHroqSBy1Tywo_Tv_Fceiv-ZV218v3UO5KHb-zKq56cKVz07PoqVKsk2-4drAyLfO44xbMQwYwWsqtwo30TcYADvkfj0HCjhGKEHmHakbJZCNGtb5uGkjm8MkcTjI9GP1ufQd9RuB0uQPffHtUmymsTBSBdpyRohB_kfw",
        preview: "你的论文初稿已经看过了，有一些细节需要我们当面讨论一下。",
        time: "昨天"
      },
      {
        id: 4,
        name: "创新大赛交流群",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8mFUYNFqLwJPauGgBN1tp1rWcJcyNKcKPlK20hQ2PFv_grSeC1ag_Q_lf1OgvLV1-SflOgmNg5GvDkNphgvNUpFBOQhAPIFome91pGcPzeBhJ0oni4xviBzcVEn_xr5YWDsXNsiy9fg8Zqk4rMBkkuyG5z4XbZZv_y09BKSuxvYISp1UegrClTF7SF1Bjfk5sk2OAwLV6-Ot7f-_mhGqjl26CRoxM5mQXuS4_6NLzw1GnZAHudWj96Pa6rsq9H8wltA7UwHWqhho",
        preview: '<span class="text-primary font-semibold">王小二:</span> 刚才发布的通知大家都看到了吗？',
        time: "周三"
      }
    ]);
    const systemNotifications = common_vendor.ref([
      {
        id: 1,
        title: "竞赛提醒",
        content: "全国大学生互联网+创新创业大赛报名截止时间为2026年5月10日，请尽快完成报名",
        time: "2026-04-17 09:00",
        type: "reminder"
      },
      {
        id: 2,
        title: "审核结果",
        content: "您的身份认证已通过，现在可以发布招募信息了",
        time: "2026-04-16 14:30",
        type: "approval"
      },
      {
        id: 3,
        title: "竞赛提醒",
        content: "全国大学生数学建模竞赛开始报名了，截止时间为2026年6月30日",
        time: "2026-04-15 10:00",
        type: "reminder"
      }
    ]);
    const goToChat = (id) => {
      router.push({ path: "/pages/chat/chat", query: { id } });
    };
    const goToInvites = () => {
      common_vendor.index.__f__("log", "at pages/message/message.vue:156", "点击组队申请");
    };
    const markAsRead = () => {
      common_vendor.index.__f__("log", "at pages/message/message.vue:161", "全部标为已读");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goToInvites),
        b: activeTab.value === "private" ? 1 : "",
        c: common_vendor.o(($event) => activeTab.value = "private"),
        d: activeTab.value === "system" ? 1 : "",
        e: common_vendor.o(($event) => activeTab.value = "system"),
        f: activeTab.value === "private"
      }, activeTab.value === "private" ? common_vendor.e({
        g: privateMessages.value.length === 0
      }, privateMessages.value.length === 0 ? {} : {
        h: common_vendor.f(privateMessages.value, (message, index, i0) => {
          return common_vendor.e({
            a: message.avatar,
            b: common_vendor.t(message.name),
            c: common_vendor.t(message.time),
            d: common_vendor.t(message.preview),
            e: message.unread
          }, message.unread ? {
            f: common_vendor.t(message.unread)
          } : {}, {
            g: index,
            h: common_vendor.o(($event) => goToChat(message.id), index)
          });
        })
      }) : common_vendor.e({
        i: common_vendor.o(markAsRead),
        j: systemNotifications.value.length === 0
      }, systemNotifications.value.length === 0 ? {} : {
        k: common_vendor.f(systemNotifications.value, (notification, index, i0) => {
          return common_vendor.e({
            a: notification.type === "reminder"
          }, notification.type === "reminder" ? {} : notification.type === "approval" ? {} : {}, {
            b: notification.type === "approval",
            c: common_vendor.t(notification.title),
            d: common_vendor.t(notification.time),
            e: common_vendor.t(notification.content),
            f: index
          });
        })
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c1b26cf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
