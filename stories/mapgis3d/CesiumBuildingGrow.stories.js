import "../style/card.css";
import Markdown from "../../cesium/docs/api/simulation/BuildingGrow.md";

export default {
    title: "三维/模拟仿真/单体建筑生长",
    argTypes: {},
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            loadedM3d: false
        };
    },
    methods: {
        getTree() {
            this.loadedM3d = true;
        }
    },
    template: `
      <mapgis-web-scene style="height:95vh">
      <mapgis-ui-button type="primary" @click="getTree" :style="{position: 'absolute', zIndex:3000,top:'0px'}">
        开启单体化生长播放条
      </mapgis-ui-button>
      <mapgis-rastertile-layer v-if="false" layerId="tdt"
                               url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"/>
      <mapgis-3d-m3d-layer
          :url="m3d" vueIndex="test_building_layer"/>
      <mapgis-3d-building-glow vueIndex="test_building_layer" v-if="loadedM3d"/>
      </mapgis-web-scene>
    `,
});

export const buildingGrow = Template.bind({});
buildingGrow.args = {
    m3d: 'http://192.168.88.204:8089/M3D/2.0/BIM%E6%A8%A1%E5%9E%8B%E7%94%9F%E9%95%BFtime/BIM%E6%A8%A1%E5%9E%8B%E7%94%9F%E9%95%BFtime.mcj'
};
buildingGrow.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};
