import "../style/card.css";
import Markdown from "../../cesium/docs/api/simulation/PondingSimulation.md";
import Mapgis3dPondingSimulation from "../../cesium/src/components/simulation/PondingSimulation.vue";

export default {
  title: "三维/模拟仿真",
  component: Mapgis3dPondingSimulation,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: {
    "mapgis-3d-ponding-simulation": Mapgis3dPondingSimulation,
  },
  data() {
    return {
      rasterUrl:
        "http://t4.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}&tk=2ddaabf906d4b5418aed0078e1657029",
      maximumScreenSpaceError: 8,

      //ponding-simulation
      time: undefined,
      pond: undefined,
      cost: undefined,
      mltSpeed: undefined,
    };
  },
  template: `
  <mapgis-web-scene
        style="height: 95vh"
        v-on:load="handleLoad"
    >
      <mapgis-ui-button type="primary" v-if="!pondingPanelShow" @click="startSimulation" :style="{position: 'absolute', zIndex:3000,top:'0px',right:'225px'}">
        开始
      </mapgis-ui-button>
      <mapgis-ui-button v-if="!pondingPanelShow" @click="closeSimulation" :style="{position: 'absolute', zIndex:3000,top:'0px',right:'135px'}">
        清除
      </mapgis-ui-button>
      <mapgis-ui-button type="primary" v-if="!pondingPanelShow" @click="addSimulation" :style="{position: 'absolute', zIndex:3000,top:'0px',right:'25px'}">
        重现效果
      </mapgis-ui-button>
        <mapgis-3d-raster-layer :url="rasterUrl" />
      
        <mapgis-3d-igs-terrain :url="$props.terrainUrl" />
        <mapgis-3d-ponding-simulation
            ref="simulation"
            v-show="pondingPanelShow"
            v-bind="$props"
            @isPonding="e=>{pond = e}"
            @costTime="e=>{cost = e}"
            :pondingTime="time"
            :multiSpeed="mltSpeed"
            style="position: absolute; top: 10px; left: 10px;width:320px;"
        />
        <mapgis-3d-ponding-simulation-timeline 
            :costTime="cost" 
            :isPlaying="pond" 
            v-show="pondingPanelShow"
            @updateTime="e=>{time = e}"
            @updateSpeed="e=>{mltSpeed = e}"
            @play="addSimulation"
        />
    </mapgis-web-scene>
    `,
  methods: {
    handleLoad(e) {
      const { component, Cesium } = e;
      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiM2Q0ZGMxYy1iZGZkLTQ4OWItODlhMy1iOWNkMDE0M2U3YWEiLCJpZCI6NTEzNSwiaWF0IjoxNjA2MjE0OTkyfQ.2aktNrUASlLsPwSFtkgKBTQLJTAnOTyjgKDRQmnafiE";
      const { viewer } = component;
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
        // destination: Cesium.Cartesian3.fromDegrees(121, 24, 5900),//台湾
        destination: Cesium.Cartesian3.fromDegrees(121, 24, 5900),
        orientation: {
          heading: Cesium.Math.toRadians(60),
          pitch: Cesium.Math.toRadians(-16),
          roll: 0,
        },
        duration: 1,
      });
    },
    addSimulation() {
      this.$refs.simulation.addSimulation();
    },
    startSimulation() {
      this.$refs.simulation.simulation();
    },
    closeSimulation() {
      this.$refs.simulation.stopSimulation();
    },
  },
});
121.08607120432691;
export const 积水仿真自定义 = Template.bind({});
积水仿真自定义.args = {
  terrainUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/g3d/Scene:TwTerrain`,
  rainFallDaily: 100,
  pondingPanelShow: false,
  floodColor: "rgba(149,232,249,0.5)",
  drainageVolOfArea: 0,
  rainAngle: 30,
  pondingArea: {
    type: "rectangle",
    coordinates: [
      [121.0936741922885, 24.109364989571024],
      [121.11004105293685, 24.099987666838317],
    ],
  },
};
积水仿真自定义.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
