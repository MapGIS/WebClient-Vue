import ZondyWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import ZondyOgcWmtsLayer from "../mapboxgl/src/components/layer/ogc/OgcWmtsLayer.js";

export default {
  title: "OGC/WMTS",
  component: ZondyOgcWmtsLayer,
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
  components: { ZondyWebMap, ZondyOgcWmtsLayer },
  template: `<zondy-web-map crs="EPSG:4326">
    <zondy-ogc-wmts-layer v-bind="$props" />
  </zondy-web-map>`,
});

export const Image = Template.bind({});
Image.args = {
  layerId: "tdt",
  url:
    "http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=2ddaabf906d4b5418aed0078e1657029",
};

export const Vector = Template.bind({});
Vector.args = {
  layer: {},
  layerId: "tdt_layerid",
  sourceId: "tdt_sourceid",
  url:
    "http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=2ddaabf906d4b5418aed0078e1657029",
};
