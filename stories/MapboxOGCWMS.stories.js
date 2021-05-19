import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisOgcWmsLayer from "../mapboxgl/src/components/layer/ogc/OgcWmsLayer.js";

export default {
  title: "二维/OGC-WMS",
  component: MapgisOgcWmsLayer,
  argTypes: {
    layer: {},
    layerId: "igsLayer_layerId",
    sourceId: "igsLayer_sourceId",
    url:
      "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=2ddaabf906d4b5418aed0078e1657029",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisOgcWmsLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="7.5" style="height:60vh">
    <mapgis-ogc-wms-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const Common = Template.bind({});
Common.args = {
  layerId: "mapgis_ogc_wms",
  url: "http://develop.smaryun.com:6163/igs/rest/ogc/doc/北京市/WMSServer",
};

export const ReverseBbox = Template.bind({});
ReverseBbox.args = {
  layerId: "tdt_layerid",
  url:
    "http://219.142.81.85/arcgis/services/10wanZH/MapServer/WMSServer?service=WMS&request=GetMap&layers=0,1,2,3,5,7,9,11&styles=&format=image/png&transparent=true&version=1.3.0&height=512&width=512&crs=EPSG:4326&bbox={bbox}&reversebbox=true",
};
