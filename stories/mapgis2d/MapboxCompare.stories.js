import MapgisCompare from "../../mapboxgl/src/components/UI/controls/compare/CompareControl.vue";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmtsLayer from "../../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
  title: "二维/交互/卷帘",
  component: MapgisCompare,
};

export const Compare = (args, { argTypes }) => ({
//   props: Object.keys(argTypes),
  components: { MapgisCompare, MapgisWebMap, MapgisOgcWmtsLayer },
  data (){
      return {
        orientation: "vertical",
        beforeMapOptions: {
          mapStyle: {
            version: 8,
            sources: {},
            layers: [],
          },
          zoom: 2,
          center: [116.39, 40.2],
          crs: "EPSG:4326",
        },
        beforeLayerOptions: {
          layer: {},
          layerId: "ogcwmts_layerId",
          sourceId: "ogcwmts_sourceId",
          url:
            "http://t0.tianditu.com/DataServer?T=ter_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
        },
        afterMapOptions: {
          mapStyle: {
            version: 8,
            sources: {},
            layers: [],
          },
          zoom: 2,
          center: [116.39, 40.2],
          crs: "EPSG:4326",
        },
        afterLayerOptions: {
          layer: {},
          layerId: "ogcwmts_layerId",
          sourceId: "ogcwmts_sourceId",
          url:
            "http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
        },
      }
  },
  methods: {
    handleVertical() {
        this.orientation = "vertical";
    },
    handleHorizontal() {
        this.orientation = "horizontal";
    }
  },
  template: `
        <mapgis-compare :orientation="orientation" style="height:60vh">
            <mapgis-web-map slot="beforeMap"
                v-bind="{ ...beforeMapOptions }"
            >
                <mapgis-ogc-wmts-layer
                    v-bind="{ ...beforeLayerOptions }"
                >
                </mapgis-ogc-wmts-layer>
                <div style="display:inline-flex;position:absolute;top:20px;left:20px;z-index:9999;">
                    <div style="padding:6px 16px;background:#fff;border:1px dashed #666;font-size:20px;line-height:20px;text-align:center;cursor:pointer;" @click="handleVertical">垂直</div>
                    <div style="padding:6px 16px;background:#fff;border:1px dashed #666;font-size:20px;line-height:20px;text-align:center;cursor:pointer;" @click="handleHorizontal">水平</div>
                </div>
            </mapgis-web-map>
            <mapgis-web-map slot="afterMap"
                v-bind="{ ...afterMapOptions }"
            >
                <mapgis-ogc-wmts-layer
                    v-bind="{ ...afterLayerOptions }"
                >
                </mapgis-ogc-wmts-layer>
            </mapgis-web-map>
        </mapgis-compare>
        `,
});
