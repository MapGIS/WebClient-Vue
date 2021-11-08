import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import MapgisGeojsonLayer from "../../mapboxgl/src/components/layer/GeojsonLayer";

export default {
  title: "二维/图层/GeoJSON内置popup",
  component: MapgisGeojsonLayer,
  argTypes: {
    data: {
      description:'GeoJSON 对象或者 GeoJSON 数据的 url。<br/>' +
          '详见[GeoJSONSource使用参考](https://docs.mapbox.com/mapbox-gl-js/api/#geojsonsource)',
      type: { name: 'Object | String', required: true },
      table:{
        type: { summary: 'Object | String' },
        defaultValue: { summary: '必传' },
      },
      control:'object'
    },
    enablePopup:{
      description:'控制是否开启 popup 弹窗',
      type: { name: 'Boolean', required: false },
      defaultValue: false,
      table:{
        type: { summary: 'Boolean' },
        defaultValue: { summary: 'false' },
      },
      control:'boolean'
    } ,
    enableTips:{
      description:'控制是否开启 tooltip 弹窗',
      type: { name: 'Boolean', required: false },
      defaultValue: false,
      table:{
        type: { summary: 'Boolean' },
        defaultValue: { summary: 'false' },
      },
      control:'boolean'
    } ,
    popupOptions: {
      description:'popup 弹窗时的配置参数,popupOptions 对象中 title 指弹窗的标题，展示 geojson 数据中的某一个字段属性，fields 展示列表，由传参者决定展示哪些字段值',
      type: { name: 'Object', required: false },
      table:{
        type: {
          summary: 'Object',
          detail: '示例:\n' +
              'popupOptions: {\n' +
              '  title: "name",\n' +
              '  fields: ["acroutes", "adcode"]\n' +
              '}'
        },
        // defaultValue: { summary: '' },
      },
      control:'object'
    },
    tipsOptions: {
      description:'tooltip 弹窗时的配置参数,tooltip 对象中 title 指弹窗的标题，展示 geojson 数据中的某一个字段属性，fields 展示列表，由传参者决定展示哪些字段值',
      type: { name: 'Object', required: false },
      table:{
        type: {
          summary: 'Object',
          detail: '示例:\n' +
              'tipsOptions: {\n' +
              '  title: "name",\n' +
              '  fields: ["acroutes", "adcode"]\n' +
              '}'
        },
        // defaultValue: { summary: '' },
      },
      control:'object'
    },
    layer: {
      description:'[layer使用参考](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers)',
      type: { name: 'Object | String', required: true },
      table:{
        type: { summary: 'Object | String' },
        defaultValue: { summary: '必传' },
      },
      control:'object'
    },
    layerId:  {
      description: '待添加的图层的id，不能与现有的图层冲突',
      type: { name: 'String', required: true },
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: '必传' },
      },
      control:'text'
    },
    sourceId: {
      description: '待添加的数据源的id，不能与现有的数据源冲突',
      type: { name: 'String', required: true },
      table:{
        type: { summary: 'String' },
        defaultValue: { summary: '必传' },
      },
      control:'text'
    },
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
  data: `http://${window.webclient.ip}/static/data/geojson/china.geojson`,
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
