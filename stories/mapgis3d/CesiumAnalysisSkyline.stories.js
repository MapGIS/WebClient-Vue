import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Skyline.md";

export default {
    title: "三维/分析/天际线"
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
        <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-skyline></mapgis-3d-skyline>
        </mapgis-ui-card>
    </mapgis-web-scene>
    `
});

export const Skyline = Template.bind({});
Skyline.args = {}
Skyline.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};