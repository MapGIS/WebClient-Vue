import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Viewshed.md";

export default {
    title: "三维/分析/可视域分析",
    argTypes:{
        horizontAngle: {
            description:'观察点的水平视角',
            table:{
                defaultValue: { summary: '60' },
            },
            control:'number'
        },
        verticalAngle: {
            description:'观察点的垂直视角',
            table:{
                defaultValue: { summary: '60' },
            },
            control:'number'
        },
        exHeight: {
            description:'观察点的附加高度，单位为米',
            table:{
                defaultValue: { summary: '1.85' },
            },
            control:'number'
        },
        maskColor: {
            description:'可视遮罩颜色',
            table:{
                defaultValue: { summary: 'rgba(37, 218, 169, 0.2)' },
            },
            control:'color'
        },
        visibleColor: {
            description:'可视区域颜色',
            table:{
                defaultValue: { summary: '#00ff00' },
            },
            control:'color'
        },
        unVisibleColor: {
            description:'非可视区域颜色',
            table:{
                defaultValue: { summary: '#ff0000' },
            },
            control:'color'
        },
    }
}

const Template = (args, {argTypes}) => ({
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
      <mapgis-web-scene style="height:95vh">
      <mapgis-3d-raster-layer :url="url"/>
      <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"/>
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-viewshed 
            :horizontAngle="horizontAngle"
            :verticalAngle="verticalAngle"
            :exHeight="exHeight"
            :maskColor="maskColor" 
            :visibleColor="visibleColor"
            :unVisibleColor="unVisibleColor"></mapgis-3d-viewshed>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `
});

export const Viewshed = Template.bind({});
Viewshed.args = {
    horizontAngle: 70,
    verticalAngle:60,
    maskColor: 'rgba(37, 218, 169, 0.2)',
    visibleColor:'#00ff00',
    unVisibleColor:'#ff0000',
    exHeight:1.85
};
Viewshed.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};