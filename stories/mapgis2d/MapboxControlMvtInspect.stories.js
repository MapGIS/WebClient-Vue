import MapgisInspect from "../../mapboxgl/src/components/UI/controls/inspect/Inspect.vue";

export default {
  title: "二维/地图子组件/查询",
  component: MapgisInspect,
  argTypes: {
    mode: "single",
  },
};

const TemplateMerge = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisInspect },
  data() {
    return {
      mvtStyle:
          `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/vtiles/styles/街道-墨卡托.json`,
    };
  },
  methods: {
    changeEnable() {},
  },
  template: `<mapgis-web-map :mapStyle="mvtStyle" crs="EPSG:3857" :center="[105.22,33.03]" :zoom="3" style="height:60vh" >
      <mapgis-inspect :mode="mode"/>
    </mapgis-web-map>`,
});

export const 查询 = TemplateMerge.bind({});
查询.args = {
  mode: "single",
};
