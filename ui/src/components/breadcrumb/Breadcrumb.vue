<script>
import Breadcrumb from "ant-design-vue/es/breadcrumb/Breadcrumb";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

var Route = PropTypes.shape({
  path: PropTypes.string,
  breadcrumbName: PropTypes.string,
  children: PropTypes.array
}).loose;

export const BreadcrumbProps = {
  prefixCls: PropTypes.string,
  routes: PropTypes.arrayOf(Route),
  params: PropTypes.any,
  separator: PropTypes.any,
  itemRender: PropTypes.func
};

export default {
  name: "mapgis-ui-breadcrumb",
  wrapperUI: Breadcrumb,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: BreadcrumbProps
};
</script>