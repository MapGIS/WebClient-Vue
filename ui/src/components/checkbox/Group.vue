<script>
import Group from "ant-design-vue/es/checkbox/Group";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const groupProps = {
  name: PropTypes.string,
  prefixCls: PropTypes.string,
  defaultValue: PropTypes.array,
  value: PropTypes.array,
  options: PropTypes.array.def([]),
  disabled: PropTypes.bool
};

export default {
  name: "mapgis-ui-checkbox-group",
  wrapperUI: Group,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: groupProps,
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
