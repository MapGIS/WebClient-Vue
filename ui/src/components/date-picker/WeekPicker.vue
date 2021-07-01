<script>
import DatePicker from 'ant-design-vue/es/date-picker';
import { WeekPickerProps } from 'ant-design-vue/es/date-picker/interface';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const weekPickerTypes = {
  ...WeekPickerProps()
};

export default {
  name: "mapgis-ui-week-picker",
  wrapperUI: DatePicker.WeekPicker,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: weekPickerTypes,
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
