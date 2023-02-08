import MapgisEditor from "../../mapboxgl/src/components/UI/controls/edit/Editor.vue";

export default {
  title: "二维/二维标绘/基础标绘/编辑",
  component: MapgisEditor,
  argTypes: {
    feature: {},
    enableControl: false,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisEditor },
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 5,
        center: [114.31667,30.51667],
      },
      editStyle: {
        position: "absolute",
        zIndex: 2000,
        width: "290px",
        height: "420px",
        left: "10px",
        bottom: "10px",
      },
    };
  },
  methods: {
    hideCard() {
      this.$refs['edit-card'].hide();
    }
  },
  template: `
    <mapgis-web-map v-bind="{...mapOptions}" style="height:95vh">
        <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-rastertile-layer layerId="tdt1" url="http://t0.tianditu.com/DataServer?T=cva_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
        <mapgis-draw  :enableControl="true"/> 
        <mapgis-ui-collapse-card ref="edit-card" :outStyle="editStyle" position="bottom-left">
          <span slot="title">要素编辑</span>
          <mapgis-ui-iconfont type="mapgis-edit-square" slot="icon-hiden"/>
          <mapgis-ui-iconfont type="mapgis-hide" slot="extra" @click="hideCard"/>
          <mapgis-edit  v-bind="$props" />
        </mapgis-ui-collapse-card>
    </mapgis-web-map>
    `,
});

export const 编辑 = Template.bind({});
编辑.args = {
  enableControl: true,
  feature: {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [113, 29],
          [115, 29],
          [115, 32],
          [113, 32],
          [113, 29],
        ],
      ],
    },
    properties: {
      ID: 1262,
      JB: 1,
      mpLayer: 0,
      name: "wuhan",
      mapgis_style: 1,
      mpLength: 51.64045457828864,
    },
  },
};
