import MapgisMvtStyleLayer from "../mapboxgl/src/components/layer/vectortile/MvtStyleLayer";

export default {
  title: "二维/图层-矢量瓦片样式",
  component: MapgisMvtStyleLayer,
  argTypes: {
    mvtStyle: "",
    mode: "add",
    before: undefined,
  },
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

export const Add = Template.bind({});
Add.args = {
  mvtStyle:
    "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/街道-墨卡托.json",
  mode: "add",
};

export const Set = Template.bind({});
Set.args = {
  mvtStyle:
    "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/街道-墨卡托.json",
  mode: "set",
};

export const MvtObject = Template.bind({});
MvtObject.args = {
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
