<script>
import CollapsePanel from 'ant-design-vue/es/collapse/CollapsePanel';
import { panelProps } from 'ant-design-vue/es/vc-collapse';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const collapsePanelTypes = {
  ...panelProps()
};

export default {
  name: "mapgis-ui-collapse-panel",
  wrapperUI: CollapsePanel,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: collapsePanelTypes,
  methods: {}
};
</script>
