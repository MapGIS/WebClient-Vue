import MapgisUiPlotScript from "../../../ui/src/components/plot/Script.vue";
import ScriptD from "../../public/标绘/animation.json";
// import MarkDown from "../../../ui/docs/guide/base.md";
import "../../style/card.css";

export default {
  title: "界面/标绘/脚本",
  component: MapgisUiPlotScript,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPlotScript },
  data() {
    return {
      value: 0,
    };
  },
  template: `<div style="height:400px;">
    <mapgis-ui-plot-script 
      v-bind="$props" 
      class="storybook-ui-panel"
    >
    </mapgis-ui-plot-script>
  </div>`,
  methods: {},
});

export const Script = Template.bind({});
Script.args = {
  script: ScriptD,
};

// Script.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
