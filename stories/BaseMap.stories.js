import ZondyWebMap from "../mapboxgl/src/components/map/GlMap.vue";

export default {
  title: "地图/基础地图",
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
    mapZoom: 10,
    outerCenter: [114.3, 30.5],
    mapCrs: "EPSG:3857",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ZondyWebMap },
  template: '<zondy-web-map style="height:400px; width:100%" v-bind="$props" />',
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
  mapZoom: 10,
  outerCenter: [114.3, 30.5],
  mapCrs: "EPSG:3857",
};
