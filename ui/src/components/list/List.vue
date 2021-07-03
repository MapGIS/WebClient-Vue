<script>
import List, { ListProps } from 'ant-design-vue/es/list';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const listTypes = {
  ...ListProps()
};

export default {
  name: "mapgis-ui-list",
  wrapperUI: List,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: listTypes,
  methods: {}
};
</script>
