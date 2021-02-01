import MapgisWebMap from "../mapboxgl/src/components/map/GlMap.vue";
import MapgisGeojsonLayer from "../mapboxgl/src/components/layer/GeojsonLayer.js";

export default {
  title: "二维/图层-GeoJSON",
  component: MapgisGeojsonLayer,
  argTypes: {
    layer: {},
    layerId: "geojson_layer_id",
    source: {},
    sourceId: "geojson_source_id",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap, MapgisGeojsonLayer },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[114.3, 30.5]" :zoom="10">
    <mapgis-geojson-layer v-bind="$props" />
  </mapgis-web-map>`,
});

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [114.28939819335936, 30.594183452544694],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [114.34776306152344, 30.623436511269382],
          [114.32510375976562, 30.63909360759635],
          [114.30673599243164, 30.634958017061198],
          [114.29180145263672, 30.629640569460406],
          [114.28339004516601, 30.627424880048103],
          [114.26467895507812, 30.620777507443577],
          [114.24613952636719, 30.616050209185243],
          [114.23566818237304, 30.61073172273802],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [114.33454513549805, 30.479893814659587],
            [114.38587188720703, 30.479893814659587],
            [114.38587188720703, 30.504596494227247],
            [114.33454513549805, 30.504596494227247],
            [114.33454513549805, 30.479893814659587],
          ],
        ],
      },
    },
  ],
};

export const Circle = Template.bind({});
Circle.args = {
  layer: {
    type: "circle",
    source: "geojson_source_id", //必须和上面的geojsonCollections一致
    filter: ["==", "$type", "Point"], //关键点：$type是固定语法，类型是Point、LineString、Polygon
    paint: {
      "circle-radius": 15, //半径
      "circle-color": "#FFFFFF", //颜色
      "circle-opacity": 0.8, //透明度
      "circle-stroke-width": 5, //轮廓线宽度
      "circle-stroke-color": "#52B883", //轮廓线颜色
      "circle-stroke-opacity": 0.7, //轮廓线透明度
      //"circle-translate": [0,0] //表示显示位置基于原始位置上,再按照屏幕坐标进行偏移,这个应该绝大部分都用不上
    },
  },
  layerId: "geojson_layer_id",
  source: {
    type: "geojson",
    data: geojson,
  },
  sourceId: "geojson_source_id",
};

export const Line = Template.bind({});
Line.args = {
  layer: {
    type: "line",
    source: "geojson_source_id", //必须和上面的geojson_source_id一致
    filter: ["==", "$type", "LineString"], //关键点：$type是固定语法，类型是Point、LineString、Polygon
    layout: {
      "line-cap": "square", //butt 尖头，round 圆头，square平头
      "line-join": "round", //bevel平拐，round 圆拐，miter棱拐
      "line-miter-limit": 2, //棱拐的限制，一般用不上
      "line-round-limit": 1.05, //圆拐的限制，一般用不上
      visibility: "visible", //是否可见  visible / none
    },
    paint: {
      "line-width": 10, //宽度
      "line-color": "#52B883", //颜色
      "line-opacity": 1.0, //透明度
      "line-gap-width": 3, //线的沟宽，如果有一条线会变成2条线，中间有条沟
      "line-offset": 0, //尽量少用，如果这个值相对大的话在拐角处很容易变形变胖
      "line-dasharray": [5, 2], //实线、虚线的组合，可以表示铁路线等
      "line-blur": 5, //模糊度，和宽度配合使用，当宽度20，模糊度10时，出现边线模糊的效果，该值要小于线宽度
      // "line-pattern": "picture_name", //线的拉伸图片类型，一定要与对应的样式库的图片名字一一对应
      //"line-translate": [0,0] //表示显示位置基于原始位置上,再按照屏幕坐标进行偏移,这个应该绝大部分都用不上
    },
  },
  layerId: "geojson_layer_id",
  source: {
    type: "geojson",
    data: geojson,
  },
  sourceId: "geojson_source_id",
};

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
  layerId: "geojson_layer_id",
  source: {
    type: "geojson",
    data: geojson,
  },
  sourceId: "geojson_source_id",
};