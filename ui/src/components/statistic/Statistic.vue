<script>
import Statistic, { StatisticProps } from 'ant-design-vue/es/statistic/Statistic';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const statisticTypes = {
  ...StatisticProps
};

export default {
  name: "mapgis-ui-statistic",
  wrapperUI: Statistic,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: statisticTypes,
  methods: {}
};
</script>
