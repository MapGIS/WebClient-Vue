import MapgisMvtEditor from "../../mapboxgl/src/components/layer/edit/Edit";

export default {
  title: "二维/数据图层/矢量/MVT/编辑",
  component: MapgisMvtEditor,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMvtEditor },
  data() {
    return {
      layer: "",
      enableEditor: false,
      mvtStyle: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/vtiles/styles/街道-墨卡托.json`,
    };
  },
  methods: {
    handleMapLoad(e) {
      this.map = e.map;
    },
    handleChangeStyle(style) {
      const vm = this;
      window.setTimeout(() => {
        vm.enableEditor = true;
        vm.layer = "中国行政区";
        console.log("map laod", this.map.getStyle());
      }, 1000);
    },
    handleEditChange(event) {
      console.log("样式切换", event, this.map.getStyle());
    },
  },
  template: `<mapgis-web-map crs="EPSG:3857" :center="[105.22,33.03]" :zoom="2" style="height:95vh" @load="handleMapLoad">
      <mapgis-mvt-style-layer :mvtStyle="mvtStyle" @change-style="handleChangeStyle" />
      <mapgis-ui-card class="storybook-ui-card">
      <mapgis-mvt-editor :layerid="layer" @edit-change="handleEditChange"/>
      </mapgis-ui-card>
    </mapgis-web-map>`,
});

export const 编辑 = Template.bind({});
编辑.args = {};
