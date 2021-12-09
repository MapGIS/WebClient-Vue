<template>
  <div :class="prefixCls">
    <!-- 测量控制按钮 -->
    <mapgis-ui-toolbar :class="`${prefixCls}-toolbar`">
      <!-- 面积或长度设置按钮 -->
      <mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-command
          v-for="{ title, mode, icon, measuretype } in modes"
          :key="title"
          :title="title"
          :icon="icon"
          :active="activeMode === mode"
          @click="startMeasure(mode, measuretype)"
          class="command-group"
        />
      </mapgis-ui-toolbar-command-group>
      <mapgis-ui-toolbar-space />
      <!-- 清除或设置 -->
      <mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-command
          title="清除"
          icon="mapgis-shanchu_dianji"
          @click="clearMeasure"
        />
        <mapgis-ui-toolbar-command
          @click="showSettingPanel = !showSettingPanel"
          :active="showSettingPanel"
          title="设置"
          icon="mapgis-setting"
        />
      </mapgis-ui-toolbar-command-group>
    </mapgis-ui-toolbar>
    <!-- 测量结果 -->
    <measure-3d-result
      :mode="activeMode"
      :result="measureResult"
      :type="activeType"
      v-if="true"
    />
    <!-- 测量样式设置 -->
    <measure-3d-setting
      v-if="showSettingPanel"
      @measure-style-change="measureStyleChange"
    />
  </div>
</template>
<script>
import { last } from "../../../../Utils/util";
import Measure3dResult, { measureModeMap } from "./MeasureResult.vue";
import Measure3dSetting from "./MeasureSetting.vue";

