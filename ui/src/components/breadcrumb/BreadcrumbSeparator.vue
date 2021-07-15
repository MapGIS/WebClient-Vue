<script>
import BreadcrumbSeparator from "ant-design-vue/es/breadcrumb/BreadcrumbSeparator";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const BreadcrumbSeparatorProps = {
  prefixCls: PropTypes.string
};

export default {
  name: "mapgis-ui-breadcrumb-separator",
  wrapperUI: BreadcrumbSeparator,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: BreadcrumbSeparatorProps
};
</script>
