import MapgisUiPlotAttribute from "../../../ui/src/components/plot/Attribute.vue";
import dataT from '../../../ui/src/components/plot/test/attribute.json'
// import MarkDown from "../../../ui/docs/guide/base.md";
import '../../style/card.css'

export default {
  title: "界面/标绘/属性设置(可配置)",
  component: MapgisUiPlotAttribute,
  argTypes: {

  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPlotAttribute },
  data() {
    return {
      value: 0,
    };
  },
  template: `<div style="height:400px;">
    <mapgis-ui-plot-attribute 
      v-bind="$props" 
      @changeComponent="component"
      @changeColor="color"
      @changeText="text"
      @changeBoolean="boolean"
      @changeNumber="number"
      @changeSelect="select"
      @change="dataF"
      class="storybook-ui-panel"
    >
    </mapgis-ui-plot-attribute>
  </div>`,
  methods:{
    dataF(e){
      console.log('dataF',e);
    },
    component(e){
      console.log('component',e);
    },
    boolean(e){
      console.log('boolean',e);
    },
    number(e){
      console.log('number',e);
    },
    select(e){
      console.log('width',e);
    },
    color(e){
      console.log('color',e);
    },
    text(e){
      console.log('text',e);
    }
  }
});

export const Setting = Template.bind({});
Setting.args = {
  data: dataT,
  // config: configT
};

// Setting.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
