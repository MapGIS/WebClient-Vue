<script>
import Skeleton, { SkeletonProps } from 'ant-design-vue/es/skeleton';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const skeletonTypes = {
  ...SkeletonProps
};

export default {
  name: "mapgis-ui-skeleton",
  wrapperUI: Skeleton,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: skeletonTypes,
  methods: {}
};
</script>
