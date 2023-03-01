import xml from "fast-xml-parser";
import MapgisOgcWfsLayer from "../../cesium/src/components/Layer/OGC/OGCWFSLayer.vue";

export default {
  title: "三维/图层/OGC/WFS",
  component: MapgisOgcWfsLayer,
  argTypes: {
    baseUrl: {
      description: "服务基地址",
      type: { name: "String", required: true },
      table: {
        type: { summary: "String" },
      },
      control: "text",
    },
    wfsVersion: {
      description: "wfs服务版本，可选1.0.0 1.1.0 2.0.0",
      type: { name: "String", dafault: "2.0.0" },
      table: {
        type: { summary: "2.0.0" },
      },
      control: {
        type: "select",
        options: ["1.0.0", "1.1.0", "2.0.0"],
      },
    },
    count: {
      description: "请求要素的条数,默认值1000,wfs2.0.0支持",
      type: { name: "Number", dafault: 1000 },
      table: {
        type: { summary: 1000 },
      },
      // control: "Number",
    },
    autoReset: {
      description: "自动跳转至图层范围",
      type: { name: "Object", required: false },
      table: {
        type: { summary: "true" },
      },
      control: "boolean",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisOgcWfsLayer },
  template: `<mapgis-web-scene style="height: 95vh" >
    <mapgis-3d-ogc-wfs-layer v-bind="$props" />
  </mapgis-web-scene>`,
  data() {
    return {};
  },
  methods: {},
});

export const OGCWFS = Template.bind({});
OGCWFS.args = {
  baseUrl: `http://192.168.82.89:8089/igs/rest/services/Map/Hubei4326/WFSServer`,
  wfsVersion: "2.0.0",
  // layerStyle: {
  //   visible: true,
  //   opacity: 1,
  //   zIndex: 10,
  // },
  renderer: {
    type: "simple",
    //符号类型
    symbol: {
      type: "polygon-3d",
      symbolLayers: {
        //选择填充类型
        type: "fill",
        //填充材料
        material: {
          color: "#72A84D",
        },
        //外边线样式
        outline: {
          color: "#727F8B",
          width: 2.0,
        },
        height: 1000,
        size: 20,
      },
    },
    label: "标签",
  },
  vueIndex: 1,
  autoReset: true,
  // options: {},
  count: 1000,
};
