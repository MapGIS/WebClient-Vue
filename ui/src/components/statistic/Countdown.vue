<script>
import StatisticCountdown from 'ant-design-vue/es/statistic/Countdown';
import { StatisticProps } from 'ant-design-vue/es/statistic/Statistic';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const statisticCountdownTypes = {
  ...StatisticProps
};

export default {
  name: "mapgis-ui-statistic-countdown",
  wrapperUI: StatisticCountdown,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: statisticCountdownTypes,
  methods: {}
};
</script>
