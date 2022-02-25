import MapgisUiChartFlow from "../../../ui/src/components/charts/Flow.vue";
import MarkDown from "../../../ui/docs/api/chart/flow.md";
import flowdata from "../../data/chart/flow.json";

export default {
  title: "界面/图表/流向分析",
  component: MapgisUiChartFlow,
  argTypes: {
    data: {},
    domain: [-25000, 25000],
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiChartFlow },
  data() {
    return {
      value: 0,
    };
  },
  template: `<div>
    <mapgis-ui-card>
      <mapgis-ui-chart-flow v-bind="$props">
      </mapgis-ui-chart-flow>
    </mapgis-ui-card>
  </div>`,
});

export const 流向分析 = Template.bind({});
流向分析.args = {
  data: flowdata,
  domain: [-25000, 25000],
};

流向分析.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};
