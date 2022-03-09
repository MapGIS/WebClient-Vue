import MapgisMeasure from "../../mapboxgl/src/components/UI/controls/measure/Measure.vue";

export default {
  title: "二维/地图子组件/量测",
  component: MapgisMeasure,
  argTypes: {
    enableControl: true,
    isAdvanceControl: false,
    position: "top-left",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MapgisMeasure },
  data() {
    return {
      measureResult: null,
      toolbarVisible: true,
      toolbarBtns: [
        {
          icon: "mapgis-chevrons-right",
          type: "primary",
          tip: "展开/收起",
          control: true,
          click: this.enableToolbar,
        },
        {
          icon: "mapgis-ruler",
          type: "primary",
          tip: "长度",
          click: this.enableLengthMeasure,
        },
        {
          icon: "mapgis-area",
          type: "primary",
          tip: "面积",
          click: this.enableAreaMeasure,
        },
        {
          icon: "mapgis-shanchu_dianji",
          type: "primary",
          tip: "清空图元",
          click: this.clearMeasure,
        },
      ],
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 5,
        center: [107.19, 26.85],
      },
    };
  },
  computed: {
    measureRef() {
      return this.$refs.mapgisMeasure;
    },
    coordinates({ measureResult }) {
      return measureResult && measureResult.center
        ? measureResult.center.geometry.coordinates
        : [];
    },
    controlStyle({ position, isAdvanceControl }) {
      const [first, secend] = position.split("-");
      return {
        width: "fit-content",
        position: "absolute",
        maxHeight: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        zIndex: 1000,
        top: "10px",
        left: "10px",
        [first]: "10px",
        [secend]: "10px",
        background: isAdvanceControl ? "#fff" : "transparent",
      };
    },
    showSize(){
      return {
        marginBottom:"calc(6vh)",
        padding:"5px",
        borderRadius:"5px",
        backgroundColor:"cornsilk"
      }
    },
    toolbarStyle({ toolbarVisible }) {
      return {
        overflow: "hidden",
        transition: "width 0.3s",
        width: `${toolbarVisible ? 160 : 32}px`,
      };
    },
    btnStyle({ toolbarVisible }) {
      return ({ control }) => ({
        width: "32px !important",
        height: "32px !important",
        ...(control
          ? {
              fontSize: "20px",
              transition: "transform 0.2s",
              transform: `rotate(${toolbarVisible ? "180deg" : "0"})`,
            }
          : {}),
      });
    },
  },
  methods: {
    clearMeasure() {
      this.measureResult = null;
      this.measureRef.remove();
    },
    startMeasure(mode) {
      this.measureRef.enableMeasure();
      this.measureRef.changeMode(mode);
    },
    enableToolbar() {
      this.toolbarVisible = !this.toolbarVisible;
    },
    enableLengthMeasure() {
      this.clearMeasure();
      this.startMeasure("draw_line_string");
    },
    enableAreaMeasure() {
      this.clearMeasure();
      this.startMeasure("draw_polygon");
    },
  },
  template: `
  <mapgis-web-map v-bind="{ ...mapOptions }" style="height:95vh">
    <mapgis-rastertile-layer
      layerId="tdt"
      url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
    />
<!--        <mapgis-arcgis-tile-layer       layerId="arcgis_tile_layerId"-->
<!--                                        baseUrl="http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"-->
<!--                                        :tileSize="256"-->
<!--                                        :zoomOffset="0"-->
<!--                                        :forceOffset="false"/>-->
    <div
      v-show="enableControl"
      :style="controlStyle"
      class="measure-story-control"
    >
      <mapgis-measure
        ref="mapgisMeasure"
        :enable-control="enableControl"
        :is-advance-control="isAdvanceControl"
        @measureresult="measureResult = $event"
      >
        <mapgis-ui-space
          v-if="!isAdvanceControl"
          :style="toolbarStyle"
          slot="measureTool"
        >
          <mapgis-ui-tooltip
            v-for="(item, i) in toolbarBtns"
            :key="i"
            placement="bottom"
          >
            <span slot="title">{{ item.tip }}</span>
            <mapgis-ui-button
              shape="circle"
              @click="item.click(item)"
              :type="item.type"
              :style="btnStyle(item)"
            >
              <mapgis-ui-iconfont
                :type="item.icon"
                theme="filled"
              />
            </mapgis-ui-button>
          </mapgis-ui-tooltip>
          <mapgis-marker
            v-if="!!coordinates.length && enableControl"
            slot="measureMarker"
            :coordinates="coordinates"
            color="#ff0000"
          >
            <div slot="marker" class="mapgis-measure-control-label">
              <div :style="showSize">
                <div v-if="measureResult.geographyArea">
                  面积：{{ measureResult.geographyArea }}</div>
                <div>周长：{{ measureResult.geographyPerimeter }}</div>
              </div>
             </div>
          </mapgis-marker>
        </mapgis-ui-space>
      </mapgis-measure>
    </div>
</mapgis-web-map>`,
});

export const 量测 = Template.bind({});
量测.args = {
  enableControl: true,
  isAdvanceControl: false,
  position: "top-left",
};
