<script>
import ColumnGroup from 'ant-design-vue/es/table/ColumnGroup';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const tableColumnGroupProps = {
  fixed: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['left', 'right'])]),
  title: PropTypes.any
};

export default {
  name: "mapgis-ui-table-column-group",
  wrapperUI: ColumnGroup,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: tableColumnGroupProps,
  methods: {}
};
</script>
