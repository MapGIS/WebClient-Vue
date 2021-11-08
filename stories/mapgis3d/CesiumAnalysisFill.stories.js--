export default {
    title: "三维/分析/填挖方分析"
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url: "http://t0.tianditu.gov.cn/img_c/wmts",
            terrainUrl: '',
            tileMatrixSet: "c",
            tilingScheme: "EPSG:4326",
            layer:"img",
            format: "tiles",
            token:{
                key: "tk",
                value: "9c157e9585486c02edf817d2ecbc7752"
            },
            showTerrain: false
        }
    },
    template: `
      <mapgis-web-scene
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
      <mapgis-3d-terrain-provider :url="terrainUrl" :v-if="showTerrain"></mapgis-3d-terrain-provider>
      <mapgis-3d-cut-fill></mapgis-3d-cut-fill>
      </mapgis-web-scene>
    `,
    methods: {
        handleLoad(e) {
            const { component, Cesium } = e;
            Cesium.Ion.defaultAccessToken =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE';
            const { webGlobe } = component;
            webGlobe.viewer.camera.setView({
                direction: { x: 0.4680575394156845, y: -0.8267033643312148, z: 0.31222377744109403 },
                position: { x: -674271.5790185562, y: 5530042.656916835, z: 3232882.3357299212 }
            });
            //构造视图功能管理对象（视图）
            var sceneManager = new CesiumZondy.Manager.SceneManager({
                viewer: webGlobe.viewer
            });
            //视点跳转（经度，纬度，视角高度，方位角，俯仰角，翻滚角）
            sceneManager.flyToEx(94.73761648879076, 29.44177452960854, {
                height: 5900,
                heading: 60,
                pitch: -16,
                roll: 0
            });

            this.terrainUrl = new Cesium.IonResource.fromAssetId(1);
            this.showTerrain = true;
        }
    }
});

export const Fill = Template.bind({});
Fill.args = {}