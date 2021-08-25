import MapgisMvtStyleLayer from "../../mapboxgl/src/components/layer/vectortile/MvtStyleLayer";

export default {
  title: "二维/MVT-矢量瓦片样式",
  component: MapgisMvtStyleLayer,
  argTypes: {
    mvtStyle: "",
    mode: "add",
    before: undefined,
  },
};

const TemplateMerge = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMvtStyleLayer },
  data() {
    return {
      enable: false,
      mapStyle: {
        version: 8,
        name: "街道地图",
        metadata: {},
        sources: {
          IGServer: {
            type: "vector",
            tiles: [
              "http://develop.smaryun.com:6163/igs/rest/mrms/tile/OSM全中国/{z}/{y}/{x}?type=cpbf&returnError=false",
            ],
            minZoom: 0,
            maxZoom: 24,
          },
          china: {
            type: "vector",
            tiles: [
              "http://develop.smaryun.com:6163/igs/rest/mrms/tile/中国行政区/{z}/{y}/{x}?type=cpbf",
            ],
            minZoom: 0,
            maxZoom: 10,
          },
        },
        sprite: "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/sprite",
        glyphs:
          "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf",
        layers: [
          {
            id: "背景底色",
            type: "background",
            source: "IGServer",
            "source-layer": "背景底色",
            layout: {
              visibility: "visible",
            },
            paint: {
              "background-color": "#000000",
              "background-opacity": {
                stops: [
                  [0, 0],
                  [10, 1],
                  [20, 1],
                ],
              },
            },
            minZoom: 0,
            maxZoom: 24,
            key: "背景底色",
            description: "图层信息",
            info: "图层信息",
          },
          {
            id: "省级行政区",
            type: "fill",
            source: "IGServer",
            "source-layer": "省级行政区",
            layout: {
              visibility: "visible",
            },
            paint: {
              "fill-color": "#FF0000",
            },
            minZoom: 0,
            maxZoom: 24,
            key: "省级行政区",
            description: "省级行政区",
            info: "省级行政区",
          },
          {
            id: "中国行政区",
            type: "fill",
            source: "china",
            "source-layer": "中国行政区",
            paint: {
              "fill-color": "#00FF00",
              "fill-outline-color": "rgba(255, 255, 255, 1)",
            },
          },
        ],
        id: "街道地图",
      },
    };
  },
  methods: {
    changeEnable() {
      this.enable = !this.enable;
    }
  },
  template: `<mapgis-web-map crs="EPSG:3857" :center="[105.22,33.03]" :zoom="3" style="height:60vh" :mapStyle="mapStyle">
        <mapgis-ui-button type="primary" @click="changeEnable" style="position:absolute;zIndex:9999;left:10px;top:10px;"> 合并样式 </mapgis-ui-button>
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" before="省级行政区"/>
        <mapgis-mvt-style-layer v-bind="$props" v-if="enable"/>
    </mapgis-web-map>`,
});

export const 合并 = TemplateMerge.bind({});
合并.args = {
  mvtStyle:
    "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/街道-墨卡托.json",
  mode: "merge",
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMvtStyleLayer },
  methods: {},
  template: `<mapgis-web-map crs="EPSG:3857" :center="[105.22,33.03]" :zoom="3" style="height:60vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=img_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-mvt-style-layer v-bind="$props" />
    </mapgis-web-map>`,
});

export const 追加 = Template.bind({});
追加.args = {
  mvtStyle:
    "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/街道-墨卡托.json",
  mode: "add",
};

export const 覆盖 = Template.bind({});
覆盖.args = {
  mvtStyle:
    "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/街道-墨卡托.json",
  mode: "set",
};

export const MvtJSON对象 = Template.bind({});
MvtJSON对象.args = {
  mvtStyle: {
    version: 8,
    name: "街道地图",
    metadata: {},
    sources: {
      china: {
        type: "vector",
        tiles: [
          "http://develop.smaryun.com:6163/igs/rest/mrms/tile/中国行政区/{z}/{y}/{x}?type=cpbf",
        ],
        minZoom: 0,
        maxZoom: 10,
      },
    },
    sprite: "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/sprite",
    glyphs:
      "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/fonts/{fontstack}/{range}.pbf",
    layers: [
      {
        id: "中国行政区",
        type: "fill",
        source: "china",
        "source-layer": "中国行政区",
        paint: {
          "fill-color": "#EFE9E1",
          "fill-outline-color": "rgba(255, 255, 255, 1)",
        },
      },
    ],
    id: "街道地图",
  },
  mode: "add",
};
