import MapgisVectorTileLayer from "../../cesium/src/components/Layer/VectorTile/VectorTileLayer.vue";

export default {
  title: "三维/图层/矢量瓦片",
  component: MapgisVectorTileLayer,
  argTypes: {
    styleUrl: {},
    tilingScheme: "EPSG:4326"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisVectorTileLayer },
  template: `<mapgis-web-scene style="height:95vh" >
    <mapgis-3d-vectortile-layer v-bind="$props" />
  </mapgis-web-scene>`,
});

export const 墨卡托 = Template.bind({});
墨卡托.args = {
  styleUrl:
      `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/vtiles/styles/蓝色-墨卡托.json`,
  tilingScheme: "EPSG:3857"
};

export const 经纬度 = Template.bind({});
经纬度.args = {
  styleUrl:
      `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/vtiles/styles/OSM全中国经纬度.json`,
  tilingScheme: "EPSG:4326"
};
