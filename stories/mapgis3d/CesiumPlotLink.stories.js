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
      link: true,
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
        window.manager = new SymbolManager(`http://${window.webclient.staticIP}:8895/标绘/symbols.json`);
        // window.manager = new SymbolManager(`http://localhost:8895/标绘/symbols.json`);
        window.manager.getSymbols().then(function () {
          let ttt = {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {
                  "show": true,
                  "featureId": "18ae26c4-2f7b-4d7e-8db0-ff4f9f8c49e3",
                  "isScaleByMap": true,
                  "compareLine": 0,
                  "compareLineWidth": 6,
                  "compareLineColor": "#099563",
                  "symbolId": 3,
                  "symbolName": "",
                  "symbolNodes": {
                    "irregular": {
                      "strokeStyle": "rgba(255,0,0,1)",
                      "lineCap": "butt",
                      "lineJoin": "miter",
                      "miterLimit": 4,
                      "lineWidth": 4,
                      "fillStyleType": 1,
                      "fillGradType": 1,
                      "fillGradColor": "rgba(255,255,100,0.70588235)",
                      "fillStyle": "rgba(255,255,100,0.70588235)",
                      "fillRule": "evenodd"
                    }
                  }
                },
                "geometry": {
                  "type": "MultiPoint",
                  "coordinates": [
                    [116.36185501768244, 39.73256769825403],
                    [116.45931493656178, 39.752626536094425],
                    [116.53755740664587, 39.73890269889742],
                    [116.62129057638595, 39.80854927114092],
                    [116.64599872483541, 39.84123772837549]
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "show": true,
                  "featureId": "543c7f4d-d71d-483a-9387-07d4b85d59af",
                  "isScaleByMap": true,
                  "compareLine": 0,
                  "compareLineWidth": 6,
                  "compareLineColor": "#099563",
                  "symbolId": 2,
                  "symbolName": "",
                  "symbolNodes": {
                    "irregular": {
                      "strokeStyle": "rgba(255,0,0,1)",
                      "lineCap": "butt",
                      "lineJoin": "miter",
                      "miterLimit": 4,
                      "lineWidth": 4,
                      "fillStyleType": 1,
                      "fillGradType": 1,
                      "fillGradColor": "rgba(255,255,100,0.70588235)",
                      "fillStyle": "rgba(255,255,100,0.70588235)",
                      "fillRule": "evenodd"
                    }
                  }
                },
                "geometry": {
                  "type": "MultiPoint",
                  "coordinates": [
                    [116.34765159860672, 39.83741690017732],
                    [116.41189424744567, 39.861974774546354],
                    [116.45655898628195, 39.847618400046144],
                    [116.49187529141045, 39.88589539178005]
                  ]
                }
              },
              {
                "type": "Feature",
                "properties": {
                  "show": true,
                  "featureId": "e6d5ca39-1525-431d-8b07-d896ee1708b7",
                  "isScaleByMap": true,
                  "compareLine": 0,
                  "compareLineWidth": 6,
                  "compareLineColor": "#099563",
                  "symbolId": 5,
                  "symbolName": "",
                  "symbolNodes": {
                    "irregular": {
                      "strokeStyle": "rgba(255,0,0,1)",
                      "lineCap": "butt",
                      "lineJoin": "miter",
                      "miterLimit": 4,
                      "lineWidth": 4,
                      "fillStyleType": 1,
                      "fillGradType": 1,
                      "fillGradColor": "rgba(255,255,100,0.70588235)",
                      "fillStyle": "rgba(255,255,100,0.70588235)",
                      "fillRule": "evenodd"
                    }
                  }
                },
                "geometry": {
                  "type": "MultiPoint",
                  "coordinates": [
                    [116.11722785625255, 39.69386634411077],
                    [116.18174357720125, 39.745614182422116],
                    [116.22155114970053, 39.72344129205399],
                    [116.27096744659741, 39.683300790403024]
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
          }
          setTimeout(function () {
            window.layer1.editable = true;
            window.linkTool = new LinkTool(window.layer1,[window.viewer,window.canvas]);
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
