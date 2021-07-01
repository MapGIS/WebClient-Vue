<script>
import Timeline, { TimelineProps } from 'ant-design-vue/es/timeline/Timeline';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const timelineTypes = {
  ...TimelineProps
};

export default {
  name: "mapgis-ui-timeline",
  wrapperUI: Timeline,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: timelineTypes,
  methods: {}
};
</script>
