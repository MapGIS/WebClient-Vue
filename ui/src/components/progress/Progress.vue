<script>
import Progress, { ProgressProps } from 'ant-design-vue/es/progress/progress';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const progressTypes = {
  ...ProgressProps
};

export default {
  name: "mapgis-ui-progress",
  wrapperUI: Progress,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: progressTypes,
  methods: {}
};
</script>
