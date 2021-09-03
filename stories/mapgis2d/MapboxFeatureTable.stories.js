// import FeatureTable from "../mapboxgl/src/components/UI/FeatureTable";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";

export default {
  title: "二维/地图子组件/要素表格",
  component: FeatureTable,
  argTypes: {
    MapUrl:"http://localhost:6163/igs/rest/mrms/docs/wuhan_WFS_4326",
    layerId: "wuhan_WFS_4326",
    url: "http://localhost:6163/igs/rest/mrms/docs/wuhan_WFS_4326"
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { /* FeatureTable, */MapgisWebMap },
  template: '<mapgis-web-map ref="wmap" crs="EPSG:4326" :center="[(113.69534616+115.07406408)/2, (29.969811+31.36330098)/2]" :zoom="8" style="height:60vh">' +
      '<mapgis-igs-doc-layer v-bind="$props" />' +
      '<feature-table v-on:loaded = "load" v-bind="$props"></feature-table>' +
      '</mapgis-web-map>',
  mounted() {
    console.log("wmap",this.$refs.wmap)
  },
  methods:{
    load(table){
      this.table = table;
      // table.$_queryByLayer([0]);
      // table.$_queryByLayer([1]);
      table.$_queryByLayer([2]);
    }
  }
});

export const 要素表格 = Template.bind({});
要素表格.args = {
  MapUrl:"http://localhost:6163/igs/rest/mrms/docs/wuhan_WFS_4326",
  layerId: "wuhan_WFS_4326",
  url: "http://localhost:6163/igs/rest/mrms/docs/wuhan_WFS_4326"
};