//  todo 暂不支持样式的实时更改
export default {
  name: "measure-3d-tool",
  inject: ["viewer"],
  components: {
    "measure-3d-result": Measure3dResult,
    "measure-3d-setting": Measure3dSetting
  },
  props: {
    result: {
      type: [Number, Object]
    }
  },
  data: vm => ({
    prefixCls: "measure-3d-tool",
    showSettingPanel: false,
    measureResult: null,
    activeMode: "",
    activeType: "",
    // todo 替换ICON
    modes: [
      {
        mode: measureModeMap.MeasureLengthTool,
        title: "空间距离",
        icon: "mapgis-huizhixian1",
        measuretype: "space"
      },
      {
        mode: measureModeMap.MeasureAreaTool,
        title: "空间面积",
        icon: "mapgis-area",
        measuretype: "space"
      },
      {
        mode: measureModeMap.MeasureStickLengthTool,
        title: "贴地距离",
        icon:
          '<svg t="1638933339434" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7017" width="200" height="200"><path d="M98.6 98.2h50v830h-50z" p-id="7018" ></path><path d="M98.6 877.5H928v50H98.6z m477.5-84.7c-29.1 0-53.9-16.6-73.6-49.3-14.8-24.6-26.2-56.7-37.2-87.7-24.7-69.7-45-119-81.2-119-38.9 0-91.8 24.3-152.8 70.2-48.1 36.2-84 73.1-84.3 73.4l-36-34.8c1.5-1.6 38.5-39.7 89.6-78.2 71-53.5 132.7-80.6 183.4-80.6 34.2 0 63.1 18.4 85.9 54.6 17.6 28 30.2 63.4 42.4 97.7 18 50.8 36.7 103.4 63.5 103.7 1.7-0.6 18.4-7.8 46.9-82.4 20.3-53.2 40.6-123.9 60.2-192.3 20.2-70.4 41-143.1 62.2-197.2 20.1-51.5 46.2-104.1 87-104.1H928v50h-95.1c-1.3 0.6-7.2 4.3-16.8 20.2-8.5 14.1-17.8 34.5-27.6 60.6-19.2 51-38.6 118.7-57.4 184.3-20.7 72.3-42.2 147.1-64.3 203.3-21 53.2-48.1 107.6-90.7 107.6z" p-id="7019" "></path></svg>',
        measuretype: "tostick"
      },
      {
        mode: measureModeMap.MeasureStickAreaTool,
        title: "贴地面积",
        icon:
          '<svg t="1638932551716" class="icon" viewBox="0 0 1255 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2635" width="14" height="14"><path d="M155.791637 754.376488l1056.914077 186.369394a41.879297 41.879297 0 1 1-14.546858 82.470251l-1154.616129-203.590787a42.401157 42.401157 0 0 1-10.029505-3.098547A41.862989 41.862989 0 0 1 0.032616 775.495526V42.705679a41.879297 41.879297 0 1 1 83.742286 0v693.340462l539.163331-196.186893a20.929864 20.929864 0 1 1 14.318545 39.335228z" p-id="2636"></path><path d="M615.615879 258.625419l602.8303 150.475183L615.615879 597.867293 195.632416 428.409437l419.983463-169.784018z" p-id="2637"></path><path d="M383.958787 121.604448c58.432056-12.52465 63.960515 15.378574 137.787453 152.43216 3.163779 5.870929 30.20267 138.619168 91.912663 138.619168 57.208946 0 179.911372-132.976552 183.172999-138.619168 40.378948-70.565311 34.328629-136.711116 104.926556-115.608386s115.412688 25.505927 185.651837 199.611602q5.642616 14.024998 131.035884 47.097901l-4.2075 15.93305a4.46843 4.46843 0 0 1 0.88064 8.284534l-270.470459 137.656988a952.949702 952.949702 0 0 0-228.737936 162.820444l-11.415696 10.910144a115.265915 115.265915 0 0 1-162.967217-3.082238 120.491042 120.491042 0 0 1-6.882034-7.827906 907.939242 907.939242 0 0 0-181.672651-171.626838l-148.567132-105.758271a20.92334 20.92334 0 0 1 5.120756-36.77485q44.700605-15.949358 56.328306-27.903223c16.079823-16.536451 59.671475-253.656769 118.103531-266.165111z" p-id="2638" ></path><path d="M383.958787 121.604448c58.432056-12.52465 98.077138 12.60619 137.787453 152.43216 21.200579 74.77281 65.705486 138.619168 91.912663 138.619168 57.208946 0 85.161094-90.526471 99.479638-138.619168 21.559358-72.717985 96.430017-201.519654 188.815615-201.519654s130.269402 59.573626 234.837179 241.670289c50.131214 87.281151 119.489723 80.333885 117.05981 98.468533q-53.523307 24.95145-351.945913 176.796518l-245.910404 54.273481a188.619917 188.619917 0 0 1-70.973015 1.956977l-25.848397-4.240116a322.11833 322.11833 0 0 1-114.825596-42.303308q-247.492293-149.627161-275.949993-165.706985c15.003486-5.039214 26.565956-18.460812 40.150634-31.963949 86.971297-113.357863 81.524379-247.541218 175.410326-279.863946z" p-id="2639"></path><path d="M615.599571 412.003451q70.989322 114.303735 215.0391 114.303735t420.749945-112.526148L615.599571 729.816433 185.374598 443.054145q82.992111 41.357436 219.246599 41.357436t210.978374-72.40813z" p-id="2640"></path></svg>',
        measuretype: "tostick"
      },
      {
        mode: measureModeMap.TriangulationTool,
        title: "三角",
        icon: "mapgis-sanjiaoceliang",
        measuretype: "triangle"
      }
    ]
  }),
  watch: {
    result: {
      deep: true,
      immediate: true,
      handler(nResult) {
        this.setMeasureResult(nResult);
      }
    }
  },
  methods: {
    /**
     * 保留2位小数
     */
    precision(n, p = 3) {
      return n.toFixed(p);
    },
    /**
     * 设置测量结果
     * @param {*} result
     */
    setMeasureResult(result) {
      let _measureResult;
      switch (this.activeMode) {
        case measureModeMap.MeasureLengthTool:
          _measureResult = {
            cesiumLength: this.precision(result)
          };
          break;
        case measureModeMap.MeasureStickLengthTool:
          _measureResult = {
            cesiumStickLength: this.precision(result)
          };
          break;
        case measureModeMap.MeasureAreaTool:
          _measureResult = {
            cesiumArea: this.precision(result / Math.pow(1000, 2))
          };
          break;
        case measureModeMap.MeasureStickAreaTool:
          console.log("==========");
          console.log(result);
          _measureResult = {
            cesiumStickArea: this.precision(result / Math.pow(1000, 2))
          };

          console.log(_measureResult);
          break;
        case measureModeMap.TriangulationTool:
          _measureResult = {
            horizontalDiatance: this.precision(result.horizontalDiatance),
            verticalDiatance: this.precision(result.verticalDiatance)
          };
          break;
        default:
          break;
      }
      this.measureResult = _measureResult;
    },
    /**
     * 开始测量
     */
    startMeasure(mode, measuretype) {
      this.clearMeasure();
      this.enableMeasure(mode, measuretype);
      this.activeMode = mode;
      this.activeType = measuretype;
    },
    /**
     *  关闭测量工具
     */
    clearMeasure() {
      this.activeMode = "";
      this.measureResult = null;
      this.$parent.remove();
    },
    /**
     * 开始测量
     */
    enableMeasure(mode, measuretype) {
      this.$parent.$_enableMeasure(mode, measuretype, this.setMeasureResult);
    },
    /**
     * 测量样式变化
     */
    measureStyleChange(style) {
      this.$parent.initStyles(style);
    }
  }
};
</script>
<style lang="scss" scoped>
.measure-3d-tool {
  &-toolbar {
    justify-content: space-between;
  }
}
.command-group {
  margin: 0% !important;
}
</style>
