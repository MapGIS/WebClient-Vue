<script>
import Mentions from 'ant-design-vue/es/mentions';
import { mentionsProps } from 'ant-design-vue/es/vc-mentions/src/mentionsProps';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const mentionsTypes = {
  ...mentionsProps,
  loading: PropTypes.bool
};

export default {
  name: "mapgis-ui-mentions",
  wrapperUI: Mentions,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: mentionsTypes,
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
