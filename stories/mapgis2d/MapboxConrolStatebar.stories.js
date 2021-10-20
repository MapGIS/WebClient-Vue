import MapgisStateControl from "../../mapboxgl/src/components/UI/controls/state/StateControl.vue";
import "../style/state.css";

export default {
  title: "二维/地图子组件/状态栏",
  component: MapgisStateControl,
  argTypes: {
    default: {
      description: "是否启用默认的界面",
      type: { name: "Boolean", required: false },
      table: {
        type: {
          summary: "自定义界面",
          detail: `<mapgis-state :default="false">
  <template v-slot:default="{state}">
    <mapgis-ui-input-group size="default" class="mapgis-test-2d-statebar">
      <mapgis-ui-input addon-before="级别" :value="state.level"/>
      <mapgis-ui-input addon-before="比例尺" :value="state.scale"/>
      <mapgis-ui-input addon-before="经度" :value="state.lng" />
      <mapgis-ui-input addon-before="纬度" :value="state.lat"/>
    </mapgis-ui-input-group>
  </template>
</mapgis-state>`,
        },
        defaultValue: { summary: true },
      },
    },
    scale: true,
    level: true,
    lng: true,
    lat: true,
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisStateControl },
  data() {
    return {
      compact: true
    }
  },
  template: `<mapgis-web-map crs="EPSG:4326" :center="[116.3, 40.5]" :zoom="5" style="height:95vh">
    <mapgis-rastertile-layer
      layerId="raster_tdt",
      url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" 
    >
    </mapgis-rastertile-layer>
    <mapgis-state v-bind="$props">
      <template v-slot:default="{state}">
        <mapgis-ui-input-group size="small" :compact="compact" class="mapgis-test-2d-statebar">
          <mapgis-ui-input addon-before="级别" :value="state.level" class="mapgis-test-2d-statebar-item"/>
          <mapgis-ui-input addon-before="比例尺" :value="state.scale" class="mapgis-test-2d-statebar-item"/>
          <mapgis-ui-input addon-before="经度" :value="state.lng" class="mapgis-test-2d-statebar-item"/>
          <mapgis-ui-input addon-before="纬度" :value="state.lat"class="mapgis-test-2d-statebar-item"/>
        </mapgis-ui-input-group>
      </template>
    </mapgis-state>
  </mapgis-web-map>`,
});

export const 状态栏 = Template.bind({});
状态栏.args = {
  default: false,
  scale: true,
  level: true,
  lng: true,
  lat: true,
};
