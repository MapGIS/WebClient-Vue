<template>
  <div>
    <slot>
      <mapgis-ui-card
        :class="[
          'ui-card',
          { right: position === 'right', left: position === 'left' }
        ]"
      >
        <div class="mapgis-widget-profile-analysis">
          <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
          <mapgis-ui-setting-form :label-width="72">
            <mapgis-ui-form-item label="剖切线颜色">
              <mapgis-ui-sketch-color-picker
                :color.sync="polylineGroundColorCopy"
                :disableAlpha="true"
              ></mapgis-ui-sketch-color-picker>
            </mapgis-ui-form-item>

            <mapgis-ui-form-item label="采样精度">
              <mapgis-ui-input
                v-model.number="samplePrecisionCopy"
                type="number"
                min="0"
                addon-after="(米)"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="交互点颜色" v-show="!showPolygonCopy">
              <mapgis-ui-sketch-color-picker
                :color.sync="pointColorCopy"
                :disableAlpha="true"
              ></mapgis-ui-sketch-color-picker>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="显示剖面">
              <mapgis-ui-switch size="small" v-model="showPolygonCopy" />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="剖面高度" v-show="showPolygonCopy">
              <mapgis-ui-input
                v-model.number="polygonHeightCopy"
                type="number"
                min="0"
                addon-after="(米)"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="剖面颜色" v-show="showPolygonCopy">
              <mapgis-ui-sketch-color-picker
                :color.sync="polygonColorCopy"
                :disableAlpha="true"
              ></mapgis-ui-sketch-color-picker>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="交互线颜色" v-show="showPolygonCopy">
              <mapgis-ui-sketch-color-picker
                :color.sync="polyLineColorCopy"
                :disableAlpha="true"
              ></mapgis-ui-sketch-color-picker>
            </mapgis-ui-form-item>
          </mapgis-ui-setting-form>
          <mapgis-ui-setting-footer>
            <mapgis-ui-button type="primary" @click="analysis"
              >分析</mapgis-ui-button
            >
            <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
          </mapgis-ui-setting-footer>
        </div>
      </mapgis-ui-card>
    </slot>

    <!-- 二维剖面 -->
    <mapgis-ui-window-wrapper :visible="profile2dVisible">
      <mapgis-ui-window
        :visible.sync="profile2dVisible"
        :min-width="400"
        :max-height="250"
        anchor="bottom-left"
        title="二维剖面"
      >
        <div
          id="profileChart"
          style="width: 380px; height: 180px; float: right"
        ></div>
      </mapgis-ui-window>
    </mapgis-ui-window-wrapper>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import { colorToCesiumColor } from "../WebGlobe/util";
import * as echarts from "echarts";

