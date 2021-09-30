import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Shadow.md";
export default {
    title: "三维/分析/阴影分析",
    argTypes: {
        shadowColor: {
            //描述信息，即页面上Description那一栏的值
            description: '阴影部分颜色',
            table: {
                defaultValue: {summary: 'rgba(0,255,0,255)'},
            },
            control: 'color'
        },
        sunColor: {
            description: '非阴影部分颜色',
            table: {
                defaultValue: {summary: 'rgba(255,0,0,255)'},
            },
            control: 'color'
        },
        minHeight: {
            description: '底部高程(米)',
            table: {
                defaultValue: {summary: '0'},
            },
            control: 'number'
        },
        stretchHeight: {
            description: '拉伸高度(米)',
            table: {
                defaultValue: {summary: '20'},
            },
            control: 'number'
        }
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
      <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"></mapgis-3d-igs-m3d>
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-shadow
            :shadowColor="shadowColor"
            :sunColor="sunColor"
            :minHeight="minHeight"
            :stretchHeight="stretchHeight">
        </mapgis-3d-shadow>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `
});

export const Shadow = Template.bind({});
Shadow.args = {
    shadowColor:'rgba(0,255,0,255)',
    sunColor:'rgba(255,0,0,255)',
    minHeight:0,
    stretchHeight:19
}
Shadow.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};