<script>
import PageHeader, { PageHeaderProps } from "ant-design-vue/es/page-header";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";


export default {
  name: "mapgis-ui-page-header",
  wrapperUI: PageHeader,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: PageHeaderProps
};
</script>
