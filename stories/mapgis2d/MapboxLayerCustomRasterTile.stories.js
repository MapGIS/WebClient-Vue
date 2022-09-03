import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisCustomRastertileLayer from "../../mapboxgl/src/components/layer/customtile/CustomRastertileLayer.vue";

export default {
  title: "二维/图层/自定义栅格图层",
  component: MapgisCustomRastertileLayer,
  argTypes: {
    layerId: {
      description: "待添加的图层的id，不能与现有的图层冲突",
      type: { name: "String", required: true },
      table: {
        type: { summary: "String" },
        defaultValue: { summary: "必传" },
      },
      control: "text",
    },
    layerType: {
      description: "待添加图层类型",
      type: { name: "String", required: true },
      table: {
        type: { summary: "String" },
        defaultValue: { summary: "必传" },
      },
      control: "text",
    },
    options: {
      description: "额外参数",
      type: { name: "Object", required: false },
      table: {
        type: { summary: "Object" },
      },
      control: "text",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap },
  data() {
    return {
      enable: true,
    };
  },
  methods: {
    handleDestory() {
      this.enable = false;
    },
  },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[110, 30]" :zoom="3" style="height:95vh">
    <mapgis-custom-rastertile-layer v-bind="$props" v-if="enable" />
    <mapgis-ui-button @click="handleDestory">销毁</mapgis-ui-button>
  </mapgis-web-map>`,
});

export const 高德注记图层 = Template.bind({});
高德注记图层.args = {
  layerId: "gaode_normal_map",
  layerType: "GaoDe.Normal.Map",
};

export const 高德无注记图层 = Template.bind({});
高德无注记图层.args = {
  layerId: "gaode_normal_map",
  layerType: "GaoDe.Normal_NoTag.Map",
};

export const 高德遥感图层 = Template.bind({});
高德遥感图层.args = {
  layerId: "gaode_normal_map",
  layerType: "GaoDe.Satellite.Map",
};

export const 百度矢量图层 = Template.bind({});
百度矢量图层.args = {
  layerId: "baidu_normal_map",
  layerType: "Baidu.Normal.Map",
};

export const 自定义图层 = Template.bind({});
自定义图层.args = {
  layerId: "custom_wmts_map",
  layerType: "Custom.WMTS.Map",
  options: {
    url: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    minzoom: 0,
    maxzoom: 20,
  },
};
