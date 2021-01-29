import ZondyWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import ZondyOgcWmsLayer from "../mapboxgl/src/components/layer/ogc/OgcWmsLayer.js";

export default {
  title: "OGC/WMS",
  component: ZondyOgcWmsLayer,
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
  components: { ZondyWebMap, ZondyOgcWmsLayer },
  template: `<zondy-web-map crs="EPSG:4326" :center="[116.39, 40.20]" :zoom="7.5">
    <zondy-ogc-wms-layer v-bind="$props" />
  </zondy-web-map>`,
});

export const Common = Template.bind({});
Common.args = {
  layerId: "mapgis_ogc_wms",
  url:
    "http://develop.smaryun.com:6163/igs/rest/ogc/doc/北京市/WMSServer?service=WMS&request=GetMap&layers=北京市,绿地_1&styles=&format=image/jpeg&transparent=false&version=1.1.1&height=512&width=512&srs=EPSG:4326&bbox={bbox}",
};

export const ReverseBbox = Template.bind({});
ReverseBbox.args = {
  layerId: "tdt_layerid",
  url:
    "http://219.142.81.85/arcgis/services/10wanZH/MapServer/WMSServer?service=WMS&request=GetMap&layers=0,1,2,3,5,7,9,11&styles=&format=image/png&transparent=true&version=1.3.0&height=512&width=512&crs=EPSG:4326&bbox={bbox}&reversebbox=true",
};
