import MapgisUiPlotScriptList from "../../../ui/src/components/plot/ScriptList.vue";
import ScriptD from "../../public/标绘/animation.json";
// import MarkDown from "../../../ui/docs/guide/base.md";
import "../../style/card.css";

export default {
  title: "界面/标绘/脚本列表",
  component: MapgisUiPlotScriptList,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPlotScriptList },
  data() {
    return {};
  },
  template: `<div style="height:400px;">
    <mapgis-ui-plot-script-list 
      v-bind="$props" 
      class="storybook-ui-panel"
    >
    </mapgis-ui-plot-script-list>
  </div>`,
});

export const List = Template.bind({});
List.args = {
  scriptList: [
    ScriptD,
    ScriptD
  ],
};
// List.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
