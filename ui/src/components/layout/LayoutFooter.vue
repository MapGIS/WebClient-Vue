<script>
import Layout, { BasicProps } from "ant-design-vue/es/layout/layout";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-layout-footer",
  wrapperUI: Layout.Footer,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: BasicProps
};
</script>
