import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisGeojsonLayer from "../../mapboxgl/src/components/layer/GeojsonLayer";

export default {
  title: "二维/可视化/GeoJSON+popup",
  component: MapgisGeojsonLayer,
  argTypes: {
    layer: {},
    layerId: "geojsonLayer",
    sourceId: "geojsonSource",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisGeojsonLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[114.3, 30.5]" :zoom="6" style="height:95vh">
    <mapgis-geojson-layer v-bind="$props" />
  </mapgis-web-map>`,
});

export const Fill = Template.bind({});
Fill.args = {
  layer: {
    type: "fill",
    source: "geojson_source_id", //必须和上面的geojsonCollections一致
    filter: ["==", "$type", "Polygon"], //关键点：$type是固定语法，类型是Point、LineString、Polygon
    layout: {
      visibility: "visible", //是否可见  visible / none
    },
    paint: {
      "fill-antialias": true, //抗锯齿，true表示针对边界缝隙进行填充
      "fill-color": "#FFFFFF", //颜色
      "fill-opacity": 0.8, //透明度
      "fill-outline-color": "#52B883", //边线颜色，没错,确实没有边线宽度这个选项
      //"fill-pattern":"picture_name", //线的拉伸图片类型，一定要与对应的样式库的图片名字一一对应
      //"fill-translate": [0,0] //表示显示位置基于原始位置上,再按照屏幕坐标进行偏移,这个应该绝大部分都用不上
    },
  },
  layerId: "geojsonLayer",
  data: "http://develop.smaryun.com/static/data/geojson/china.geojson",
  sourceId: "geojson_source_id",
  enablePopup: true,
  enableTips: true,
  popupOptions: {
    title: "name",
    fields: ["adcode", "行政区代码", "mpArea", "mpPerimeter", "GDP_2011"],
  },
  tipsOptions: {
    title: "name",
    fields: ["行政区代码", "adcode", "mpArea"],
  },
};
