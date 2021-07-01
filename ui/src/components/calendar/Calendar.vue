<script>
import Calendar, { CalendarProps } from 'ant-design-vue/es/calendar';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const calendarTypes = {
  ...CalendarProps()
}

export default {
  name: "mapgis-ui-calendar",
  wrapperUI: Calendar,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: calendarTypes,
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
