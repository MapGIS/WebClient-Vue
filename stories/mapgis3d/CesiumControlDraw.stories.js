export default {
  title: "三维/场景子组件/绘制组件",
  argTypes: {
    drawStyle:{
      description: "绘制样式：<br>" +
          "1、<span class='storybook-span'>color</span>(选填)：填充颜色，默认值#FF0000<br>" +
          "2、<span class='storybook-span'>opacity</span>(选填)：透明度，默认值1<br>" +
          "3、<span class='storybook-span'>outlineWidth</span>(选填)：外边线宽度，默认值1<br>" +
          "4、<span class='storybook-span'>outlineColor</span>(选填)：外边线颜色，默认值#000000<br>" +
          "5、<span class='storybook-span'>width</span>(选填)：绘制线时，线的宽度，默认值2<br>" +
          "",
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
    },
    infinite:{
      description:'连续绘制开关',
      table:{
        defaultValue: { summary: 'false' },
      },
      control:'boolean'
    }
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `<mapgis-web-scene style="height: 95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-draw :enableControl="enableControl" 
                    :drawStyle="drawStyle"
                    :clampToGround="clampToGround"
                    :position="position"
                    :infinite="infinite"
    ></mapgis-3d-draw>
  </mapgis-web-scene>`
});

export const draw = Template.bind({});
draw.args = {
  enableControl: true,
  position:"top-right",
  drawStyle:{
    color:'#FF8C00',
    opacity:0.6,
    // outlineColor:'#FFA500',
    // width:4,
    // outlineWidth:2
  },
  clampToGround:true,
  infinite:true
};

