<template>
  <div>
    <slot>
      <div>
        <mapgis-ui-setting-form
          :layout="layout"
          size="default"
        >
          <mapgis-ui-form-item label="观察者信息">
            <mapgis-ui-input
              v-model="centerPosition"
              placeholder="经度，纬度，高程"
              disabled
            />
          </mapgis-ui-form-item>
          <!-- <mapgis-ui-mix-row
            title="观察者信息："
            type="MapgisUiInput"
            :value="centerPosition"
            :props="observerProps"
          /> -->
          <mapgis-ui-form-item label="线宽度">
            <mapgis-ui-input-number-addon
              v-model.number="formData.skylineWidth"
              min="0"
            />
          </mapgis-ui-form-item>
          <!-- <mapgis-ui-mix-row
            title="线宽度："
            type="MapgisUiInputNumber"
            v-model="formData.skylineWidth"
            :props="lineWidthProps"
          /> -->
          <mapgis-ui-form-item label="线颜色">
            <mapgis-ui-sketch-color-picker
              :color.sync="formData.skylineColor"
              :disableAlpha="true"
            ></mapgis-ui-sketch-color-picker>
          </mapgis-ui-form-item>
          <!-- <mapgis-ui-mix-row
            title="线颜色："
            type="MapgisUiColorPicker"
            v-model="formData.skylineColor"
          /> -->
        </mapgis-ui-setting-form>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="addSkyLine"
            >天际线</mapgis-ui-button
          >
          <!-- <mapgis-ui-button @click="showAnalysis2d"
            >二维天际线</mapgis-ui-button
          > -->
          <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>
        <mapgis-ui-mask
          :parentDivClass="'cesium-map-wrapper'"
          :loading="maskShow"
          :text="maskText"
        ></mapgis-ui-mask>
      </div>
    </slot>
  </div>
</template>
<script>
import VueOptions from "../Base/Vue/VueOptions";
import * as echarts from "echarts";
import _cloneDeep from "lodash/cloneDeep";
import chartOptions from "./skyline2dChartOptions";
import {
  colorToCesiumColor,
  getCenterPosition,
  isLogarithmicDepthBufferEnable,
  setLogarithmicDepthBufferEnable
} from "../WebGlobe/util";

