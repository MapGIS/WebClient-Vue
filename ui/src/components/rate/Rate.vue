<script>
import Rate from 'ant-design-vue/es/rate';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const RateProps = {
  prefixCls: PropTypes.string,
  count: PropTypes.number,
  value: PropTypes.value,
  defaultValue: PropTypes.value,
  allowHalf: PropTypes.bool,
  allowClear: PropTypes.bool,
  tooltips: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  character: PropTypes.any,
  autoFocus: PropTypes.bool
};

export default {
  name: "mapgis-ui-rate",
  wrapperUI: Rate,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: RateProps,
  methods: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        change: function(value) {
          vm.$emit('change', value);
        }
      };
    }
  }
};
</script>
