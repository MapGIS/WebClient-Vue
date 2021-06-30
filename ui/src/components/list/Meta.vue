<script>
import { Meta } from 'ant-design-vue/es/list/Item';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";


export default {
  name: "mapgis-ui-list-item-meta",
  wrapperUI: Meta,
  __ANT_LIST_ITEM_META: true,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  // props: ,
  methods: {}
};
</script>
