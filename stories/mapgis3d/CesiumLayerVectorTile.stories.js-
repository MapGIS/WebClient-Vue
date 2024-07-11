import MapgisVectorTileLayer from "../../cesium/src/components/Layer/VectorTile/VectorTileLayer.vue";

export default {
  title: "三维/数据图层/矢量/客户端矢量图层",
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
    `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrcs/vtiles/styles/中国行政区_style.json`,
  tilingScheme: "EPSG:3857"
};

export const 经纬度 = Template.bind({});
经纬度.args = {
  styleUrl:
    `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrcs/vtiles/styles/全球地化_style.json`,

  // `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrcs/vtiles/0/OSM全中国经纬度`,
  tilingScheme: "EPSG:4326"
};
