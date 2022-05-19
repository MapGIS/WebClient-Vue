import MapgisUiPlotScript from "../../../ui/src/components/plot/Script.vue";
import animationL from '../../../ui/src/components/plot/test/animation.json'
// import MarkDown from "../../../ui/docs/guide/base.md";

export default {
  title: "界面/标绘/脚本",
  component: MapgisUiPlotScript,
  argTypes: {
  },
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
    >
    </mapgis-ui-plot-script>
  </div>`,
  methods:{
    data(e){
      console.log('data',e);
    },
  }
});

export const Script = Template.bind({});
Script.args = {
  animationList: [
    {
      name: "动画1",
      animation: {
        生长动画: {
          startTime: 0.1,
          duration: 3.0,
          startRatio: 0.15,
          endRatio:1.0,
          loop:false
        },
      }
    },
    {
      name: "动画2",
      animation: {
        生长动画: {
          startTime: 0.1,
          duration: 3.0,
          startRatio: 0.15,
          endRatio:1.0,
          loop:false
        },
      }
    },
    {
      name: "动画3",
      animation: {
        生长动画: {
          startTime: 0.1,
          duration: 3.0,
          startRatio: 0.15,
          endRatio:1.0,
          loop:false
        },
      }
    },
  ],
  name: '脚本1—某进攻路线',
  defaultAnimation: animationL

};

// Script.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
