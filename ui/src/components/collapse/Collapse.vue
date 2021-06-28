<script>
import Collapse from 'ant-design-vue/es/collapse/Collapse';
import { collapseProps } from 'ant-design-vue/es/vc-collapse';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const collapseTypes = {
  ...collapseProps()
};

export default {
  name: "mapgis-ui-collapse",
  wrapperUI: Collapse,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: collapseTypes,
  methods: {},
  model: {
    prop: 'activeKey',
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
