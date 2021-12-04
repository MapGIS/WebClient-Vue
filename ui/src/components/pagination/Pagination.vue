<script>
import Pagination, { PaginationProps } from "ant-design-vue/es/pagination";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-pagination",
  wrapperUI: Pagination,
  mixins: [AntdMixin, ThemeMixin],
  props: PaginationProps(),
  model: {
    prop: 'current',
    event: 'change.current'
  },
};
</script>