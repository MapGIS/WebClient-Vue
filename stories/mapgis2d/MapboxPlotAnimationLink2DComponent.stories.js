import Mapgis3dLink from "../../cesium/src/components/UI/Controls/Link/Link.vue";
import "../style/link.css";
import {SymbolManager,PlotLayer3D,PlotLayer3DGroup,PlotLayer2D,PlotLayer2DGroup,DrawTool,LinkTool} from "@mapgis/webclient-es6-service";
import { FabricLayer } from "@mapgis/webclient-es6-mapboxgl";
import * as axios from "axios";

export default {
  title: "二维/场景子组件/二三维联动/态势推演",
  component: Mapgis3dLink,
  argTypes: {
    timestamp: 100,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Mapgis3dLink },
  data() {
    return {
      link: true,
      url1:
        "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      url2: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      rect: {},
      vueIndex1: undefined,
      vueKey1: undefined,
      jsonUrl: `http://${window.webclient.ip}:${window.webclient.port}/标绘/test.json`,
      symbolUrl: `http://${window.webclient.ip}:${window.webclient.port}/标绘/symbols.json`,
      dataUrl: `http://${window.webclient.ip}:${window.webclient.port}/标绘/animation.json`,
      vueIndex: 12345,
      containers:[{vueIndex:12345,vueKey: "default",type:"mapbox"},{vueIndex:12345,vueKey: "default",type:"cesium"}],
      layers: [{vueIndex:23456,vueKey: "default"}],
      manager: undefined,
      dataSource: undefined,
      mapboxActive: false,
      rectCount: 0
    };
  },
  watch: {
    rect: function (next) {
      this.rectCount++;
      if(this.rectCount > 1){
        const { east, north, south, west } = next["2d"];
        let map = this.map || window.map;
        let bbox = [
          [west, south],
          [east, north],
        ];
        map.fitBounds(bbox, {
          duration: 0,
        });
      }
    },
  },
  mounted() {
  },
  created() {
    this.manager = window.PlotSymbolManager;
    if (!this.manager) {
      this.manager = new SymbolManager(this.symbolUrl);
      window.PlotSymbolManager = this.manager;
    }
  },
  methods: {
    handleLoaded(e) {
      const vm = this;
      axios.get(vm.dataUrl).then((res) => {
        vm.dataSource = res.data;
        vm.vueIndex1 = e.vueIndex;
        vm.vueKey1 = e.vueKey;
      });
    },
    changeMode() {
      this.link = !this.link;
    },
    handle2dLoad(e) {
      let vm = this;
      window.map = this.map = e.map;
      let bbox = [
        [116.2396164394222, 36.857699114405676],
        [119.38483688908019,33.044482287500756],
      ];
      this.map.fitBounds(bbox, {
        duration: 0,
      });
      this.map.on('wheel', function (e) {
        let bounds = vm.map.getBounds();
        vm.flyToRect(bounds);
      });
      this.map.on('wheel', function (e) {
        let bounds = vm.map.getBounds();
        vm.flyToRect(bounds);
      });
      this.map.on('mousedown', function (e) {
        vm.mapboxActive = true;
      });
      this.map.on('mouseup', function (e) {
        vm.mapboxActive = false;
      });
      let mapboxManager = window.vueMap.MapManager.findSource("default", this.vueIndex);
      let fabricCanvas = mapboxManager.options.canvas.getFabricCanvas();
      fabricCanvas.on("mouse:move",function () {
        if(vm.mapboxActive){
          let bounds = vm.map.getBounds();
          vm.flyToRect(bounds);
        }
      });
    },
    flyToRect(bounds) {
      viewer.camera.flyTo({
        destination: Cesium.Rectangle.fromDegrees(bounds._sw.lng,bounds._sw.lat,bounds._ne.lng,bounds._ne.lat),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0,
        },
        duration: 0.1
      })
    },
    webGlobeLoaded() {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(117.7646, 33.0881, 210000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
        duration: 1
      })
    }
  },
  template: `<div class="mapgis-link-test">
    <div class="mapbox-item top-left">
      <mapgis-web-map crs="EPSG:3857"  @load="handle2dLoad" :vueIndex="vueIndex">
        <mapgis-2d-plot-layer :vueIndex="23456" :symbolUrl="symbolUrl" @loaded="handleLoaded" :dataSource="jsonUrl" v-if="manager"></mapgis-2d-plot-layer>
        <mapgis-2d-plot-animation :data="dataSource" :vueIndex="vueIndex1" :vueKey="vueKey1" v-if="vueIndex1"/>
        <mapgis-2D-plot-link :layers="layers" :containers="containers"></mapgis-2D-plot-link>
        <mapgis-rastertile-layer :url="url2" layerId="raster_tdt" />
      </mapgis-web-map>
    </div>
    <div class="cesium-item top-right">
        <mapgis-web-scene @load="webGlobeLoaded" :vueIndex="vueIndex">
        <mapgis-3d-raster-layer :url="url1"> </mapgis-3d-raster-layer>
        <mapgis-3d-link :timestamp="100" :enableWheel="true" :enable="link" v-model="rect" ></mapgis-3d-link>
      </mapgis-web-scene>
    </div>
    <div :class="{'control-2d-3d': true, 'link-active': link}" v-on:click="changeMode"></div>
  </div>`,
});

export const 态势推演 = Template.bind({});
态势推演.args = {
  timestamp: 1,
  vueIndex: 12345,
};
