import MapgisMvtLegend from "../../mapboxgl/src/components/UI/controls/legend/LegendMvt.vue";

export default {
  title: "二维/数据图层/矢量/MVT/图例",
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
      mvtStyle: `${window.domain}/${window.styles}/街道-墨卡托.json`,
    };
  },
  methods: {
    changeEnable() {},
  },
  template: `<mapgis-web-map crs="EPSG:3857" :center="[105.22,33.03]" :zoom="3" style="height:95vh">
      <mapgis-mvt-style-layer :mvtStyle="mvtStyle" /> 
      <mapgis-mvt-legend v-bind="$props" />
    </mapgis-web-map>`,
});

export const 图例 = Template.bind({});
图例.args = {
  outStyle: {
    position: "absolute",
    zIndex: 900,
    right: "5px",
    bottom: "10px",
    maxHeight: "300px",
    width: "220px",
  },
};
