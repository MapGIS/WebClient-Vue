import MapboxCompare from "../mapboxgl/src/components/UI/controls/compare/compare.vue";

export default {
  title: "二维/交互-卷帘",
  component: MapboxCompare,
};

const Template = (args) => ({
  components: { MapboxCompare },
  template: `<mapbox-compare></mapbox-compare>`
});

export const compare = Template.bind({});
compare.args = {};
