<script>
import Popover from 'ant-design-vue/es/popover';
import abstractTooltipProps from 'ant-design-vue/es/tooltip/abstractTooltipProps';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const popoverProps = {
  ...abstractTooltipProps(),
  prefixCls: PropTypes.string,
  transitionName: PropTypes.string.def('zoom-big'),
  content: PropTypes.any,
  title: PropTypes.any
};

export default {
  name: "mapgis-ui-popover",
  wrapperUI: Popover,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: popoverProps,
  methods: {},
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        visibleChange: function(value) {
          vm.$emit('visibleChange', value);
        }
      };
    }
  }
};
</script>
