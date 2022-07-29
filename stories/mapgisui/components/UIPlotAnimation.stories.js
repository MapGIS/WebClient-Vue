import MapgisUiPlotAnimation from "../../../ui/src/components/plot/Animation.vue";
// import MarkDown from "../../../ui/docs/guide/base.md";
import "../../style/card.css";

export default {
  title: "界面/标绘/动画设置",
  component: MapgisUiPlotAnimation,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPlotAnimation },
  data() {
    return {
      value: 0,
    };
  },
  template: `<div style="height:400px;">
    <mapgis-ui-plot-animation 
      v-bind="$props" 
      @change="animationD"
      class="storybook-ui-panel"
    >
    </mapgis-ui-plot-animation>
  </div>`,
  methods: {
    animationD(e) {
      console.log("animation", e);
    },
  },
});

export const Setting = Template.bind({});
Setting.args = {
  animation: {
    animationType: "path-animation",
    duration: 3000,
    featureIds: "bfb20e80-5c16-41dc-892a-a97977861405",
    animationName: "某xx进攻路线",
    easing: "Linear",
    delay: 0,
    endDelay: 0,
    loop: 1,
    timelineOffset: 2000,
    symbolBindId: "0f21fa93-4d56-49d4-b558-07a789c653d9",
    animationCoords: [],
    showPath: true,
    pathStyle: { fill: "none", strokeStyle: "#00ff00", lineWidth: 5 },
    startPathRate: 0,
    endPathRate: 1,
  },
};

// Setting.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
