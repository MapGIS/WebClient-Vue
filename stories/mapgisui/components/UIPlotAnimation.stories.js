import MapgisUiPlotAnimation from "../../../ui/src/components/plot/Animation.vue";
import animationL from '../../../ui/src/components/plot/test/animation.json'
// import MarkDown from "../../../ui/docs/guide/base.md";
import '../../style/card.css'

export default {
  title: "界面/标绘/动画设置",
  component: MapgisUiPlotAnimation,
  argTypes: {

  },
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
  methods:{
    animationD(e){
      console.log('animation',e);
    },
  }
});

export const Setting = Template.bind({});
Setting.args = {
  animationList: animationL,
  animation: {        
    生长动画: {
      startTime: 0.1,
      duration: 3.0,
      startRatio: 0.15,
      endRatio:1.0,
      loop:true
    }
  }
};

// Setting.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
