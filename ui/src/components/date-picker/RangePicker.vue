<script>
import DatePicker from 'ant-design-vue/es/date-picker';
import { RangePickerProps } from 'ant-design-vue/es/date-picker/interface';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const rangePickerTypes = {
  ...RangePickerProps()
};

export default {
  name: "mapgis-ui-range-picker",
  wrapperUI: DatePicker.RangePicker,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: rangePickerTypes,
  methods: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        'change': function(value) {
          vm.$emit('change', value);
        }
      };
    }
  }
};
</script>
