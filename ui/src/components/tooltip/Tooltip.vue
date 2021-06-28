<script>
import Tooltip from 'ant-design-vue/es/tooltip/Tooltip';
import abstractTooltipProps from 'ant-design-vue/es/tooltip/abstractTooltipProps';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const tooltipProps = {
  ...abstractTooltipProps(),
  title: PropTypes.any
};

export default {
  name: "mapgis-ui-tooltip",
  wrapperUI: Tooltip,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: tooltipProps
};
</script>
