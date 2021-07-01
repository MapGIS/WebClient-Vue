<script>
import TimelineItem, { TimeLineItemProps } from 'ant-design-vue/es/timeline/TimelineItem';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const timeLineItemTypes = {
  ...TimeLineItemProps
};

export default {
  name: "mapgis-ui-timeline-item",
  wrapperUI: TimelineItem,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: timeLineItemTypes,
  methods: {}
};
</script>
