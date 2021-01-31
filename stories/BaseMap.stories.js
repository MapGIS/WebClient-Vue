import ZondyWebMap from "../mapboxgl/src/components/map/GlMap.vue";

export default {
  title: "地图/基础地图-二维",
  component: ZondyWebMap,
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
  components: { ZondyWebMap },
  template: `<zondy-web-map v-bind="$props" >
    <zondy-raster-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
  </zondy-web-map>
  `
});

export const EmptyMap = Template.bind({});
EmptyMap.args = {
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
