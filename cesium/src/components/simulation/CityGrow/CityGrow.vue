<template>
  <mapgis-ui-plot-timeline v-model="sliderValue" :curTimeWidth="curTimeWidth" :max="maxSlider" :min="minSlider"
    :speed="speedValue" :speedStep="1" :minSpeed="minSpeed" :maxSpeed="maxSpeed" :interval="growInterval"
    :intervalOptions="dataFields" :tipFormatter="formatter" :currentTime="String(formatDate(sliderValue))"
    :forwardActive="playBtn" :backActive="backBtn" :pauseActive="suspendBtn" :enableStart="false" :enableEnd="false"
    :disableBackward="true" :disableForward="true" :disablePause="true" :loop="true" @backward="backSetting"
    @pause="suspendSetting" @forward="playSetting" @intervalChange="onFieldChange" @speedChange="onChange"
    @change="onSliderChange"></mapgis-ui-plot-timeline>
</template>

<script>
import moment from "moment";
import { IGSFeatureLayer, Extent, PolygonSymbol3D, ExtrudeSymbol3DLayer, ColorMaterial, Color, RandomRenderer, TimeExtent } from "@mapgis/webclient-common";
import { MapGISFeatureGridCollection } from "@mapgis/webclient-cesium-plugin";
export default {
  name: "mapgis-3d-city-grow",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    baseUrl: {
      type: [String, Object],
      default: null,
    },
    // --------------------矢量文档-----------------
    tileFeaturesCount: {
      type: Number,
      default: 400,
    },
    filter: {
      type: String,
      default: null,
    },
    autoReset: {
      type: Boolean,
      default: true,
    },
    featureStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    formatType: {
      type: String,
      default: "month",
    },
    // 城市生长属性
    growAttributes: {
      type: Object,
      default: () => { }
    },
  },
  watch: {
    featureStyle: {
      handler(next) {
        if (next.startTime) {
          this.minSlider = next.startTime;
          this.sliderValue = this.minSlider
        }
        if (next.endTime) {
          this.maxSlider = next.endTime;
        }
        this.initCityGrowObject();
      },
      deep: true
    },
    formatType: {
      handler(next) {
        this.formatTypeCopy = next;
      },
    },
    // 速度变化时重新执行动画
    speedValue: {
      handler(next) {
        if(this.suspendBtn) {
          return
        }
        this.startGrow()
      },
    },
    playBtn: {
      handler(next) {
        if (next) {
          this.startGrow();
        }
      },
    }
  },
  data() {
    return {
      curTimeWidth: 98,
      sliderValue: 0,
      // 城市生长对应图层
      layer: undefined,
      layerIndex: undefined,
      // 初始化创建城市生长
      initial: true,
      minSlider: 0,
      maxSlider: this.growTime || 60,
      featureStyleCopy: {
        startTimeField: "startTime",
        endTimeField: "endTime",
        displayWithTile: false,
        growTime: 40, //总播放时长 默认40秒  40秒演示完整个播放流程
        updateInterval: 1, // 建筑生长的颜色和高度更新间隔，默认1s更新一次
        buildingsLimit: 200,
        heightRatio: 1,
        colors: ["#fff0f6", "#ff85c0", "#eb2f96"],
      },
      info: "注意：颜色设置只能在城市生长未开启时设置，生长开启后设置颜色无效。",
      // 播放间隔
      growInterval: "月",
      dataFields: ["年", "月", "日"],
      minSpeed: -25,
      maxSpeed: 25,
      speedValue: 1,
      formatTypeCopy: "month",
      clickBtn: false,
      backBtn: false,
      suspendBtn: false,
      playBtn: true,
    };
  },
  created() {
    moment.locale();
  },
  mounted() {
    //加载白膜
    this.mount();
  },
  beforeDestroy() {
    this.unmount();
  },
  methods: {
    mount() {
      this.$emit("loaded", this);
    },
    unmount() {
      let vm = this;
      vm.sliderValue = 0;
      vm.speedValue = 1;
      vm.playBtn = true;
      vm.suspendBtn = false;
    },
    // 改变建筑生长的当前时间
    changeTimeExtent(t) {
      if(!this.featureGridCollection) return
      const { start } = this.featureGridCollection.timeInfo.fullTimeExtent
      this.featureGridCollection.timeExtent = new TimeExtent({
        start,
        end: new Date(t)
      })
    },
    // 初始化城市生长参数
    initCityGrowObject() {
      let vm = this;
      let url = vm.baseUrl;
      let colors = [];
      let times = [];
      let options = {};
      vm.featureStyleCopy = Object.assign(vm.featureStyleCopy, vm.featureStyle);
      this.removeCityGrid()
      const igsFeatureLayer = new IGSFeatureLayer({
        url,
        // url: 'http://192.168.82.91:8089/igs/rest/services/Map/深圳市白模/FeatureServer',
      })
      igsFeatureLayer.load().then(() => {
        vm.featureGridCollection = vm.viewer.scene.primitives.add(new MapGISFeatureGridCollection({
          debugGrid: vm.featureStyleCopy.isGrowHeight,
          maxTileCacheCount: 300, // 最大缓存数
          minimumLevel: 11, // 最小级别
          idField: "FID",
          updateInterval: 20, // 更新时间间隔
          timeInfo: {
            fullTimeExtent: {
              start: new Date(Number(vm.growAttributes.startTime)), // 开始生长时间
              end: new Date(Number(vm.growAttributes.endTime)) // 结束生长时间
            },
            startField: vm.featureStyleCopy.startTimeField, // 开始字段
            endField: vm.featureStyleCopy.endTimeField, // 结束字段
            interval: {
              unit: 'milliseconds',
              value: 1
            }
          },
          timeExtent: {
            start: new Date(Number(vm.growAttributes.startTime)),
            end: new Date(Number(vm.growAttributes.startTime)),
          },
          queryFeaturesByGrid: (grid) => {
            return igsFeatureLayer.queryFeatures({
              sublayerId: '0',
              spatialRel: 'Intersects',
              geometry: Extent.fromJSON(grid.extent.toJSON()),
              resultRecordCount: 40
            }).then((res) => {
              res.features.forEach((feature) => {
                const featureStartTime = parseInt(feature.attributes['startTime'])
                const featureEndTime = parseInt(feature.attributes['endTime'])
                // 不同时间范围筛选出不同颜色的建筑
                const styleItem = vm.featureStyle.colors.find(item => featureStartTime <= item.maxStamp && featureStartTime >= item.minStamp)
                let colorArray
                if (styleItem) {
                  colorArray = styleItem.colorArray
                } else {
                  colorArray = [255, 255, 255, 1]
                }
                feature.attributes['endTime'] = featureEndTime
                feature.attributes['startTime'] = featureStartTime
                // 生产模型随机高度
                feature.symbol = new PolygonSymbol3D({
                  symbolLayers: [
                    // 创建一个三维拉伸区符号突出
                    new ExtrudeSymbol3DLayer({
                      // 覆盖物颜色
                      material: new ColorMaterial({
                        color: new Color(colorArray[0], colorArray[1], colorArray[2], colorArray[3])
                      }),
                      // 拉伸高度
                      size: Math.random() * 100 + 20
                    }),

                  ]
                })
              })
              return Promise.resolve(res.features)
            })

          }
        }))
        const { xmin, ymin, xmax, ymax } = igsFeatureLayer.extent
        const rectangle = new Cesium.Rectangle.fromDegrees(
          xmin,
          ymin,
          xmax,
          ymax
        );
        // 飞到指定范围
        this.viewer.camera.flyTo({
          destination: rectangle
        })
        this.startGrow()
      })

    },
    // 移除城市生长
    removeCityGrid() {
      if (this.featureGridCollection) {
        this.viewer.scene.primitives.remove(this.featureGridCollection)
      }
    },
    // 开始城市生长
    startGrow() {
      const growTime = this.featureStyleCopy.growTime
      const speedValue = this.speedValue
      // 总的生长时间
      const totalTime = parseFloat(growTime * 1000 / speedValue)
      const start = Number(this.growAttributes.startTime)
      const end = Number(this.growAttributes.endTime)
      const step = parseFloat((end - start) / (totalTime / 20))
      // 城市生长动画
      const sliderAnimation = () => {
        this.sliderValue += step
        if (this.sliderValue >= end) {
          this.sliderValue = end
          cancelAnimationFrame(this.raf)
        } else if (this.sliderValue <= start) {
          this.sliderValue = start
          cancelAnimationFrame(this.raf)
        }
        this.raf = requestAnimationFrame(sliderAnimation)
      }
      if (this.raf) {
        cancelAnimationFrame(this.raf)
      }
      sliderAnimation()
    },

    formatter(value) {
      let date = this.formatDate(value);
      return `${date}`;
    },

    formatDate(timestamp) {
      // 时间戳转时间 方法一：
      let time = new Date(timestamp * 1000);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      switch (this.formatTypeCopy) {
        case "year":
          return y;
        case "month":
          return y + "-" + this.addT(m);
        case "day":
          return y + "-" + this.addT(m) + "-" + this.addT(d);
      }
      // 时间戳转时间 方法二：
      // return moment(timestamp).format("YYYY-MM-DD");
    },
    addT(m) {
      return m < 10 ? "0" + m : m;
    },
    onSliderChange(e) {
      this.changeTimeExtent(e);
    },
    onFieldChange(val) {
      let vm = this;
      this.playBtn = true;
      this.backBtn = false;
      this.suspendBtn = false;
      switch (val) {
        case "年":
          this.formatTypeCopy = "year";
          vm.featureStyleCopy.growTime = 20;
          break;
        case "月":
          this.formatTypeCopy = "month";
          vm.featureStyleCopy.growTime = 40;
          break;
        case "日":
          this.formatTypeCopy = "day";
          vm.featureStyleCopy.growTime = 80;
          break;
      }
      this.unmount();
      this.startGrow();
    },
    backSetting() {
      if(this.speedValue > 0) {
        this.speedValue = -this.speedValue;
      }
      this.playBtn = false;
      this.backBtn = true;
      this.suspendBtn = false;
      this.startGrow();
    },
    suspendSetting() {
      if (this.raf) {
        cancelAnimationFrame(this.raf)
      }
      this.playBtn = false;
      this.backBtn = false;
      this.suspendBtn = true;
    },
    playSetting() {
      this.speedValue = Math.abs(this.speedValue);
      this.playBtn = true;
      this.backBtn = false;
      this.suspendBtn = false;
      this.startGrow();
    },
    onChange(value) {
      this.speedValue = value;
    },
  },
};
</script>

<style scoped></style>
