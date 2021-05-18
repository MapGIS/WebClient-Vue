import MapgisWebGlobe from "../cesium/src/components/WebGlobe/WebGlobe.vue";
import MapgisOgcWmsLayer from "../cesium/src/components/Layer/OGC/OGCWMSLayer.vue";

export default {
  title: "三维/OGC-WMS",
  component: MapgisOgcWmsLayer,
  argTypes: {
    url:"http://localhost:6163/igs/rest/ogc/doc/武汉_专题图_4328_wms/WMSServer",
    layers: "武汉市",
    tilingScheme: "EPSG:4326",
    show: true
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebGlobe, MapgisOgcWmsLayer },
  template: `<mapgis-web-globe >
    <mapgis-3d-ogc-wms-layer v-bind="$props"/>
    <button @click="showMap">隐藏</button>
    <button @click="changeLayers">改变Layers</button>
  </mapgis-web-globe>`,
  methods:{
    showMap(){
      this.$props.show = !this.$props.show;
    },
    changeLayers(){
      if(this.$props.layers === "武汉市"){
        this.$props.layers = "武汉市,武汉市_地铁";
      }else {
        this.$props.layers === "武汉市";
      }
    }
  }
});

export const EmptyGlobe = Template.bind({});
EmptyGlobe.args = {
  url:"http://localhost:6163/igs/rest/ogc/doc/武汉_专题图_4328_wms/WMSServer",
  layers: "武汉市",
  tilingScheme: "EPSG:4326",
  show: true
};
