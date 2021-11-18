import GeoJsonLayer from "../../cesium/src/components/Layer/GeoJSON/GeoJsonLayer";

import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  title: "三维/图层/GeoJSON",
  component: GeoJsonLayer,
  argTypes: {
    baseUrl: "",
    enablePopup: true,
    enableTips: false,
  },
  layerStyle: {},
  highlightStyle: {
    point: new PointStyle(),
    line: new LineStyle(),
    polygon: new FillStyle(),
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {};
  },
  components: {},
  template: `<mapgis-web-scene style="height: 95vh">
    <mapgis-3d-raster-layer url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-raster-layer url="http://t1.tianditu.com/DataServer?T=cia_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-3d-geojson-layer v-bind="$props"/>
  </mapgis-web-scene>`,
});

export const 点 = Template.bind({});
点.args = {
  baseUrl: `http://${window.webclient.ip}/static/data/geojson/省会城市.geojson`,
  enablePopup: true,
  enableTips: false,
  layerStyle: new PointStyle({
    radius: 25000,
    color: "#ffff00",
    outlineColor: "#ff0000",
    outlineWidth: 2.5,
  }),
  highlightStyle: {
    point: new PointStyle({
      radius: 45000,
      color: "#ff0000",
      outlineColor: "#ffffff",
      outlineWidth: 2.5,
    }),
    line: new LineStyle({
      width: 6,
      color: "#000000",
      shadow: new Shadow({ blur: 6, color: "#ff0000" }),
      outlineColor: "#ff0000",
      outlineWidth: 8,
    }),
    polygon: new FillStyle({ color: "#ff0000", opacity: 0.7 }),
  },
};

export const 线 = Template.bind({});
线.args = {
  baseUrl: `http://${window.webclient.ip}/static/data/geojson/长江黄河.geojson`,
  enablePopup: true,
  enableTips: false,
  layerStyle: new LineStyle({
    width: 6,
    color: "#0000ff",
  }),
  highlightStyle: {
    point: new PointStyle({
      radius: 45000,
      color: "#ff0000",
      outlineColor: "#ffffff",
      outlineWidth: 2.5,
    }),
    line: new LineStyle({
      width: 6,
      color: "#000000",
      shadow: new Shadow({ blur: 6, color: "#ff0000" }),
      outlineColor: "#ff0000",
      outlineWidth: 8,
    }),
    polygon: new FillStyle({ color: "#ff0000", opacity: 0.7 }),
  },
};

export const 区 = Template.bind({});
区.args = {
  baseUrl: `http://${window.webclient.ip}/static/data/geojson/省级行政区.geojson`,
  enablePopup: true,
  enableTips: true,
  layerStyle: new FillStyle({
    color: "#1890ff",
    outlineColor: "#ff0000",
    outlineWidth: 2.5,
    opacity: 0.25,
  }),
  highlightStyle: {
    point: new PointStyle({
      radius: 45000,
      color: "#ff0000",
      outlineColor: "#ffffff",
      outlineWidth: 2.5,
    }),
    line: new LineStyle({
      width: 6,
      color: "#000000",
      shadow: new Shadow({ blur: 6, color: "#ff0000" }),
      outlineColor: "#ff0000",
      outlineWidth: 8,
    }),
    polygon: new FillStyle({ color: "#ff0000", opacity: 0.7 }),
  },
};
