import Mapgis3dLink from "../../cesium/src/components/UI/Controls/Link/Link.vue";
import "../style/link.css";
import {SymbolManager,PlotLayer3D,PlotLayer3DGroup,PlotLayer2D,PlotLayer2DGroup,DrawTool,LinkTool} from "@mapgis/webclient-es6-service";
import { FabricLayer } from "@mapgis/webclient-es6-mapboxgl";

export default {
  title: "三维/场景子组件/二三维联动/标绘(js)",
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
    };
  },
  watch: {
    rect: function (next) {
      const { east, north, south, west } = next["2d"];
      let map = this.map || window.map;
      let bbox = [
        [west, south],
        [east, north],
      ];
      map.fitBounds(bbox, {
        duration: 0,
      });
    },
  },
  mounted() {
  },
  methods: {
    handleLoaded(e) {
      this.vueIndex1 = e.vueIndex;
      this.vueKey1 = e.vueKey;
      let vueCesium = window.vueCesium;
      if (!vueCesium) return;
      let layerManager = vueCesium.PlotLayerManager.findSource(
        this.vueKey1,
        this.vueIndex1
      );
      window.layer = layerManager && layerManager.source;
      setTimeout(function () {
        let json = layer.toJSON()
        let interval = setInterval(function () {
          if(window.canvas){
            clearInterval(interval);
            window.layer.editable = true;
            window.linkTool = new LinkTool(window.layer,[window.viewer,window.canvas]);
          }
        },100);
      },2000)
    },
    changeMode() {
      this.link = !this.link;
    },
    handle2dLoad(e) {
      window.map = this.map = e.map;
      const canvas = new FabricLayer(window.map, PlotLayer2DGroup);
      const fabricCanvas = canvas.getFabricCanvas();
      window.canvas = canvas;
    },
    threeload(e) {
      window.cesium = e.Cesium;
      window.viewer = e.component.viewer;
    }
  },
  template: `<div class="mapgis-link-test">
    <div class="mapbox-item top-left">
      <mapgis-web-map crs="EPSG:3857"  @load="handle2dLoad">
        <mapgis-rastertile-layer :url="url2" layerId="raster_tdt" />
      </mapgis-web-map>
    </div>
    <div class="cesium-item top-right">
      <mapgis-web-scene @load="threeload">
        <mapgis-3d-plot-layer :symbolUrl="symbolUrl" @loaded="handleLoaded" :dataSource="jsonUrl"></mapgis-3d-plot-layer>
        <mapgis-3d-plot :symbolUrl="symbolUrl" :vueIndex="vueIndex1" :vueKey="vueKey1" v-if="vueIndex1 && vueKey1" class="storybook-ui-card"/>
        <mapgis-3d-raster-layer :url="url1"> </mapgis-3d-raster-layer>
        <mapgis-3d-link :enable="link" v-model="rect" ></mapgis-3d-link>
      </mapgis-web-scene>
    </div>
    <div :class="{'control-2d-3d': true, 'link-active': link}" v-on:click="changeMode"></div>
  </div>`,
});

export const 标绘 = Template.bind({});
标绘.args = {
  timestamp: 1,
};
