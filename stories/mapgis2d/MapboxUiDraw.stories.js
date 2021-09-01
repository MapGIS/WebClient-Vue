import MapgisDraw from "../../mapboxgl/src/components/UI/controls/draw/BaseDraw.vue";

export default {
  title: "二维/交互/绘制",
  component: MapgisDraw,
  argTypes: {
    enableControl: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisDraw },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 5,
        center: [107.19, 26.85],
      },
    };
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:60vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-draw  v-bind="$props" />
    </mapgis-web-map>
    `,
});

export const 绘制 = Template.bind({});
绘制.args = {
  enableControl: true,
};
