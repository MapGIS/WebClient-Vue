import Mapgis3dStratifiedHousehold from "../../cesium/src/components/Analysis/StratifiedHousehold.vue";

export default {
    title: "三维/图层/场景图层/静态单体化",
    component: Mapgis3dStratifiedHousehold,
    argTypes: {
        enablePopup: true,
        enableDynamicQuery: false,
        enableStratifiedHouse: true,
    },
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Mapgis3dStratifiedHousehold },
    data() {
        return {
            g3d: {
                // url: "http://192.168.88.204:6163/igs/rest/g3d/大楼",
                url: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/services/分层分户-静态单体化/SceneServer`,
                enableControl: false,
            }
        };
    },
    methods: {
        handleMapload() {
        },
    },
    template: `<mapgis-web-scene @load="handleMapload" style="height:95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-scene-layer v-bind="g3d" vueIndex="test_g3d_layer1" />
    <mapgis-3d-stratified-household v-bind="$props" vueIndex="test_g3d_layer1" />
    <mapgis-3d-statebar />
  </mapgis-web-scene>`,
});

export const 静态单体化 = Template.bind({});
静态单体化.args = {
    enablePopup: true,
    enableDynamicQuery: false,
    enableStratifiedHouse: true,
};
