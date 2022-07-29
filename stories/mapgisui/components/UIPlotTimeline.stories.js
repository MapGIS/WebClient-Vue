import MapgisUiPlotTimeline from "../../../ui/src/components/plot/Timeline.vue";
// import MarkDown from "../../../ui/docs/guide/base.md";

export default {
  title: "界面/标绘/时间轴",
  component: MapgisUiPlotTimeline,
  argTypes: {

  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPlotTimeline },
  data() {
    return {
    };
  },
  template: `<div style="height:400px;">
    <mapgis-ui-plot-timeline 
      v-bind="$props" 
    >
    </mapgis-ui-plot-timeline>
  </div>`,
  methods:{

  }
});

export const Timeline = Template.bind({});
Timeline.args = {

};
// Timeline.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
