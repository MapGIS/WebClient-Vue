import MapgisCustomScale from "../../mapboxgl/src/components/UI/controls/scale/CustomScale.vue";

export default {
  title: "二维/交互-自定义比例尺",
  component: MapgisCustomScale,
  argTypes: {
    outStyle: {
      position: "absolute",
      zIndex: 900,
      right: "5px",
      bottom: "10px",
      maxHeight: "300px",
      width: "220px",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisCustomScale },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 7.5,
        center: [116.39, 40.2],
      },
    };
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:60vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-custom-scale v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 比例尺 = Template.bind({});
比例尺.args = {
  outStyle: {
    position: "absolute",
    zIndex: 900,
    left: "10px",
    bottom: "10px",
    maxHeight: "300px",
    width: "220px",
  },
};
