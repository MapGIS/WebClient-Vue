<script>
import DatePicker from 'ant-design-vue/es/date-picker';
import { DatePickerProps } from 'ant-design-vue/es/date-picker/interface';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const datePickerTypes = {
  ...DatePickerProps()
};

export default {
  name: "mapgis-ui-date-picker",
  wrapperUI: DatePicker,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: datePickerTypes,
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
