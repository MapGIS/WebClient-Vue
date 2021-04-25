import MapgisCompare from "../mapboxgl/src/components/UI/controls/compare/CompareControl.vue";
import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmtsLayer from "../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
  title: "二维/交互-卷帘",
  component: MapgisCompare,
};

var map = [];
const Vertical = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisCompare, MapgisWebMap, MapgisOgcWmtsLayer },
  methods: {},
  template: `
        <mapgis-compare :orientation="orientation">
            <mapgis-web-map slot="beforeMap"
                v-bind="{ ...beforeMapOptions }"
            >
                <mapgis-ogc-wmts-layer
                    v-bind="{ ...beforeLayerOptions }"
                >
                </mapgis-ogc-wmts-layer>
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

export const VerticalMode = Vertical.bind({});
VerticalMode.args = {
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
};

export const HorizontalMode = Vertical.bind({});
HorizontalMode.args = {
  ...VerticalMode.args,
  orientation: "horizontal",
};
