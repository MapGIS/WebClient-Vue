<template>
  <div>
    <slot>
      <div>
        <mapgis-ui-setting-form :wrapper-width="200">
          <mapgis-ui-mix-row
            title="观察者信息："
            type="MapgisUiInput"
            :value="centerPosition"
            :props="observerProps"
          />
          <mapgis-ui-mix-row
            title="线宽度："
            type="MapgisUiInputNumber"
            v-model="formData.skylineWidth"
            :props="lineWidthProps"
          />
          <mapgis-ui-mix-row
            title="线颜色："
            type="MapgisUiColorPicker"
            v-model="formData.skylineColor"
          />
        </mapgis-ui-setting-form>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="add"
            >天际线</mapgis-ui-button
          >
          <mapgis-ui-button @click="showAnalysis2d"
            >二维天际线</mapgis-ui-button
          >
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
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
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
      observerProps: {
        disabled: true,
        placeholder: "经度，纬度，高程"
      },
      lineWidthProps: {
        min: 0
      },
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
      const { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        CesiumZondy.SkyLineAnalysisManager.addSource(
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
        this.webGlobe
      );
      if (
        navigator.userAgent.indexOf("Linux") > 0 &&
        navigator.userAgent.indexOf("Firefox") > 0
      ) {
        setLogarithmicDepthBufferEnable(false, this.webGlobe);
      } else {
        // 其他浏览器还是设置为true，不然会导致分析结果不正确，cesium1.8版本已不需要再额外设置
        setLogarithmicDepthBufferEnable(true, this.webGlobe);
      }
    },
    unmount() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.SkyLineAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        this.remove();
      }
      CesiumZondy.SkyLineAnalysisManager.deleteSource(vueKey, vueIndex);

      //缓存区设置
      if (
        this.isLogarithmicDepthBufferEnable !==
        isLogarithmicDepthBufferEnable(this.webGlobe)
      ) {
        setLogarithmicDepthBufferEnable(
          this.isLogarithmicDepthBufferEnable,
          this.webGlobe
        );
      }
      this.$emit("unload", this);
    },
    remove() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.SkyLineAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
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
      const { canvas } = this.webGlobe.viewer;
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
    showAnalysis2d() {
      if (!this.positions2D.length) {
        this.$message.warning("请先进行天际线分析");
      } else {
        this.skyline2dChart.clear();
        this.skyline2dChart.showLoading();
        this.skyline2dChart.setOption(chartOptions(this.getChartOptions()));
        this.skyline2dChart.resize();
        this.skyline2dChart.hideLoading();
        this.$emit("showAnalysis2d", this.skyline2dChart);
      }
    },
    /**
     * 分析结束
     * @param positions2D 二维坐标点
     * @param positions3D 三维坐标点
     */
    analysisEndCallBack({ positions2D = [], positions3D }) {
      this.positions2D = positions2D.length ? _cloneDeep(positions2D) : [];
      this.maskShow = false;
    },
    add() {
      this.remove();
      this.maskShow = true;
      let { CesiumZondy, vueKey, vueIndex } = this;
      const { viewer } = this.webGlobe;
      let find = CesiumZondy.SkyLineAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      let { options } = find;

      // 初始化高级分析功能管理类
      const advancedAnalysisManager = new this.CesiumZondy.Manager.AdvancedAnalysisManager(
        {
          viewer: this.webGlobe.viewer
        }
      );
      // 创建天际线实例
      let skylineAnalysisVal = options.skylineAnalysis;

      skylineAnalysisVal =
        skylineAnalysisVal || advancedAnalysisManager.createSkyLine();
      skylineAnalysisVal._analysisEndCallBack = this.analysisEndCallBack;
      skylineAnalysisVal.color = this.edgeColor();
      skylineAnalysisVal.lineWidth = this.formData.skylineWidth;

      this.$emit("success");
      CesiumZondy.SkyLineAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "skyLineAnalysis",
        skylineAnalysisVal
      );
      this.setCenterPosition();
    },
    edgeColor() {
      return colorToCesiumColor(this.formData.skylineColor, this.webGlobe);
    },
    /**
     * 设置观察者位置
     */
    setCenterPosition() {
      const position = getCenterPosition(this.webGlobe);
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

<style lang="less" scoped>
::v-deep {
  .mapgis-ui-row-flex {
    margin-bottom: 12px;

    .row-flex-col-left {
      margin-bottom: 2px;
    }
  }

  .mapgis-ui-input-number {
    width: 100%;
  }

  .mapgi-ui-input-disabled {
    //color:fade($text-color, 40%);
    background: transparent;
  }

  .mapgis-ui-sketch-color-picker .color-container {
    border: unset;
  }
}

#skyline-2d-chart {
  width: 300px;
  height: 230px;
}

.mapgis-widget-skyline-analysis {
  display: flex;
  flex-direction: column;
  position: relative;

  .skyline-analysis-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    //background: fade($white, 40%);
    z-index: 2;
  }
}

.ui-card.right {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: #fff;
}

.ui-card.left {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background-color: #fff;
}
</style>
