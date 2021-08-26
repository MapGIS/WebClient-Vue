import MapgisMvtEditor from "../../mapboxgl/src/components/layer/edit/Edit";

export default {
  title: "二维/MVT-编辑样式",
  component: MapgisMvtEditor,
  argTypes: {
    outStyle: {
      position: "absolute",
      zIndex: 900,
      top: "10px",
      left: "10px",
      height: "300px",
      width: "280px",
    },
    visible: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMvtEditor },
  data() {
    return {
      layerid: "",
      enableEditor: false,
      mvtStyle:
        "http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/街道-墨卡托.json",
    };
  },
  methods: {
    handleChangeStyle(style) {
      const vm = this;
      window.setTimeout(() => {
        vm.enableEditor = true;
        vm.layerid = "省级行政区";
      }, 1000);
    },
  },
  template: `<mapgis-web-map crs="EPSG:3857" :center="[105.22,33.03]" :zoom="2" style="height:60vh">
      <mapgis-mvt-style-layer :mvtStyle="mvtStyle" @change-style="handleChangeStyle" />
      <mapgis-mvt-editor :outStyle="outStyle" :layerid="layerid" :visible="enableEditor"/>
    </mapgis-web-map>`,
});

export const 编辑 = Template.bind({});
编辑.args = {
  outStyle: {
    position: "absolute",
    zIndex: 900,
    top: "10px",
    left: "10px",
    height: "360px",
    width: "320px",
  },
  visible: true,
};
