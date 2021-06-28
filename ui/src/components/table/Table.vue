<script>
import Table from 'ant-design-vue/es/table';
import { TableProps } from 'ant-design-vue/es/table/interface';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const tableTypes = {
  ...TableProps
};

export default {
  name: "mapgis-ui-table",
  wrapperUI: Table,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: tableTypes,
  methods: {}
};
</script>
