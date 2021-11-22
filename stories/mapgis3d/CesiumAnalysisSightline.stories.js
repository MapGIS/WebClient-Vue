import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Sightline.md";
export default {
    title: "三维/分析/通视分析",
    argTypes: {
        visibleColor: {
            description: '可视区域颜色',
            table: {
                defaultValue: {summary: '#008000'},
            },
            control: 'color'
        },
        unVisibleColor: {
            description: '不可视区域颜色',
            table: {
                defaultValue: {summary: '#ff0000'},
            },
            control: 'color'
        },
        exHeight: {
            description: '观察点的附加高度',
            table: {
                defaultValue: {summary: '1.85'},
            },
            control: 'number'
        }
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url: "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
            m3dUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
            autoReset: true,
            maximumScreenSpaceError: 8
        }
    },
    template: `
    <mapgis-web-scene :style="{height: '95vh'}">
        <mapgis-3d-raster-layer :url="url" />
        <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl" />
        <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-sightline 
          :exHeight="exHeight"
          :visibleColor="visibleColor"
          :unVisibleColor="unVisibleColor"
        ></mapgis-3d-sightline>
        </mapgis-ui-card>
    </mapgis-web-scene>
    `
});

export const Sightline = Template.bind({});
Sightline.args = {
    exHeight:2.0,
    visibleColor:'#2E8B57',
    unVisibleColor:'#FFA500'
}
Sightline.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};