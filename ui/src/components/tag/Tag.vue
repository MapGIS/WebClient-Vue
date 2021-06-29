<script>
import Tag from 'ant-design-vue/es/tag/Tag';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const tagProps = {
  prefixCls: PropTypes.string,
  color: PropTypes.string,
  closable: PropTypes.bool.def(false),
  visible: PropTypes.bool,
  afterClose: PropTypes.func
};

export default {
  name: "mapgis-ui-tag",
  wrapperUI: Tag,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: tagProps,
  methods: {},
  model: {
    prop: 'visible',
    event: 'close.visible'
  },
  computed: {
    addListeners() {
      const vm = this;
      return {
        'close.visible': function(value) {
          vm.$emit('close.visible', value);
        }
      };
    }
  }
};
</script>
