"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "TalentCard",
  props: {
    avatar: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    major: {
      type: String,
      required: true
    },
    intro: {
      type: String,
      required: true
    },
    skills: {
      type: Array,
      required: true
    },
    targetTrack: {
      type: String,
      default: ""
    },
    competitionTypes: {
      type: Array,
      default: () => []
    },
    id: {
      type: [Number, String],
      required: true
    }
  },
  emits: ["invite", "greet", "avatar-click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleInvite = () => {
      emit("invite", props.id);
    };
    const handleGreet = () => {
      emit("greet", props.id);
    };
    const handleAvatarClick = () => {
      emit("avatar-click", props.id);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.avatar,
        b: common_vendor.o(handleAvatarClick, "a3"),
        c: common_vendor.t(__props.name),
        d: common_vendor.t(__props.major),
        e: __props.targetTrack
      }, __props.targetTrack ? {
        f: common_vendor.t(__props.targetTrack)
      } : {}, {
        g: common_vendor.t(__props.intro),
        h: common_vendor.f(__props.skills, (skill, idx, i0) => {
          return {
            a: common_vendor.t(skill),
            b: idx
          };
        }),
        i: __props.skills.length === 0
      }, __props.skills.length === 0 ? {} : {}, {
        j: common_vendor.o(handleInvite, "29"),
        k: common_vendor.o(handleGreet, "12")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3738fd9c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/TalentCard/TalentCard.js.map
