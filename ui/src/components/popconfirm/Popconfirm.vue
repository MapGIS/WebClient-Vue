<script>
import Popconfirm from 'ant-design-vue/es/popconfirm';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export default {
  name: "mapgis-ui-popconfirm",
  wrapperUI: Popconfirm,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  methods: {}
};
</script>