export default {
  name: "mapgis-3d-skyline",
  props: {
    /**
     * @type String
     * @default "vertical"
     * @description 表单布局
     */
    layout: {
      type: String,
      default: "vertical" // 'horizontal' 'vertical' 'inline'
    },
    /**
     * @type Number
     * @default 2
     * @description 天际线宽度
     */
    skylineWidth: {
      type: Number,
      default: 2
    },
    /**
     * @type String
     * @default 'rgb(255,0,0)'
     * @description 天际线颜色
     */
    skylineColor: {
      type: String,
      default: "rgb(255,0,0)"
    },
    ...VueOptions
  },
  inject: ["Cesium", "vueCesium", "viewer"],
  data() {
    return {
      formData: {
        skylineWidth: 2,
        skylineColor: "rgb(255,0,0)"
      },
      loading: null,
      centerPosition: "",
      positions2D: [],
      skyline2dChart: null,
      // observerProps: {
      //   disabled: true,
      //   placeholder: "经度，纬度，高程"
      // },
      // lineWidthProps: {
      //   min: 0
      // },
      maskShow: false,
      maskText: "正在分析中, 请稍等...",
      //是否开启缓存区
      isLogarithmicDepthBufferEnable: false
    };
  },
  watch: {
    skylineWidth: {
      handler: function(newVal, oldVal) {
        this.formData.skylineWidth = newVal;
      },
      immediate: true
    },
    skylineColor: {
      handler: function(newVal, oldVal) {
        this.formData.skylineColor = newVal;
      },
      immediate: true
    }
  },
  mounted() {
    this.skyline2dChart = echarts.init(
      document.getElementById("skyline-2d-chart")
    );
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      // return new Cesium.GeoJsonDataSource.load(baseUrl, options);
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        vueCesium.SkyLineAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            skyLineAnalysis: null
          }
        );
      });
      //缓存区设置
      this.isLogarithmicDepthBufferEnable = isLogarithmicDepthBufferEnable(
        viewer
      );
      if (
        navigator.userAgent.indexOf("Linux") > 0 &&
        navigator.userAgent.indexOf("Firefox") > 0
      ) {
        setLogarithmicDepthBufferEnable(false, viewer);
      } else {
        // 其他浏览器还是设置为true，不然会导致分析结果不正确，cesium1.8版本已不需要再额外设置
        setLogarithmicDepthBufferEnable(true, viewer);
      }
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.SkyLineAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }
      vueCesium.SkyLineAnalysisManager.deleteSource(vueKey, vueIndex);

      //缓存区设置
      if (
        this.isLogarithmicDepthBufferEnable !==
        isLogarithmicDepthBufferEnable(this.viewer)
      ) {
        setLogarithmicDepthBufferEnable(
          this.isLogarithmicDepthBufferEnable,
          this.viewer
        );
      }
      this.$emit("unload", this);
    },
    remove() {
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.SkyLineAnalysisManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        let { options } = find;
        let { skyLineAnalysis } = options;

        // 判断是否已有天际线分析结果
        if (skyLineAnalysis) {
          // 移除天际线分析显示结果
          skyLineAnalysis.destroy();
          skyLineAnalysis = null;
          this.centerPosition = "";
          this.positions2D = [];
        }
      }
      this.$emit("remove");
    },
    /**
     * 获取二维天际线图表的xy轴信息
     */
    getChartOptions() {
      const { canvas } = this.viewer;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      return this.positions2D.reduce(
        ({ x, y }, v) => {
          x.push((1 - v.x / w).toFixed(8));
          y.push((1 - v.y / h).toFixed(8));
          return {
            x,
            y
          };
        },
        {
          x: [],
          y: []
        }
      );
    },
    /**
     * 展示二维天际线
     * todo 绘制完成回调添加二维坐标点 #143
     */
    // showAnalysis2d() {
    //   if (!this.positions2D.length) {
    //     this.$message.warning("请先进行天际线分析");
    //   } else {
    //     this.skyline2dChart.clear();
    //     this.skyline2dChart.showLoading();
    //     this.skyline2dChart.setOption(chartOptions(this.getChartOptions()));
    //     this.skyline2dChart.resize();
    //     this.skyline2dChart.hideLoading();
    //     this.$emit("showAnalysis2d", this.skyline2dChart);
    //   }
    // },
    /**
     * 分析结束
     * @param positions2D 二维坐标点
     * @param positions3D 三维坐标点
     */
    analysisEndCallBack({ positions2D = [], positions3D }) {
      this.positions2D = positions2D.length ? _cloneDeep(positions2D) : [];
      this.maskShow = false;
      this.skyline2dChart.clear();
      this.skyline2dChart.showLoading();
      this.skyline2dChart.setOption(chartOptions(this.getChartOptions()));
      this.skyline2dChart.resize();
      this.skyline2dChart.hideLoading();
      this.$emit("success");
      this.$emit("showAnalysis2d", this.skyline2dChart);
    },
    addSkyLine() {
      this.remove();
      this.maskShow = true;
      let { vueCesium, vueKey, vueIndex, viewer } = this;
      let scene = viewer.scene;
      let find = vueCesium.SkyLineAnalysisManager.findSource(vueKey, vueIndex);
      let { options } = find;
      scene.skyAtmosphere.showGroundAtmosphere = false;
      //
      scene.skyBox.show = false;
      // scene.skyAtmosphere.show = false;

      // 创建天际线实例
      let skylineAnalysisVal = options.skylineAnalysis;
      skylineAnalysisVal =
        skylineAnalysisVal ||
        new Cesium.SkyLineAnalysis({ scene: viewer.scene });
      skylineAnalysisVal._analysisEndCallBack = this.analysisEndCallBack;
      skylineAnalysisVal.color = this.edgeColor();
      skylineAnalysisVal.lineWidth = this.formData.skylineWidth;
      // 添加到地图上
      viewer.scene.visualAnalysisManager.add(skylineAnalysisVal);
      vueCesium.SkyLineAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "skyLineAnalysis",
        skylineAnalysisVal
      );
      this.setCenterPosition();
    },
    edgeColor() {
      return colorToCesiumColor(this.formData.skylineColor);
    },
    /**
     * 设置观察者位置
     */
    setCenterPosition() {
      const position = getCenterPosition(this.viewer);
      if (position) {
        const { lng, lat, height } = position;
        const lngStr = `${lng.toFixed(4)}°`;
        const latStr = `${lat.toFixed(4)}°`;
        const heightStr = `${height.toFixed(2)}m`;
        this.centerPosition = `${lngStr}，${latStr}，${heightStr}`;
      }
    }
  }
};
</script>

<style scoped>
#skyline-2d-chart {
  width: 300px;
  height: 230px;
}
</style>
