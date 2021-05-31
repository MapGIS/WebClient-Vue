import MapgisVectorTileLayer from "../cesium/src/components/Layer/VectorTile/VectorTileLayer.vue";

export default {
  title: "三维/图层-矢量瓦片",
  component: MapgisVectorTileLayer,
  argTypes: {
    styleUrl: {},
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisVectorTileLayer },
  template: `<mapgis-web-scene  >
    <mapgis-3d-vectortile-layer v-bind="$props" />
  </mapgis-web-scene>`,
});

export const VectorTile = Template.bind({});
VectorTile.args = {
  styleUrl:
    "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/蓝色-墨卡托.json",
};
