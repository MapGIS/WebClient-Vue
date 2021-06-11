<script>
import Empty, { EmptyProps } from "ant-design-vue/es/empty/index";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";

export const emptyProps = {
  ...EmptyProps(),
  image: PropTypes.any.def(require("./assets/image/empty.png"))
};

export default {
  name: "MapgisUiEmpty",
  wrapperUI: Empty,
  mixins: [AntdMixin],
  inheritAttrs: false,
  props: emptyProps,
  computed: {
    addProps() {
      return {
        prefixCls: this.prefixCls || "mapgis-ui-empty"
      };
    }
  }
};
</script>
