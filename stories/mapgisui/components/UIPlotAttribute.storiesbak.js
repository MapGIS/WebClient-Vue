import MapgisUiPlotAttribute from "../../../ui/src/components/plot/Attribute.vue";
import dataT from '../../../ui/src/components/plot/test/attributeOld.json'
// import MarkDown from "../../../ui/docs/guide/base.md";

export default {
  title: "界面/标绘/属性设置",
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
      @changeJoin="join"
      @changeCap="cap"
      @changeComponent="component"
      @changeCompareLine="compare"
      @changeWidth="width"
      @changeColor="color"
      @changeOpacity="opacity"
      @changeText="text"
      @changeProperties="property"
      @changeName="name"
    >
    </mapgis-ui-plot-attribute>
  </div>`,
  methods:{
    join(e){
      console.log('join',e);
    },
    cap(e){
      console.log('cap',e);
    },
    component(e){
      console.log('component',e);
    },
    compare(e){
      console.log('compare',e);
    },
    opacity(e){
      console.log('opacity',e);
    },
    width(e){
      console.log('width',e);
    },
    color(e){
      console.log('color',e);
    },
    text(e){
      console.log('text',e);
    },
    property(e){
      console.log('property',e);
    },
    name(e){
      console.log('name',e);
    }
  }
});

export const Setting = Template.bind({});
Setting.args = {
  data: dataT
};

// Setting.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
