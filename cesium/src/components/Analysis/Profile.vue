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
    /**
     * @type Number
     * @default 1
     * @description 分析类型，0代表地形，1代表地形和模型兼容
     */
    profileType: { type: Number, default: 1 },
    /**
     * @type String
     * @default "right"
     * @description 分析面板的位置
     */
    position: {
      type: String,
      default: "right"
    },
    /**
     * @type String
     * @default "rgb(255,0,0)"
     * @description 剖切线颜色
     */
    polylineGroundColor: {
      type: String,
      default: "rgb(255,0,0)"
    },
    /**
     * @type Number
     * @default 2
     * @description 采样精度(采样间隔，平面距离，单位米，模型推荐为0.2，地形推荐为2)
     */
    samplePrecision: {
      type: Number,
      default: 2
    },
    /**
     * @type Boolean
     * @default false
     * @description 是否显示剖面
     */
    showPolygon: {
      type: Boolean,
      default: false
    },
    /**
     * @type String
     * @default "rgb(0,255,0)"
     * @description 交互点颜色(关闭剖面的时候生效)
     */
    pointColor: {
      type: String,
      default: "rgb(0,255,0)"
    },
    /**
     * @type String
     * @default "rgb(0,255,0)"
     * @description 交互线颜色(开启剖面的时候生效)
     */
    polyLineColor: {
      type: String,
      default: "rgb(0,255,0)"
    },
    /**
     * @type String
     * @default "rgb(0,0,255)"
     * @description 剖面颜色
     */
    polygonColor: {
      type: String,
      default: "rgb(0,0,255)"
    },
    /**
     * @type Number
     * @default 100
     * @description 剖面高度
     */
    polygonHeight: {
      type: Number,
      default: 100
    },
    /**
     * @type Object
     * @description 二维剖面显示样式
     */
    echartsOptions: {
      type: Object,
      default: () => {
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
                formatter: value => {
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
              smooth: true, // 建议地形平滑显示二维剖面，模型取消平滑
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
      }
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
      samplePrecisionCopy: 2, // 采样精度(采样间隔，平面距离，单位米，模型推荐为0.2，地形推荐为2)
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
        vm.$emit("load", vm);
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
      const profileAnalysis = this._getProfileAnalysis();
      if (profileAnalysis) {
        this.remove();
      }
      const { CesiumZondy, vueKey, vueIndex } = this;
      CesiumZondy.ProfileAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    /**
     * @description 获取剖面分析对象
     * @return 剖面分析对象
     */
    _getProfileAnalysis() {
      const { CesiumZondy, vueKey, vueIndex } = this;
      const find = CesiumZondy.ProfileAnalysisManager.findSource(
        vueKey,
        vueIndex
      );
      const { options } = find;
      const { profileAnalysis } = options;
      return profileAnalysis;
    },
    /**
     * @description rgba值转cesium内部color对象
     * @param rgba - {String} rgba值
     * @return {Object} cesium内部color对象
     */
    _getColor(rgba) {
      return colorToCesiumColor(rgba, this.webGlobe);
    },
    /**
     * @description 开始分析
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
        samplePrecisionCopy,
        echartsOptions
      } = this;
      const pColor = this._getColor(polygonColorCopy);
      const ptColor = this._getColor(pointColorCopy);
      const lColor = this._getColor(polyLineColorCopy);
      const pgColor = this._getColor(polylineGroundColorCopy);
      const { profileType } = this;
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
      profileAnalysis.profile(this._profileStart, this._profileSuccess);
      const { CesiumZondy, vueKey, vueIndex } = this;
      CesiumZondy.ProfileAnalysisManager.changeOptions(
        vueKey,
        vueIndex,
        "profileAnalysis",
        profileAnalysis
      );
    },
    /**
     * @description 绘制结束后回调函数，表示cesium内部开始启用分析功能
     */
    _profileStart() {
      this.$emit("start");
    },
    /**
     * @description 分析结束回调函数
     */
    _profileSuccess() {
      this.$emit("success");
      const profileAnalysis = this._getProfileAnalysis();
      // 剖面分析对象存在才显示二维剖面，以防在分析中，点击了清除
      if (profileAnalysis) {
        this.profile2dVisible = true;
      }
    },
    /**
     * @description 移除剖面分析结果，关闭二维剖面显示，恢复深度检测设置
     */
    remove() {
      const profileAnalysis = this._getProfileAnalysis();
      // 关闭二维剖面显示
      this.profile2dVisible = false;
      const { CesiumZondy, vueKey, vueIndex } = this;

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
