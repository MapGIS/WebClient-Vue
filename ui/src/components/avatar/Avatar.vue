<script>
import Avatar from "ant-design-vue/es/avatar/Avatar";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const avatarTypes = {
  prefixCls: {
    type: String,
    default: undefined,
  },
  shape: {
    validator: function validator(val) {
      return ["circle", "square"].includes(val);
    },
    default: "circle",
  },
  size: {
    validator: function validator(val) {
      return (
        typeof val === "number" || ["small", "large", "default"].includes(val)
      );
    },
    default: "default",
  },
  src: String,
  /** Srcset of image avatar */
  srcSet: String,
  icon: PropTypes.any,
  alt: String,
  loadError: Function,
};

export default {
  name: "MapgisUiAvatar",
  wrapperUI: Avatar,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: avatarTypes,
  methods: {
    renderChildren() {
      const h = this.$createElement;
      const children = [];
      if ((!this.icon || !this.$slots["icon"]) && this.iconClass) {
        children.push(
          h("i", {
            class: { [this.iconClass]: true },
            slot: "icon",
          })
        );
      }
      return [this.$slots["default"], children];
    },
  },
};
</script>
