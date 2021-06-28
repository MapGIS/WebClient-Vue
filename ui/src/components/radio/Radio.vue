<script>
import Radio from 'ant-design-vue/es/radio/Radio';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const radioProps = {
  prefixCls: PropTypes.string,
  defaultChecked: Boolean,
  checked: { type: Boolean, 'default': undefined },
  disabled: Boolean,
  isGroup: Boolean,
  value: PropTypes.any,
  name: String,
  id: String,
  autoFocus: Boolean,
  type: PropTypes.string.def('radio')
};

export default {
  name: "mapgis-ui-radio",
  wrapperUI: Radio,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: radioProps,
  methods: {},
  model: {
    prop: 'checked',
    event: 'input'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        input: function(value) {
          vm.$emit('input', value);
        }
      };
    }
  }
};
</script>
