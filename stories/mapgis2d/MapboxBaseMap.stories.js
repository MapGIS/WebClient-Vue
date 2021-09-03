import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisWebMapMd from "../mapboxgl/docs/guide/draw.md";

export default {
  title: "二维/地图/地图对象",
  component: MapgisWebMap,
  argTypes: {
    mapStyle: {
      version: 8,
      sources: {},
      layers: [
        {
          id: "背景",
          type: "background",
          paint: {
            "background-color": "rgba(100, 100, 100, 0.05)",
          },
        },
      ],
    },
    zoom: 10,
    center: [114.3, 30.5],
    crs: "EPSG:4326",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap },
  parameters: {
    docs: {
      page: null,
    },
  },
  template: `<mapgis-web-map v-bind="$props" style="height:100vh">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
  </mapgis-web-map>
  `,
});

export const 地图 = Template.bind({});
地图.args = {
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
  },
  zoom: 3,
  center: [114.3, 30.5],
  crs: "EPSG:4326",
};

地图.parameters = {
  docs: {
    description: {
      component: MapgisWebMapMd,
    },
  },
};
