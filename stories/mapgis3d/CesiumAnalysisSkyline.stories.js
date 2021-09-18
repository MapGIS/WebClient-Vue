import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Skyline.md";

export default {
    title: "三维/分析/天际线分析",
    argTypes:{
        position: {
            //描述信息，即页面上Description那一栏的值
            description:'分析面板的位置',
            table:{
                //description描述信息下的提示框，可选，添加这一项就会在描述信息文字下生成一个提示信息按钮
                //summary：提示按钮里的文字，detail：提示信息
                // type:{ summary: 'tips',detail: "这里是提示" },
                //默认值，即页面上Default那一栏的值，不在这里填写，则页面上不会有默认值
                //如果加了detail,{ summary: 'null',detail: "这里是提示" },则页面会多出一个描述信息的提示框
                defaultValue: { summary: 'null' },
            },
            //Control这里一栏里面展示数据的方式，可以是input、textArean、boolean等，可选值如下
            control:'text'
        }
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url: "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
            m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
            autoReset: true,
            maximumScreenSpaceError: 8
        }
    },
    template: `
    <mapgis-web-scene>
        <mapgis-3d-raster-layer :url="url" />
        <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl" />
        <mapgis-3d-skyline :position="position"></mapgis-3d-skyline>
    </mapgis-web-scene>
    `
});

export const Skyline = Template.bind({});
Skyline.args = {
    position:"left"
}
Skyline.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};