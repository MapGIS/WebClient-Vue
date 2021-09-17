import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Sightline.md";
export default {
    title: "三维/分析/通视分析"
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
        <mapgis-3d-sightline></mapgis-3d-sightline>
        </mapgis-ui-card>
    </mapgis-web-scene>
    `
});

export const Sightline = Template.bind({});
Sightline.args = {}
Sightline.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};