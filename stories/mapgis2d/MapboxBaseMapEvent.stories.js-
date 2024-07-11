import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import "../style/action.css";

import { Style } from "@mapgis/webclient-es6-service";
const {
  ExtrudeStyle,
  PointStyle,
  FillStyle,
  TextStyle,
  MarkerStyle,
  FontStyle,
  Symbol,
} = Style;

// http://datav.aliyun.com/portal/school/atlas/area_selector#&lat=33.50475906922609&lng=104.32617187499999&zoom=4

export default {
  title: "二维/场景控制/场景/事件",
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
        sprite: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/vtiles/sprite`,
        glyphs: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf`,
      },
      china: {
        layerId: "geojson_china_layer",
        layerStyle: new ExtrudeStyle({
          // color: ["rgb", 0, 0, 128], // ["/", 820000, ["get", "adcode"]]
          color: [
            "interpolate",
            ["linear"],
            ["get", "adcode"],
            100000,
            "#f7fcf0",
            200000,
            "#e0f3db",
            300000,
            "#ccebc5",
            400000,
            "#a8ddb5",
            500000,
            "#7bccc4",
            600000,
            "#4eb3d3",
            700000,
            "#2b8cbe",
            800000,
            "#0868ac",
            900000,
            "#084081",
          ],
          opacity: 0.5,
          size: ["/", ["get", "adcode"], 2],
        }),

        highlightStyle: {
          extrude: new ExtrudeStyle({
            color: "rgba(101, 134, 236, 0.5)",
            opacity: 0.8,
          }),
        },
        data: `${window.domain}static/data/geojson/中华人民共和国.json`,
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
        data: `${window.domain}static/data/geojson/省会城市.geojson`,
        enablePopup: true,
        enableTips: false,
      },
      china_poi_text: {
        layerId: "geojson_china_poi_text_layer",
        layerStyle: new TextStyle({
          allowOverlap: true,
          // color: "rgba(101, 134, 236, 1.0)",
          color: "rgba(44, 247, 254, 0.75)",
          text: "{name}",
          haloColor: "#000000",
          haloSize: 1.5,
          xoffset: 2,
          yoffset: 0.25,
          font: new FontStyle({
            size: 16,
          }),
        }),
        highlightStyle: {
          type: "text",
          text: new TextStyle({
            color: "rgba(255, 0, 0, 1.0)",
          }),
        },
        data: `${window.domain}static/data/geojson/省会城市.geojson`,
        enablePopup: false,
        enableTips: false,
      },
      initMarker: false,
      china_poi_marker: {
        layerId: "geojson_china_poi_marker_layer",
        layerStyle: new MarkerStyle({
          symbol: new Symbol({
            size: 0.5,
            pattern: [
              "match",
              ["get", "name"],
              "西安",
              "poi-she",
              "北京",
              "poi-line",
              "广州",
              "poi-route",
              "长沙",
              "poi-zhuan",
              "poi-common",
            ],
          }),
        }),
        highlightStyle: {
          type: "marker",
          marker: new MarkerStyle({}),
        },
        data: `${window.domain}static/data/geojson/省会城市.geojson`,
        enablePopup: false,
        enableTips: false,
      },
    };
  },
  watch: {},
  methods: {
    handleMapLoad(payload) {
      const vm = this;
      const { map } = payload;
      window.map2d = map;
      const images = [
        "poi-common",
        "poi-line",
        "poi-route",
        "poi-she",
        "poi-zhuan",
      ];
      const promises = images.map((i) => {
        return new Promise((resolve) => {
          map.loadImage(
            `http://${window.webclient.staticIP}:8895/img/${i}.png`,
            (err, image) => {
              if (err) throw err;
              map.addImage(i, image);
              resolve();
            }
          );
        });
      });
      Promise.all(promises).then((res) => {
        vm.initMarker = true;
        /* map.addLayer({
          id: "china_poi_image",
          type: "symbol",
          source: {
            type: "geojson",
            data: `${window.domain}static/data/geojson/省会城市.geojson`,
          },
          layout: {
            "icon-image": [
              "match",
              ["get", "name"],
              "西安",
              "poi-she",
              "北京",
              "poi-line",
              "广州",
              "poi-route",
              "长沙",
              "poi-zhuan",
              "poi-common",
            ],
            "icon-offset": [0, 0],
            "icon-allow-overlap": false,
            "icon-size": 0.5,
          },
        }); */
      });
    },
  },
  template: `
  <mapgis-ui-borderbox11 style="width:95vw; height:95vh; background: #000;" title="科技风主题">
    <mapgis-web-map v-bind="$props" class="mapgis-tech-innermap" :mapStyle="mapStyle" @load="handleMapLoad">
      <mapgis-geojson-layer v-bind="china" />
      <mapgis-geojson-layer v-bind="china_poi" v-if="false"/>
      <mapgis-geojson-layer v-bind="china_poi_text" />
      <mapgis-geojson-layer v-bind="china_poi_marker" v-if="initMarker"/>
    </mapgis-web-map>
  </mapgis-ui-borderbox11>`,
});

export const 事件 = Template.bind({});
事件.args = {
  zoom: 2.8,
  center: [106, 30],
  crs: "EPSG:4326",
};
