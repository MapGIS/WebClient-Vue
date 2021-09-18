import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/HeightLimited.md";
export default {
    title: "三维/分析/控高分析",
    argTypes:{
        color: {
            //描述信息，即页面上Description那一栏的值
            description:'分析时显示颜色',
            table:{
                //description描述信息下的提示框，可选，添加这一项就会在描述信息文字下生成一个提示信息按钮
                //summary：提示按钮里的文字，detail：提示信息
                type:{ summary: 'tips',detail: "CSS的十六进制" },
                //默认值，即页面上Default那一栏的值，不在这里填写，则页面上不会有默认值
                //如果加了detail,{ summary: 'null',detail: "这里是提示" },则页面会多出一个描述信息的提示框
                defaultValue: { summary: '#ff0000' },
            },
            //Control这里一栏里面展示数据的方式，可以是input、textArean、boolean等，可选值如下
            control:'text'
        },
        opacity:{
            description:'分析结果透明度',
            table:{
                defaultValue: { summary: 0.5 },
            },
            control:'text'
        },
        maxSliderHeight:{
            description:'滑动条最大值',
            table:{
                defaultValue: { summary: 50 },
            },
            control:'text'
        },

    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url:
                "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
            m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
            autoReset: true,
            maximumScreenSpaceError: 8,
            vueIndex:22
        }
    },
    template: `
      <mapgis-web-scene>
      <mapgis-3d-raster-layer :url="url"></mapgis-3d-raster-layer>
      <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl" :vue-index="vueIndex"></mapgis-3d-igs-m3d>
      <mapgis-ui-card class="storybook-ui-card">
      <mapgis-3d-heightlimited :vue-index="vueIndex" :maxSliderHeight="maxSliderHeight" :color="color" :opacity="opacity"></mapgis-3d-heightlimited>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `
});

export const HeightLimited = Template.bind({});
HeightLimited.args = {
    maxSliderHeight:120,
    color:"#1C9C80",
    opacity: 0.6,
}
HeightLimited.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};