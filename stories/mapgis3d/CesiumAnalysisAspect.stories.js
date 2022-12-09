import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Aspect.md";

export default {
    title: "三维/三维分析/地形分析/坡向",
    argTypes: {
        rampColors: {
            description: "坡向分析角度颜色数组",
            table: {
                defaultValue: {
                    summary:
                        '[{ min: 0, max: 60, color: "rgba(244, 67, 54, 0.5)" },{ min: 60, max: 120, color: "rgba(233, 30, 99, 0.5)" },{ min: 120, max: 180, color: "rgba(156, 39, 176, 0.5)" },{ min: 180, max: 240, color: "rgba(255, 235, 59, 0.5)" },{ min: 240, max: 300, color: "rgba(96, 125, 139, 0.5)" },{ min: 300, max: 360, color: "rgba(76, 175, 80, 0.5)" }]',
                },
            },
            control: "array",
        },
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url: "http://t0.tianditu.gov.cn/img_c/wmts",
            //地形url TODO这里地址打包的时候改一下
            //terrainUrl: "http://192.168.21.191:6163/igs/rest/g3d/terrain",
            terrainUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/terrain`,
            tileMatrixSet: "c",
            tilingScheme: "EPSG:4326",
            layer: "img",
            format: "tiles",
            token: {
                key: "tk",
                value: "2ddaabf906d4b5418aed0078e1657029",
            },

        };
    },
    template: `
      <mapgis-web-scene style="height:95vh"
                        v-on:load="handleLoad"
      >
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="url"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSet"
          :format="format"
          :tilingScheme="tilingScheme"
          :token="token"
      ></mapgis-3d-ogc-wmts-layer>
      <mapgis-3d-igs-terrain :url="terrainUrl" :requestVertexNormals="true"/>
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-analysis-aspect
            :rampColors="rampColors"
        />
      </mapgis-ui-card>
      </mapgis-web-scene>
    `,
    methods: {
        handleLoad(e) {
            const {component, Cesium} = e;
            Cesium.Ion.defaultAccessToken =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
            const {viewer} = component;
            viewer.camera.setView({
                direction: {
                    x: 0.4680575394156845,
                    y: -0.8267033643312148,
                    z: 0.31222377744109403,
                },
                position: {
                    x: -674271.5790185562,
                    y: 5530042.656916835,
                    z: 3232882.3357299212,
                },
            });
            //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(121, 24, 5900),
                orientation: {
                    heading: Cesium.Math.toRadians(60),
                    pitch: Cesium.Math.toRadians(-16),
                    roll: 0,
                },
                duration: 1
            })
        },
    },
});

export const 坡向 = Template.bind({});
坡向.args = {
    rampColors: [
        {min: 0, max: 60, color: "rgba(244, 67, 54, 0.5)"},
        {min: 60, max: 120, color: "rgba(233, 30, 99, 0.5)"},
        {min: 120, max: 180, color: "rgba(156, 39, 176, 0.5)"},
        {min: 180, max: 240, color: "rgba(255, 235, 59, 0.5)"},
        {min: 240, max: 300, color: "rgba(96, 125, 139, 0.5)"},
        {min: 300, max: 360, color: "rgba(76, 175, 80, 0.5)"},
    ],
};

坡向.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};
