import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import "../style/action.css";

import { Style } from "@mapgis/webclient-es6-service";
const { SymbolStyle, PointStyle, FillStyle, TextStyle, FontStyle } = Style;

// http://datav.aliyun.com/portal/school/atlas/area_selector#&lat=33.50475906922609&lng=104.32617187499999&zoom=4

export default {
  title: "二维/地图/事件",
  component: MapgisWebMap,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap },
  parameters: {
    docs: {
      page: null,
    },
  },
  data() {
    return {
      mapStyle: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "背景",
            type: "background",
            paint: {
              "background-color": "rgba(0, 0, 0, 0.5)",
            },
          },
        ],
        sprite: `http://${window.webclient.ip}:6163/igs/rest/mrms/vtiles/sprite`,
        glyphs: `http://${window.webclient.ip}:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf`,
      },
      china: {
        layerId: "geojson_china_layer",
        layerStyle: new FillStyle({
          color: "rgba(101, 134, 236, 0.5)",
          opacity: 0.8,
          outlineColor: "rgba(44, 247, 254, 0.75)",
        }),

        highlightStyle: {
          polygon: new FillStyle({
            width: 8,
            color: "#6586ec",
            opacity: 0.8,
            outlineColor: "#2cf7fe",
          }),
        },
        data: `http://${window.webclient.ip}/static/data/geojson/中华人民共和国.json`,
        enablePopup: true,
        enableTips: false,
      },
      china_poi: {
        layerId: "geojson_china_poi_layer",
        layerStyle: new PointStyle({
          color: "rgba(101, 134, 236, 0.5)",
          opacity: 0.8,
          outlineColor: "rgba(44, 247, 254, 0.75)",
          outlineWidth: 2,
        }),
        highlightStyle: {
          point: new PointStyle({
            width: 8,
            color: "#6586ec",
            opacity: 0.8,
            outlineWidth: 8,
            outlineColor: "#2cf7fe",
          }),
        },
        data: `http://${window.webclient.ip}/static/data/geojson/省会城市.geojson`,
        enablePopup: true,
        enableTips: false,
      },
      china_poi_text: {
        layerId: "geojson_china_poi_text_layer",
        layerStyle: new TextStyle({
          color: "rgba(101, 134, 236, 0.5)",
          text: "{name}",
          haloColor: "rgba(44, 247, 254, 0.75)",
          haloSize: 2,
          font: new FontStyle({
            size: 16,
          }),
        }),
        highlightStyle: {
          type: "text",
          text: "{name}",
          text: new TextStyle({
            color: "rgba(255, 0, 0, 1.0)",
          }),
        },
        data: `http://${window.webclient.ip}/static/data/geojson/省会城市.geojson`,
        enablePopup: false,
        enableTips: false,
      },
    };
  },
  watch: {},
  methods: {
    handleMapLoad(payload) {
      const { map } = payload;
      window.map2d = map;
    },
  },
  template: `
  <mapgis-ui-borderbox11 style="width:95vw; height:95vh; background: #000;" title="科技风主题">
    <mapgis-web-map v-bind="$props" class="mapgis-tech-innermap" :mapStyle="mapStyle" @load="handleMapLoad">
      <mapgis-geojson-layer v-bind="china" />
      <mapgis-geojson-layer v-bind="china_poi" />
      <mapgis-geojson-layer v-bind="china_poi_text" />
    </mapgis-web-map>
  </mapgis-ui-borderbox11>`,
});

export const 事件 = Template.bind({});
事件.args = {
  zoom: 2.8,
  center: [106, 30],
  crs: "EPSG:4326",
};
