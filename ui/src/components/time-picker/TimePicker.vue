<script>
import TimePicker from 'ant-design-vue/es/time-picker';
import {TimePickerProps} from 'ant-design-vue/es/time-picker';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const TimePickerType = {
  ...TimePickerProps()
};

export default {
  name: "mapgis-ui-time-picker",
  wrapperUI: TimePicker,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: TimePickerType,
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
