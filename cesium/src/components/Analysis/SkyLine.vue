<!--<template>-->
<!--  <div :class="['skyl',{ right: position === 'right', left: position === 'left' }]">-->
<!--    <div-->
<!--        class="card-title"-->
<!--        :style="{-->
<!--                background: 'rgb(38, 151, 204)',-->
<!--                padding: '5px',-->
<!--                color: 'white',-->
<!--            }"-->
<!--    >-->
<!--      天际线分析-->
<!--    </div>-->
<!--    <mapgis-ui-card>-->
<!--    <mapgis-ui-button class="content" type="primary" @click="startSkyLine"-->
<!--    >开始绘制</mapgis-ui-button-->
<!--    >-->
<!--    <mapgis-ui-button-->
<!--        class="content-clear"-->
<!--        type="primary"-->
<!--        @click="clearSkyLine"-->
<!--    >清除</mapgis-ui-button>-->
<!--    </mapgis-ui-card>-->
<!--  </div>-->
<!--</template>-->
<template>
  <div :class="['mapgis-widget-skyline-analysis',{ right: position === 'right', left: position === 'left' }]">
    <mapgis-ui-setting-form :wrapper-width="200">
      <mapgis-ui-mix-row
        title="观察者信息"
        type="input"
        :value="centerPosition"
        :props="observerProps"
      />
      <mapgis-ui-mix-row
          title="线宽度"
          type="inputNumber"
          v-model="formData.skylineWidth"
          :props="lineWidthProps"
      />
      <mapgis-ui-mix-row
          title="线颜色"
          type="colorPicker"
          v-model="formData.skylineColor"
      />
    </mapgis-ui-setting-form>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="add">天际线</mapgis-ui-button>
      <mapgis-ui-button @click="showAnalysis2d">二维天际线</mapgis-ui-button>
      <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
    </mapgis-ui-setting-footer>
    <div class="skyline-analysis-mask" v-show="!!loading"/>
    <!-- 二维天际线 -->
    <mapgis-ui-window-wrapper :visible="skyline2dVisible">
      <mapgis-ui-window
          @window-size="onSkyline2dWindowSize"
          :visible.sync="skyline2dVisible"
          :min-width="300"
          :max-height="300"
          anchor="bottom-left"
          title="二维天际线"
      >
        <div ref="skyline2dChart">
          <div id="skyline-2d-chart"/>
        </div>
      </mapgis-ui-window>
    </mapgis-ui-window-wrapper>
  </div>
</template>
<script>
import VueOptions from "../Base/Vue/VueOptions";
import * as echarts from "echarts";
import _cloneDeep from 'lodash/cloneDeep';
import chartOptions from './skyline2dChartOptions';
import { colorToCesiumColor, getCenterPosition } from "../WebGlobe/util";

