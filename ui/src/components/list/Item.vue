<script>
import ListItem, { ListItemProps } from 'ant-design-vue/es/list/Item';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const listItemTypes = {
  ...ListItemProps
};

export default {
  name: "mapgis-ui-list-item",
  wrapperUI: ListItem,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: listItemTypes,
  methods: {}
};
</script>
