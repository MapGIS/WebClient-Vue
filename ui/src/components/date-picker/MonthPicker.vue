<script>
import DatePicker from 'ant-design-vue/es/date-picker';
import { MonthPickerProps } from 'ant-design-vue/es/date-picker/interface';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const monthPickerTypes = {
  ...MonthPickerProps()
};

export default {
  name: "mapgis-ui-month-picker",
  wrapperUI: DatePicker.MonthPicker,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: monthPickerTypes,
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
