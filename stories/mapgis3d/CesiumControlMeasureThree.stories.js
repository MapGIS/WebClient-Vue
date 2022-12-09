import Mapgis3dMeasure from "../../cesium/src/components/UI/Controls/Measure/Measure.vue";
import Markdown from "../../cesium/docs/api/ui/measure.md";
import { 剖面 } from "./CesiumAnalysisProfile.stories";

export default {
  title: "三维/通用工具/量测/修改量测样式",
  component: Mapgis3dMeasure,
  argTypes: {
    enableControl: true,
    expandControl: true,
    hasSettingPanel: false,
    position: "top-left",
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { "mapgis-3d-measure": Mapgis3dMeasure },
  template: `
    <mapgis-web-scene
      v-bind:animation="false"
      v-bind:timeline="false"
      :style="{height: '95vh'}">
      <mapgis-3d-igs-m3d :url="m3durl"> </mapgis-3d-igs-m3d>
      <div
        v-show="enableControl"
        :style="controlStyle"
        class="measure-story-control"
      >
        <mapgis-3d-measure ref="measure3d" :measureOptions="measureOptions" @load="measure = $event">
          <mapgis-ui-space
            v-if="!hasSettingPanel"
            slot="measureTool"
            :style="toolbarStyle"
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
          </mapgis-ui-space>
        </mapgis-3d-measure>
      </div>
    </mapgis-web-scene>
  `,
  data() {
    return {
      m3durl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/services/ZondyModels/SceneServer`,
      measure: null,
      measureOptions: {},
      toolbarVisible: this.hasSettingPanel,
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
          tip: "直线测量",
          click: this.enableLengthMeasure,
        },
        {
          icon: "mapgis-area",
          type: "primary",
          tip: "面积测量",
          click: this.enableAreaMeasure,
        },
        {
          icon: "mapgis-huizhijuxing",
          type: "primary",
          tip: "三角测量",
          click: this.enableTriangleMeasure,
        },
        {
          icon: "mapgis-shanchu_dianji",
          type: "primary",
          tip: "清空图元",
          click: this.clearMeasure,
        },
      ],
    };
  },
  computed: {
    measure3dRef() {
      return this.$refs.measure3d;
    },
    controlStyle({ position, hasSettingPanel }) {
      const [first, secend] = position.split("-");
      return {
        width: "fit-content",
        position: "absolute",
        maxHeight: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        top: "10px",
        left: "10px",
        [first]: "10px",
        [secend]: "10px",
        zIndex: 1000,
        background: hasSettingPanel ? "#fff" : "transparent",
      };
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
      this.measure3dRef.remove();
    },
    startMeasure(measureName, options) {
      this.measure3dRef.$_enableMeasure(measureName, options);
    },
    enableToolbar() {
      this.toolbarVisible = !this.toolbarVisible;
    },
    enableLengthMeasure() {
      this.startMeasure("MeasureLengthTool");
    },
    enableAreaMeasure() {
      this.startMeasure("MeasureAreaTool");
    },
    enableTriangleMeasure() {
      this.startMeasure("TriangulationTool");
    },
    enableSlopeMeasure() {
      this.startMeasure("MeasureSlopeTool");
    },
  },
  mounted() {
    if (!this.enableControl) return;
    if (!this.hasSettingPanel) {
      this.toolbarVisible = this.expandControl;
    }
    this.measureOptions = { fillColor: "rgba(255, 255,0, 0.8)" };
  },
});

export const 修改量测样式 = Template.bind({});
修改量测样式.args = {
  enableControl: true,
  expandControl: true,
  hasSettingPanel: false,
  position: "top-left",
};

修改量测样式.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
