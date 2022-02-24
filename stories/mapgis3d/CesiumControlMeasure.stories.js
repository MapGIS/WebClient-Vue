import Mapgis3dMeasure from "../../cesium/src/components/UI/Controls/Measure/Measure.vue";
import Markdown from "../../cesium/docs/api/ui/measure.md";

export default {
  title: "三维/场景子组件/量测",
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
        <mapgis-3d-measure ref="measure3d" @load="measure = $event"
          :measureOptions="measureOptionsObj"
        >
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
      m3durl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
      measure: null,
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
      measureOptionsObj: {
        //设置测量单位
        unit: "meters",
        //设置测量图标参数
        pointIconWith: 16,
        pointIconHeight: 16,
        closeIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAtVJREFUWEfNVz1oU1EU/k6bQkFxqoPSwT8UBwdFBwelHVVQHBR0cFBaMZLkXCM4KBhBQYLlnadUtKCUDv7UScFFBKFu6tRFLFgjgiJWtP4Ul+bIDe+VJH15P7U1vZAhud/3ne+ee3PuuYQEg5m7iGi/qm4HsNz7EICvqjpBRGPlcvl+e3v702Kx+DOOtCWHjkwms6y1tTUD4AiA9VF4O6+q34joHoBrIvI6jBNqgJlPALDBN8YJHID54Zk414jf0IAxZlhVD8wxcD3tuYjsDNIKNMDMHwB0zlNwX2ZCROy5qRmzDDDzOwCr5jm4L1cSkdXV2jUG5jntgWsgogeO4xz0J2cMMPN5AIUFWnm9bEFELtgfKwaYeQWAVwBW/icDHwFsFZFPvoE4qy8Q0T5V3Rxh8ruq9hLRcASukgXfwFsAa0IIFbAxZp2qDgGwlTBovCeiXsdxnhhj0qraH6I5LiJrKZvN7m5paXkc4faSiFSKSSaT6UylUkOq2l3HGSWiHsdxXnjbehHA2TDdcrm8h5j5BoDjUXtPRH2O45y2uHw+3zE9PW0zscvjjdi0u677xn43xlxR1XyUJoCb1oB1vC0G2Nb4667rnrTYdDq9tK2tbYiIUqra47ruZ/t7LpfrJ6J0HD0AL62BpIXntogcswEKhUKqVCqlBgcH/3hpvwXgaMzgFlayBn4BWJKAZKF3ReRwNYeZ7wA4lFDn96Iw0PQtaO4hNMa4qpqN2ruF+BsS0VV7BroAPGtGIQLQ7ZdiW0DC+r3EpTiXy50hosshCxsTkQ2L5jJq7nXsVbE4V3LUWY07X9uQ+CxmHgGwI67KHHE1HXJQU/oFQMccxaNoszrjRm35KIBNUWoJ52d1xJbf8GHCzH0ATiUMEgiv74SrQYv3aea7rHqc2ns+rG+cWRgRTaqqvZ7/7XFan0+vf9wLYEvQ8xzAOBE9nJqaejQwMDAZZ/v+AnZ2dDoo/C0XAAAAAElFTkSuQmCC",
        pointIcon: "data:image/png;base64,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"
      }
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
    startMeasure(measureName) {
      this.measure3dRef.$_enableMeasure(measureName);
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
  },
});

export const 量测 = Template.bind({});
量测.args = {
  enableControl: true,
  expandControl: true,
  hasSettingPanel: false,
  position: "top-left",
};

量测.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};