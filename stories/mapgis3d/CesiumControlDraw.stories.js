import Mapgis3dPopup from "../../cesium/src/components/UI/Popup/Popup.vue"
import Markdown from "../../cesium/docs/api/ui/draw.md";
import {Viewshed} from "./CesiumAnalysisViewshed.stories";

export default {
  title: "三维/场景子组件/绘制组件",
  component: Mapgis3dPopup,
  argTypes: {
    drawStyle:{
      description:'绘制样式设置',
      table:{
        defaultValue: { summary: '' },
      },
      control:'object'
    },
    clampToGround:{
      description:'贴地贴模型开关',
      table:{
        defaultValue: { summary: 'true' },
      },
      control:'boolean'
    },
    enableControl:{
      description:'控制基本功能的按钮控件显示',
      table:{
        defaultValue: { summary: 'true' },
      },
      control:'boolean'
    },
    position:{
      description:'按钮控件位置',
      table:{
        defaultValue: { summary: 'top-right' },
      },
      control:'text'
    }
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dPopup },
  template: `<mapgis-web-scene>
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"></mapgis-3d-igs-m3d>
    <mapgis-3d-draw :enableControl="enableControl" :drawStyle="drawStyle" :clampToGround="clampToGround" :position="position"></mapgis-3d-draw>
  </mapgis-web-scene>`
});

export const draw = Template.bind({});
draw.args = {
  m3dUrl:"http://develop.smaryun.com:6163/igs/rest/g3d/DaYanTa",
  autoReset:true,
  maximumScreenSpaceError:6,
  enableControl: true,
  position:"top-right",
  drawStyle:{
    color:'#FF8C00',
    opacity:0.6,
    // outlineColor:'#FFA500',
    // width:4,
    // outlineWidth:2
  },
  clampToGround:true
};
draw.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};