export default {
  name: "mapgis-3d-analysis-profile",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions,
    profileType: {
      // 分析类型，0代表地形，1代表地形和模型兼容
      type: Number,
      default: 1
    },
    position: {
      type: String,
      default: "left"
    },
    polylineGroundColor: {
      // 剖切线颜色
      type: String,
      default: "rgb(255,0,0)"
    },
    samplePrecision: {
      // 采样精度(采样间隔，平面距离，单位米，模型默认为0.2，地形为2)
      type: Number,
      default: 2
    },
    showPolygon: {
      // 是否显示剖面
      type: Boolean,
      default: false
    },
    pointColor: {
      // 交互点颜色(关闭剖面的时候生效)
      type: String,
      default: "rgb(0,255,0)"
    },
    polyLineColor: {
      // 交互线颜色(开启剖面的时候生效)
      type: String,
      default: "rgb(0,255,0)"
    },
    polygonColor: {
      // 剖面颜色
      type: String,
      default: "rgb(0,0,255)"
    },
    polygonHeight: {
      // 剖面高度
      type: Number,
      default: 100
    }
  },
  watch: {
    polylineGroundColor: {
      handler() {
        this.polylineGroundColorCopy = this.polylineGroundColor;
      }
    },
    samplePrecision: {
      handler() {
        this.samplePrecisionCopy = this.samplePrecision;
      }
    },
    showPolygon: {
      handler() {
        this.showPolygonCopy = this.showPolygon;
      }
    },
    pointColor: {
      handler() {
        this.pointColorCopy = this.pointColor;
      }
    },
    polyLineColor: {
      handler() {
        this.polyLineColorCopy = this.polyLineColor;
      }
    },
    polygonColor: {
      handler() {
        this.polygonColorCopy = this.polygonColor;
      }
    },
    polygonHeight: {
      handler() {
        this.polygonHeightCopy = this.polygonHeight;
      }
    }
  },
  data() {
    return {
      polygonHeightCopy: 100, // 剖面高度
      polygonColorCopy: "rgb(0,0,255)", // 剖面颜色
      polyLineColorCopy: "rgb(0,255,0)", // 交互线颜色(开启剖面的时候生效)
      pointColorCopy: "rgb(0,255,0)", // 交互点颜色(关闭剖面的时候生效)
      polylineGroundColorCopy: "rgb(255,0,0)", // 剖切线颜色
      showPolygonCopy: false, // 是否显示剖面
      samplePrecisionCopy: 2, // 采样精度(采样间隔，平面距离，单位米，模型默认为0.2，地形为2)
      profile2dVisible: false, // 是否显示二维剖面
      depthTestAgainstTerrain: false // 深度检测是否已开启
    };
  },

  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
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
        vm.$emit("load", { component: this });
        CesiumZondy.ProfileAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            profileAnalysis: null
          }
        );
      });
      if (viewer.scene.globe.depthTestAgainstTerrain) {
        this.depthTestAgainstTerrain = true;
      }
    },
    unmount() {
      let { CesiumZondy, vueKey, vueIndex } = this;
      let find = CesiumZondy.ProfileAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        this.remove();
      }
      CesiumZondy.ProfileAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    /**
     * 获取二维剖面设置参数
     */
    getEchartOptions(smooth) {
      const echartsOptions = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: {
              color: "#41aeff",
              type: "solid"
            }
          },
          confine: true, // 是否将 tooltip 框限制在图表的区域内。
          backgroundColor: "rgba(255, 255, 255, 0.8)"
        },
        title: {
          show: false
        },
        grid: {
          top: 25,
          left: 40,
          right: 20,
          bottom: 20,
          contentLabel: false
        },
        calculable: true,
        xAxis: [
          {
            show: false,
            type: "value",
            max: "dataMax"
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              lineStyle: {
                color: "#d9d9d9",
                type: "dotted"
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              formatter(value) {
                const texts = [];
                if (value > 99999) {
                  const text = Number(value).toExponential(1);
                  texts.push(text);
                } else {
                  texts.push(parseInt(value));
                }
                return texts;
              }
            }
          }
        ],
        series: [
          {
            type: "line",
            smooth,
            itemStyle: {
              color: "#40a9ff"
            },
            markPoint: {
              symbol: "circle",
              symbolSize: 15,
              label: { position: "top" },
              data: [
                { type: "max", name: "最高点" },
                { type: "min", name: "最低点" }
              ]
            }
          }
        ]
      };
      return echartsOptions;
    },
    getColor(rgba) {
      return colorToCesiumColor(rgba, this.webGlobe);
    },

    /**
     * 开始分析
     */
    analysis() {
      const { viewer } = this.webGlobe;
      this.profile2dVisible = false;
      if (!this.depthTestAgainstTerrain) {
        viewer.scene.globe.depthTestAgainstTerrain = true;
      }
      const {
        polygonColorCopy,
        polygonHeightCopy,
        polyLineColorCopy,
        pointColorCopy,
        polylineGroundColorCopy,
        showPolygonCopy,
        samplePrecisionCopy
      } = this;
      const pColor = this.getColor(polygonColorCopy);
      const ptColor = this.getColor(pointColorCopy);
      const lColor = this.getColor(polyLineColorCopy);
      const pgColor = this.getColor(polylineGroundColorCopy);
      const { profileType } = this;
      // 地形平滑显示二维剖面，模型取消平滑
      const smooth = this.profileType ? 1 : 0;
      const echartsOptions = this.getEchartOptions(smooth);
      let profileAnalysis = null;
      if (!this.Cesium.defined(profileAnalysis)) {
        profileAnalysis = new this.Cesium.TerrainProfile(viewer, echarts, {
          echartsOptions: echartsOptions,
          polygonColor: pColor,
          polygonHeight: polygonHeightCopy,
          polyLineColor: lColor,
          pointColor: ptColor,
          showPolygon: showPolygonCopy,
          polylineGroundColor: pgColor,
          samplePrecision: samplePrecisionCopy,
          profileType // 0表示只采地形，分析中界面不会卡顿；1表示支持模型和地形，分析中界面会卡顿
        });
      }
      profileAnalysis.profile(this.profileStart, this.profileSuccess);
      const { CesiumZondy, vueKey, vueIndex } = this;
      CesiumZondy.ProfileAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "profileAnalysis",
        profileAnalysis
      );
    },

    /**
     * 开始分析，显示进度条
     */
    profileStart() {},

    /**
     * 分析结束，移除进度条，并显示二维剖面
     */
    profileSuccess() {
      const profileAnalysis = this.getProfileAnalysis();
      // 剖切分析对象存在才显示二维剖面，以防在分析中，点击了清除
      if (profileAnalysis) {
        this.profile2dVisible = true;
      }
    },

    getProfileAnalysis() {
      const { CesiumZondy, vueKey, vueIndex } = this;
      const find = CesiumZondy.ProfileAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      const { options } = find;
      const { profileAnalysis } = options;
      return profileAnalysis;
    },

    remove() {
      const profileAnalysis = this.getProfileAnalysis();
      // 关闭二维剖面显示
      this.profile2dVisible = false;

      // 判断是否已有剖面分析结果
      if (profileAnalysis) {
        // 移除剖面分析显示结果
        profileAnalysis.destroy();
        CesiumZondy.ProfileAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "profileAnalysis",
          null
        );
      }

      // 恢复深度检测设置
      if (!this.depthTestAgainstTerrain) {
        this.webGlobe.viewer.scene.globe.depthTestAgainstTerrain = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
