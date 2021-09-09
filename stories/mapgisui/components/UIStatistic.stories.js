import MapgisUiStatistic from "../../../ui/src/components/statistic/Statistic.vue";

export default {
  title: "界面/数据显示/统计数值",
  component: MapgisUiStatistic,
  argTypes: {
    prefixCls: { table: { disable: true } },
    getPopupContainer: { table: { disable: true } },
    csp: { table: { disable: true } },
    locale: { table: { disable: true } },
    background: { table: { disable: true } },
    textColor: { table: { disable: true } },
    colorGroup: { table: { disable: true } },
    themeStyleChanged: { table: { disable: true } },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiStatistic },
  data() {
    return {
    };
  },
  methods: {
  },
  template: `
  <div>
    <mapgis-ui-statistic title="Active Users" :value="112893" style="margin-right: 50px" />
    <mapgis-ui-statistic title="Account Balance (CNY)" :precision="2" :value="112893" />
  </div>
  `,
});

export const Statistic = Template.bind({});
Statistic.args = {};

const Template2 = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiStatistic },
  data() {
    return {
      deadline: Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30,
    };
  },
  methods: {
    onFinish() {
      console.log('finished!');
    },
  },
  template: `
  <div>
    <mapgis-ui-statistic-countdown
      title="Countdown"
      :value="deadline"
      style="margin-right: 50px"
      @finish="onFinish"
    />
    <mapgis-ui-statistic-countdown
      title="Million Seconds"
      :value="deadline"
      format="HH:mm:ss:SSS"
      style="margin-right: 50px"
    />
    <mapgis-ui-statistic-countdown title="Day Level" :value="deadline" format="D 天 H 时 m 分 s 秒" />
  </div>
  `,
});

export const StatisticCountdown = Template2.bind({});
StatisticCountdown.args = {};
