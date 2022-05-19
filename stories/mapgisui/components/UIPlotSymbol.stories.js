import MapgisUiPlotSymbol from "../../../ui/src/components/plot/Symbol.vue";
import symbolD from '../../../ui/src/components/plot/test/symbol.json'
// import MarkDown from "../../../ui/docs/guide/base.md";

export default {
  title: "界面/标绘/图标配置",
  component: MapgisUiPlotSymbol,
  argTypes: {

  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPlotSymbol },
  data() {
    return {
    };
  },
  template: `<div style="height:400px;">
    <mapgis-ui-plot-symbol 
      v-bind="$props" 
    >
    </mapgis-ui-plot-symbol>
  </div>`,
  methods:{

  }
});

export const Symbol = Template.bind({});
Symbol.args = {
  data: symbolD
};

// Symbol.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
