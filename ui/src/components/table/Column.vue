<script>
import Column from 'ant-design-vue/es/table/Column';
import { ColumnProps } from 'ant-design-vue/es/table/interface';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const tableColumnTypes = {
  ...ColumnProps
};

export default {
  name: "mapgis-ui-table-column",
  wrapperUI: Column,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: tableColumnTypes,
  methods: {}
};
</script>
