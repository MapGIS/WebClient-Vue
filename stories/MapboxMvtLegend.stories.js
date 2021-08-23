import MapgisMvtLegend from "../mapboxgl/src/components/UI/controls/legend/LegendMvt.vue";

export default {
  title: "二维/MVT-矢量瓦片图例",
  component: MapgisMvtLegend,
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
  components: { MapgisMvtLegend },
  data() {
    return {
      mvtStyle:
        "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/OSM全中国经纬度.json",
    };
  },
  methods: {
    changeEnable() {},
  },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[105.22,33.03]" :zoom="3" style="height:60vh">
      <mapgis-mvt-style-layer :mvtStyle="mvtStyle" /> 
      <mapgis-mvt-legend v-bind="$props" />
    </mapgis-web-map>`,
});

export const 合并 = Template.bind({});
合并.args = {
  outStyle: {
    position: "absolute",
    zIndex: 900,
    right: "5px",
    bottom: "10px",
    maxHeight: "300px",
    width: "220px",
  },
};
