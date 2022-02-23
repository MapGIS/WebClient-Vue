import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
import "../style/action.css";

// http://datav.aliyun.com/portal/school/atlas/area_selector#&lat=33.50475906922609&lng=104.32617187499999&zoom=4

export default {
  title: "二维/地图/行为",
  component: MapgisWebMap,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisWebMap },
  parameters: {
    docs: {
      page: null,
    },
  },
  data() {
    return {
      minScrollZoom: 5,
      minDragZoom: 5,
    };
  },
  watch: {
    minScrollZoom() {
      this.unbindEvent();
      this.bindEvent();
    },
    minDragZoom() {
      this.unbindEvent();
      this.bindEvent();
    },
  },
  methods: {
    handleMapLoad(payload) {
      const { map } = payload;
      const { minScrollZoom, minDragZoom } = this;
      window.map2d = map;

      let zoom = map.getZoom();

      if (zoom <= minScrollZoom) {
        map.scrollZoom.disable();
      } else {
        map.scrollZoom.enable();
      }

      if (zoom <= minDragZoom) {
        map.dragPan.disable();
      } else {
        map.dragPan.enable();
      }
      this.bindEvent();
    },
    bindEvent() {
      const { minScrollZoom, minDragZoom } = this;
      const map = window.map2d;
      map.on("zoom", (event) => {
        const { target } = event;
        let zoom = target.getZoom();
        if (zoom <= minScrollZoom) {
          map.scrollZoom.disable();
        } else {
          map.scrollZoom.enable();
        }
        if (zoom <= minDragZoom) {
          map.dragPan.disable();
        } else {
          map.dragPan.enable();
        }
      });
    },
    unbindEvent() {
      const map = window.map2d;
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.off("zoom", () => {});
    },
    zoomin() {
      window.map2d.zoomIn();
    },
    zoomout() {
      window.map2d.zoomOut();
    },
  },
  template: `
      <mapgis-web-map v-bind="$props" style="height:95vh" @load="handleMapLoad">
        <mapgis-rastertile-layer
            layerId="栅格底图-天地图"
            url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
        />
        <mapgis-ui-card hoverable size="small" class="mapgis-custom-actions">
            <strong slot="title">自定义场景交互 </strong>
            <template slot="actions" class="ant-card-actions">
                <mapgis-ui-iconfont type="mapgis-zoom-in" @click="zoomin" />
                <mapgis-ui-iconfont type="mapgis-zoom-out" @click="zoomout" />
            </template>
            <mapgis-ui-input-number-panel
                v-model="minScrollZoom"
                size="small"
                :range="[0, 20]"
                label="缩放最小级别"
                tooltip="这是提示"
            />
            <mapgis-ui-input-number-panel
                v-model="minDragZoom"
                size="small"
                :range="[0, 20]"
                label="拖拽最小级别"
                tooltip="这是提示"
            />
        </mapgis-ui-card>
      </mapgis-web-map>
    `,
});

export const 行为 = Template.bind({});
行为.args = {
  zoom: 3,
  center: [114.3, 30.5],
  crs: "EPSG:4326",
};
