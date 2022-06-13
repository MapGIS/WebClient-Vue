import Mapgis3dLink from "../../cesium/src/components/UI/Controls/Link/Link.vue";
import "../style/link.css";
import {SymbolManager,PlotLayer3D,PlotLayer3DGroup,PlotLayer2D,PlotLayer2DGroup,DrawTool,LinkTool} from "@mapgis/webclient-es6-service";
import { FabricLayer } from "@mapgis/webclient-es6-mapboxgl";

export default {
  title: "三维/场景子组件/标绘二三维联动",
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
      link: false,
      url1:
        "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      url2: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      rect: {},
    };
  },
  watch: {
    rect: function (next) {
      const { east, north, south, west } = next["2d"];
      console.log(east, north, south, west);
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
    let interval = setInterval(function () {
      if(window.canvas){
        clearInterval(interval);
        window.manager = new SymbolManager("http://localhost:8895/symbols.json");
        window.manager.getSymbols().then(function () {
          let ttt = {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {
                  "symbolId": 15,
                  "symbolName": "",
                  "show": true,
                  "featureId": "25fbe0d5-e1ca-417a-83ff-31405e778415",
                  "isScaleByMap": true,
                  "compareLine": 0,
                  "compareLineWidth": 6,
                  "compareLineColor": "#099563",
                  "symbolNodes": {
                    "rect4154": {
                      "strokeStyle": "rgba(255,0,0,1)",
                      "lineCap": "square",
                      "lineJoin": "miter",
                      "miterLimit": 4,
                      "lineWidth": 8,
                      "fillStyleType": 1,
                      "fillGradType": 1,
                      "fillGradColor": "rgba(0,0,0,0)",
                      "fillStyle": "none",
                      "fillRule": "nonzero"
                    }
                  },
                  "domModAttributes": { "surfaceBorderWidth": 3 }
                },
                "geometry": {
                  "type": "MultiPoint",
                  "coordinates": [
                    [116.44411062141602, 39.643974446739286],
                    [116.5419815782256, 39.68357355825482],
                    [116.60596758280553, 39.63092408084513],
                    [116.5727776225519, 39.58032246424675],
                    [116.51616403871293, 39.544084553798534],
                    [116.49223063320721, 39.572437761144904]
                  ]
                }
              }
              ]
          }
          // window.layer1 = new PlotLayer3D(Cesium, viewer);
          // window.layer1.fromJSON(ttt);
          window.layer1 = new PlotLayer2D(fabricCanvas);
          window.layer1.fromJSON(ttt);
          let fabricCanvas = window.canvas.getFabricCanvas();
          fabricCanvas.addLayer(window.layer1);
            window.drawTool = new DrawTool(window.layer1, {
              addedPlot: function (plot) {
                console.log("已添加图元",plot)
                window.plot = plot;
              }
            });
          window.layer1.pickPlot = function (result) {
            console.log("--------result", result)
          }
          setTimeout(function () {
            window.linkTool = new LinkTool(window.layer1,[window.viewer,window.canvas]);
            // window.drawTool = new DrawTool(window.layer1, {
            //   addedPlot: function (plot) {
            //     console.log("已添加图元",plot)
            //     window.plot = plot;
            //   }
            // });
            console.log("window.layer1",window.layer1)
          },1000);
        })
      }
    },100);
  },
  methods: {
    setStyle() {
      window.plot.setStyle("strokeStyle","#0000ff","path4174");
      console.log("getStyle",window.plot.getStyle())
    },
    draw() {
      // window.linkTool.isLinked = false;
      //取得二类线符号
      window.leaf = window.manager.getLeafByID(12);
      window.leaf.getElement().then(function (res) {
        window.drawTool.drawPlot(leaf);
      });
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
      <button @click="draw" style="position: absolute;left: 10px;top: 10px;z-index: 10000">绘制</button>
      <button @click="setStyle" style="position: absolute;left: 60px;top: 10px;z-index: 10000">改样式</button>
      <mapgis-web-map crs="EPSG:3857"  @load="handle2dLoad">
        <mapgis-rastertile-layer :url="url2" layerId="raster_tdt" />
      </mapgis-web-map>
    </div>
    <div class="cesium-item top-right">
      <mapgis-web-scene @load="threeload">
        <mapgis-3d-raster-layer :url="url1"> </mapgis-3d-raster-layer>
        <mapgis-3d-link :enable="link" v-model="rect" ></mapgis-3d-link>
      </mapgis-web-scene>
    </div>
    <div :class="{'control-2d-3d': true, 'link-active': link}" v-on:click="changeMode"></div>
  </div>`,
});

export const 标绘二三维联动 = Template.bind({});
标绘二三维联动.args = {
  timestamp: 1,
};
