<script>
import Upload from "ant-design-vue/es/upload/Upload";
import Dragger from "ant-design-vue/es/upload/Dragger";
import { UploadProps } from 'ant-design-vue/es/upload/interface';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";


export default {
  name: "mapgis-ui-upload-dragger",
  wrapperUI: Dragger,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
//   Dragger: Dragger,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    ...UploadProps
  },
  methods: {},
  model: {},
  computed: {
    addListeners() {
      const vm = this;
      return {
        // 这里确保组件配合 `v-model` 的工作
        'change': function(value) {
          vm.$emit('change', value);
        }
      };
    }
  }
};
</script>