export default {
  name: "mapgis-3d-skyline",
  props: {
    index: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: "right",
    },
    ...VueOptions
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  data() {
    return {
      //定义天地线分析
      // skyLineAn:false
      formData: {
        skylineWidth: 2,
        skylineColor: 'rgb(255,0,0)'
      },
      loading: null,
      centerPosition: '',
      skyline2dVisible: false,
      skyline2dChart: null,
      positions2D: [],
      isLogarithmicDepthBufferEnable: false,
      observerProps:{
        disabled:true,
        placeholder:"经度，纬度，高程",
      },
      lineWidthProps:{
        min: 0
      }
    }
  },
  mounted() {
    this.skyline2dChart = echarts.init(
        document.getElementById('skyline-2d-chart')
    )
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const {baseUrl, options} = this;
      // return new Cesium.GeoJsonDataSource.load(baseUrl, options);
      return new Promise(
          resolve => {
            resolve();
          },
          reject => {
          }
      );
    },
    mount() {
      const {webGlobe, CesiumZondy, vueKey, vueIndex} = this;
      const {viewer} = webGlobe;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        vm.$emit("load", {component: this});
        CesiumZondy.SkyLineAnalysisManager.addSource(
            vueKey,
            vueIndex,
            dataSource,
            {
              skyLineAnalysis: null
            }
        );
      });
    },
    unmount() {
      let {CesiumZondy, vueKey, vueIndex} = this;
      let find = CesiumZondy.SkyLineAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        this.remove();
      }
      CesiumZondy.SkyLineAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    remove() {
      let {CesiumZondy, vueKey, vueIndex} = this;
      let find = CesiumZondy.SkyLineAnalysisManager.findSource(vueKey, vueIndex);
      let {options} = find;
      let {skyLineAnalysis} = options;

      // 判断是否已有天际线分析结果
      if (skyLineAnalysis) {
        // 移除天际线分析显示结果
        skyLineAnalysis.destroy();
        skyLineAnalysis = null;
        this.centerPosition = '';
        this.hideAnalysis2d();
      }
    },
    /**
     * 获取二维天际线图表的xy轴信息
     */
    getChartOptions() {
      const {canvas} = this.webGlobe.viewer;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      return this.positions2D.reduce(
          ({x, y}, v) => {
            x.push((1 - v.x / w).toFixed(8))
            y.push((1 - v.y / h).toFixed(8))
            return {
              x,
              y
            }
          },
          {
            x: [],
            y: []
          }
      )
    },
    /**
     * 展示二维天际线
     * todo 绘制完成回调添加二维坐标点 #143
     */
    showAnalysis2d() {
      if (!this.positions2D.length) {
        this.$message.warning('请先进行天际线分析')
      } else {
        this.skyline2dVisible = true;
        this.skyline2dChart.clear();
        this.skyline2dChart.showLoading();
        this.skyline2dChart.setOption(chartOptions(this.getChartOptions()));
        this.skyline2dChart.resize();
        this.skyline2dChart.hideLoading();
      }
    },
    /**
     * 隐藏二维天际线
     */
    hideAnalysis2d() {
      this.skyline2dVisible = false
      this.positions2D = []
    },
    /**
     * 分析结束
     * @param positions2D 二维坐标点
     * @param positions3D 三维坐标点
     */
    analysisEndCallBack({positions2D = [], positions3D}) {
      this.positions2D = positions2D.length ? _cloneDeep(positions2D) : []
    },
    add() {
      this.remove();
      debugger
      let {CesiumZondy, vueKey, vueIndex} = this;
      const {viewer} = this.webGlobe;
      let find = CesiumZondy.SkyLineAnalysisManager.findSource(vueKey, vueIndex);
      let {options} = find;

      // 初始化高级分析功能管理类
      const advancedAnalysisManager = new this.CesiumZondy.Manager.AdvancedAnalysisManager(
          {
            viewer: this.webGlobe.viewer
          }
      )
      // 创建天际线实例
      let skylineAnalysisVal = options.skylineAnalysis;

      skylineAnalysisVal = skylineAnalysisVal || advancedAnalysisManager.createSkyLine();
      skylineAnalysisVal._analysisEndCallBack = this.analysisEndCallBack;
      skylineAnalysisVal.color = this.edgeColor();
      skylineAnalysisVal.lineWidth = this.formData.skylineWidth;
      CesiumZondy.SkyLineAnalysisManager.changeOptions(vueKey, vueIndex, "skyLineAnalysis",skylineAnalysisVal);
      this.setCenterPosition();
    },
    edgeColor() {
      return colorToCesiumColor(
          this.formData.skylineColor,
          this.webGlobe
      )
    },
    /**
     * 二维天际线图表弹框size变化
     * @param mode
     */
    onSkyline2dWindowSize(mode) {
      debugger
      this.$nextTick(() => {
        if (this.skyline2dChart) {
          const width =
              mode === 'max' ? this.$refs.skyline2dChart.clientWidth : 300
          this.skyline2dChart.resize({width})
        }
      })
    },
    /**
     * 设置观察者位置
     */
    setCenterPosition() {
      const position = getCenterPosition(this.webGlobe);
      if (position) {
        const {lng, lat, height} = position
        const lngStr = `${lng.toFixed(4)}°`
        const latStr = `${lat.toFixed(4)}°`
        const heightStr = `${height.toFixed(2)}m`
        this.centerPosition = `${lngStr}，${latStr}，${heightStr}`
      }
    }
  },
}
</script>

<style lang="less" scoped>
//::v-deep .ant-card-body {
//  max-height: 300px;
//  overflow: auto;
//}
.mapgis-widget-skyline-analysis.right {
  position: absolute;
  top: 20px;
  right: 20px;
}

.mapgis-widget-skyline-analysis.left {
  position: absolute;
  top: 20px;
  left: 20px;
}

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
}

#skyline-2d-chart {
  width: 300px;
  height: 230px;
}

.mapgis-widget-skyline-analysis {
  //display: flex;
  //flex-direction: column;
  .skyline-analysis-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    //background: fade($white, 40%);
    z-index: 2;
  }
}

//.mapgis-footer-actions {
//  display: flex;
//  align-items: center;
//  justify-content: flex-end;
//  margin-top: 12px;
//  padding-top: 12px;
//  //border-top: 1px solid $div-border-color;
//  &.center {
//    justify-content: center;
//
//    .ant-btn {
//      margin: 0 4px;
//    }
//  }

  ///deep/ .ant-btn {
  //  margin-left: 8px;
  //}
//}
</style>