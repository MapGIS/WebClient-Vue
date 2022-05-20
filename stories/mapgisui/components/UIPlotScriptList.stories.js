import MapgisUiPlotScriptList from "../../../ui/src/components/plot/ScriptList.vue";
// import MarkDown from "../../../ui/docs/guide/base.md";

export default {
  title: "界面/标绘/脚本列表",
  component: MapgisUiPlotScriptList,
  argTypes: {

  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisUiPlotScriptList },
  data() {
    return {
    };
  },
  template: `<div style="height:400px;">
    <mapgis-ui-plot-script-list 
      v-bind="$props" 
    >
    </mapgis-ui-plot-script-list>
  </div>`,
  methods:{
    data(e){
      console.log('data',e);
    },
  }
});

export const List = Template.bind({});
List.args = {
  scriptList:[
    {
      name:"脚本1-进攻路线",
      children:[
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
      ]
    },
    {
      name:"脚本2-撤退",
      children:[
        {
          name: "2_动画1",
          animation: {
            显隐动画: {
              startTime: 0.1,
              duration: 3.0,
              startRatio: 0.15,
              endRatio:1.0,
              loop:false
            },
          }
        },
        {
          name: "2_动画2",
          animation: {
            显隐动画: {
              startTime: 0.1,
              duration: 3.0,
              startRatio: 0.15,
              endRatio:1.0,
              loop:false
            },
          }
        },
        {
          name: "2_动画3",
          animation: {
            显隐动画: {
              startTime: 0.1,
              duration: 3.0,
              startRatio: 0.15,
              endRatio:1.0,
              loop:false
            },
          }
        },
      ]
    }
  ],

};
// List.parameters = {
//   docs: {
//     description: {
//       component: MarkDown,
//     },
//   },
// };
