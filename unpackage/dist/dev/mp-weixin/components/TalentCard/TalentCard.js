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
    competitionTypes: {
      type: Array,
      default: () => []
    },
    id: {
      type: [Number, String],
      required: true
    }
  },
  emits: ["invite", "greet"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleInvite = () => {
      emit("invite", props.id);
    };
    const handleGreet = () => {
      emit("greet", props.id);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.avatar,
        b: common_vendor.t(__props.name),
        c: common_vendor.t(__props.major),
        d: __props.competitionTypes && __props.competitionTypes.length > 0
      }, __props.competitionTypes && __props.competitionTypes.length > 0 ? {
        e: common_vendor.f(__props.competitionTypes, (type, idx, i0) => {
          return {
            a: common_vendor.t(type),
            b: idx
          };
        })
      } : {}, {
        f: common_vendor.t(__props.intro),
        g: common_vendor.f(__props.skills, (skill, idx, i0) => {
          return {
            a: common_vendor.t(skill),
            b: idx
          };
        }),
        h: common_vendor.o(handleInvite),
        i: common_vendor.o(handleGreet)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3738fd9c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/TalentCard/TalentCard.js.map
