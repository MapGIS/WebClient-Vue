<template>
  <div>
    <slot>
      <div class="mapgis-widget-profile-analysis">
        <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
        <mapgis-ui-setting-form 
          :layout="layout"
          size="default"
        >
          <mapgis-ui-form-item label="剖切线颜色">
            <mapgis-ui-sketch-color-picker
              :color.sync="polylineGroundColorCopy"
              :disableAlpha="true"
            ></mapgis-ui-sketch-color-picker>
          </mapgis-ui-form-item>

          <mapgis-ui-form-item label="采样精度">
            <mapgis-ui-input-number-addon
              v-model.number="samplePrecisionCopy"
              min="0"
              addon-after="米"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-form-item label="交互点颜色" v-show="!showPolygonCopy">
            <mapgis-ui-sketch-color-picker
              :color.sync="pointColorCopy"
              :disableAlpha="true"
            ></mapgis-ui-sketch-color-picker>
          </mapgis-ui-form-item>
          <mapgis-ui-switch-panel label="显示剖切面" v-model="showPolygonCopy" size="default" >
            <mapgis-ui-form-item label="剖切面高度" v-show="showPolygonCopy">
              <mapgis-ui-input
                v-model.number="polygonHeightCopy"
                type="number"
                min="0"
                addon-after="(米)"
              />
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="剖切面颜色" v-show="showPolygonCopy">
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
          </mapgis-ui-switch-panel>
        </mapgis-ui-setting-form>
        <mapgis-ui-setting-footer>
          <mapgis-ui-button type="primary" @click="analysis"
            >分析</mapgis-ui-button
          >
          <mapgis-ui-button @click="remove">清除</mapgis-ui-button>
        </mapgis-ui-setting-footer>
      </div>
    </slot>
    <mapgis-ui-mask
      v-if="useMask"
      :parentDivClass="'cesium-map-wrapper'"
      :loading="maskShow"
      :text="maskText"
    ></mapgis-ui-mask>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import {
  colorToCesiumColor,
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable
} from "../WebGlobe/util";
import * as echarts from "echarts";

export default {
  name: "mapgis-3d-analysis-profile",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
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
     * @default 1
     * @description 分析类型，0代表地形，1代表地形和模型兼容
     */
    profileType: { type: Number, default: 1 },
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
          toolbox: {
            feature: {
              saveAsImage: {
                type: "png",
                show: true,
                title: "保存为图片"
              },
              restore: { show: true, title: "刷新" }
            }
          },
          grid: {
            top: 25,
            left: 60,
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
                  if (value > 999) {
                    const text = (Number(value) / 1000).toFixed(2);
                    texts.push(`${text}km`);
                  } else {
                    texts.push(`${parseInt(value)}m`);
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
              },
              areaStyle: {}
            }
          ]
        };
        return echartsOptions;
      }
    },
    /**
     * @type Boolean
     * @default true
     * @description 是否使用内置的遮罩层
     */
    useMask: {
      type: Boolean,
      default: true
    },
    /**
     * @type String
     * @required true
     * @description 剖面信息显示容器的id
     */
    echartsDivId: {
      type: String,
      required: true
    }
  },
  watch: {
    polylineGroundColor: {
      handler() {
        this.polylineGroundColorCopy = this.polylineGroundColor;
      },
      immediate: true
    },
    samplePrecision: {
      handler() {
        this.samplePrecisionCopy = this.samplePrecision;
      },
      immediate: true
    },
    showPolygon: {
      handler() {
        this.showPolygonCopy = this.showPolygon;
      },
      immediate: true
    },
    pointColor: {
      handler() {
        this.pointColorCopy = this.pointColor;
      },
      immediate: true
    },
    polyLineColor: {
      handler() {
        this.polyLineColorCopy = this.polyLineColor;
      },
      immediate: true
    },
    polygonColor: {
      handler() {
        this.polygonColorCopy = this.polygonColor;
      },
      immediate: true
    },
    polygonHeight: {
      handler() {
        this.polygonHeightCopy = this.polygonHeight;
      },
      immediate: true
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
      isDepthTestAgainstTerrainEnable: undefined, // 深度检测是否已开启，默认为undefined，当这个值为undefined的时候，说明没有赋值，不做任何处理
      maskShow: false,
      maskText: "正在分析中, 请稍等...",
      profileeChart: undefined
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
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
        vueCesium.ProfileAnalysisManager.addSource(
          vueKey,
          vueIndex,
          dataSource,
          {
            profileAnalysis: null
          }
        );
      });
      this.profileeChart = echarts.init(
        document.getElementById(this.echartsDivId)
      );
    },
    unmount() {
      const profileAnalysis = this._getProfileAnalysis();
      if (profileAnalysis) {
        this.remove();
      }
      const { vueCesium, vueKey, vueIndex } = this;
      vueCesium.ProfileAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    /**
     * @description 获取剖面分析对象
     * @return 剖面分析对象
     */
    _getProfileAnalysis() {
      const { vueCesium, vueKey, vueIndex } = this;
      const find = vueCesium.ProfileAnalysisManager.findSource(
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
      return colorToCesiumColor(rgba);
    },
    /**
     * @description 开始分析
     */
    analysis() {
      this.isDepthTestAgainstTerrainEnable = isDepthTestAgainstTerrainEnable(
        this.viewer
      );
      if (!this.isDepthTestAgainstTerrainEnable) {
        // 如果深度检测没有开启，则开启
        setDepthTestAgainstTerrainEnable(true, this.viewer);
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
      this.profileeChart.setOption(echartsOptions);
      if (!this.Cesium.defined(profileAnalysis)) {
        profileAnalysis = new this.Cesium.TerrainProfile(this.viewer, {
          polygonColor: pColor,
          polygonHeight: polygonHeightCopy,
          polyLineColor: lColor,
          pointColor: ptColor,
          showPolygon: showPolygonCopy,
          polylineGroundColor: pgColor,
          samplePrecision: samplePrecisionCopy,
          profileType, // 0表示只采地形，分析中界面不会卡顿；1表示支持模型和地形，分析中界面会卡顿
          echart: this.profileeChart
        });
      }
      profileAnalysis.profile(this._profileStart, this._profileSuccess);
      const { vueCesium, vueKey, vueIndex } = this;
      vueCesium.ProfileAnalysisManager.changeOptions(
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
      this.maskShow = true;
      this.$emit("start");
    },
    /**
     * @description 分析结束回调函数
     */
    _profileSuccess() {
      this.maskShow = false;
      this.$emit("success");
    },
    /**
     * @description 恢复深度检测设置
     */
    _restoreDepthTestAgainstTerrain() {
      if (
        this.isDepthTestAgainstTerrainEnable !== undefined &&
        this.isDepthTestAgainstTerrainEnable !==
          isDepthTestAgainstTerrainEnable(this.viewer)
      ) {
        setDepthTestAgainstTerrainEnable(
          this.isDepthTestAgainstTerrainEnable,
          this.viewer
        );
      }
    },
    /**
     * @description 移除剖面分析结果，关闭二维剖面显示，恢复深度检测设置
     */
    remove() {
      const profileAnalysis = this._getProfileAnalysis();
      const { vueCesium, vueKey, vueIndex } = this;

      // 判断是否已有剖面分析结果
      if (profileAnalysis) {
        // 移除剖面分析显示结果
        profileAnalysis.destroy();
        vueCesium.ProfileAnalysisManager.changeOptions(
          vueKey,
          vueIndex,
          "profileAnalysis",
          null
        );
      }

      this._restoreDepthTestAgainstTerrain();
      this.maskShow = false;
      this.$emit("remove");
    }
  }
};
</script>
