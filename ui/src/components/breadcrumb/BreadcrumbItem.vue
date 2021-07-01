<script>
import BreadcrumbItem from "ant-design-vue/es/breadcrumb/BreadcrumbItem";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const BreadcrumbItemProps = {
    prefixCls: PropTypes.string,
    href: PropTypes.string,
    separator: PropTypes.any.def('/'),
    overlay: PropTypes.any
};

export default {
  name: "mapgis-ui-breadcrumb-item",
  wrapperUI: BreadcrumbItem,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: BreadcrumbItemProps
};
</script>