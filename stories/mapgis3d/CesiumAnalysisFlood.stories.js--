export default {
    title: "三维/分析/洪水淹没"
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            //地形url
            demUrl: "",
            showDem: false,
            //天地图地址，请在url地址后面加token
            urlT: "http://t0.tianditu.gov.cn/img_c/wmts",
            //参考系
            tileMatrixSetID: "c",
            srs: "EPSG:4326",
            layer:"img",
            format: "tiles",
            token:{
                key: "tk",
                value: "f5347cab4b28410a6e8ba5143e3d5a35"
            },
            //初始淹没高度，淹没总高度为currentHeight - startHeight - minHeight
            startHeight: 0,
            //初始淹没点
            minHeight: 2800,
            //当前淹没高度
            currentHeight: 0,
            //最大淹没高度
            maxHeight: 6000,
            //淹没颜色
            floodColor: "#4e81bb",
            //洪水上涨速度
            floodSpeed: 300,
            //洪水反射光线强度
            specularIntensity: 1,
            //洪水水波高度
            amplitude: 10,
            //洪水水纹速度
            animationSpeed: 0.01,
            //洪水水纹频率
            frequency: 1000,
            showPicker: false
        }
    },
    template: `
      <mapgis-web-scene
          v-on:load="handleLoad"
      >
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="urlT"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSetID"
          :format="format"
          :tilingScheme="srs"
          :token="token"
      ></mapgis-3d-ogc-wmts-layer>
      <mapgis-3d-terrain-provider :url="demUrl" :v-if="showDem"></mapgis-3d-terrain-provider>
      <mapgis-3d-flood
          :startHeight="startHeight"
          :minHeight="minHeight"
          :currentHeight="currentHeight"
          :maxHeight="maxHeight"
          :floodColor="floodColor"
          :floodSpeed="floodSpeed"
          :specularIntensity="specularIntensity"
          :amplitude="amplitude"
          :animationSpeed="animationSpeed"
          :frequency="frequency"
          :showPicker="showPicker"
      >
      </mapgis-3d-flood>
      </mapgis-web-scene>
    `,
    methods:{
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

            this.demUrl = new Cesium.IonResource.fromAssetId(1);
            this.showDem = true;

            console.log('地图加初始化完毕！', webGlobe.viewer.camera);
        }
    }
});

export const Flood = Template.bind({});
Flood.args = {}