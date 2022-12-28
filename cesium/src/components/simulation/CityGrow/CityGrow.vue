<template>
      <mapgis-ui-plot-timeline
          v-model="sliderValue"
          :curTimeWidth="curTimeWidth"
          :max="maxSlider"
          :min="minSlider"
          :speed="speedValue"
          :speedStep="1"
          :minSpeed="minSpeed"
          :maxSpeed="maxSpeed"
          :interval="growInterval"
          :intervalOptions="dataFields"
          :tipFormatter="formatter"
          :currentTime="String(formatDate(sliderValue))"
          :forwardActive="playBtn"
          :backActive="backBtn"
          :pauseActive="suspendBtn"
          :enableStart="false"
          :enableEnd="false"
          :disableBackward="true"
          :disableForward="true"
          :disablePause="true"
          :loop="true"
          @backward="backSetting"
          @pause="suspendSetting"
          @forward="playSetting"
          @intervalChange="onFieldChange"
          @speedChange="onChange"
          @change="onSliderChange"
      ></mapgis-ui-plot-timeline>
</template>

<script>
import moment from "moment";
import {deepEqual} from "../../Utils/deepequal";

export default {
  name: "mapgis-3d-city-grow",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    baseUrl: {
      type: [String, Object],
      default: null
    },
    // --------------------矢量文档-----------------
    tileFeaturesCount: {
      type: Number,
      default: 400
    },
    filter: {
      type: String,
      default: null
    },
    autoReset: {
      type: Boolean,
      default: true
    },
    featureStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    formatType: {
      type: String,
      default: "month"
    }
  },
  watch: {
    featureStyle: {
      handler(next) {
        if (next.startTime) {
          this.startTimeCopy = this.formatDate(next.startTime);
          this.minSlider = next.startTime;
        }
        if (next.endTime) {
          this.endTimeCopy = this.formatDate(next.endTime);
          this.maxSlider = next.endTime;
        }
        if (!deepEqual(next.colors, this.featureStyleCopy.colors)) {
          this.unmount();
        }
        this.initCityGrowObject();
      },
      deep: true,
      immediate: true
    },
    formatType: {
      handler(next) {
        this.formatTypeCopy = next;
      }
    },
    speedValue:{
      handler(next){
        let vm = this;
        if (vm.layer) {
          vm.layer.setCityGrowPlayRate(next);
        }
          if (next > 0){
            this.playBtn = true;
            this.backBtn = false;
            this.suspendBtn = false;
          } else if (next<0){
            this.playBtn = false;
            this.backBtn = true;
            this.suspendBtn = false;
          } else {
            this.playBtn = false;
            this.backBtn = false;
            this.suspendBtn = true;
          }
      }
    },
    playBtn:{
      handler(next){
        if (next){
          this.startGrow()
        }
      }
    },
  },
  data() {
    return {
      curTimeWidth:98,
      startTimeCopy: '',
      endTimeCopy: '',
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
        growTime: 60, //总播放时长 默认60秒  60秒演示完整个播放流程
        updateInterval: 1, // 建筑生长的颜色和高度更新间隔，默认1s更新一次
        buildingsLimit: 200,
        heightRatio: 1,
        colors: ["#fff0f6", "#ff85c0", "#eb2f96"]
      },
      info: "注意：颜色设置只能在城市生长未开启时设置，生长开启后设置颜色无效。",
      // 播放间隔
      growInterval: "月",
      dataFields: ['年', '月', '日'],
      minSpeed: -25,
      maxSpeed: 25,
      speedValue: 1,
      formatTypeCopy: 'month',
      clickBtn: false,
      backBtn: false,
      suspendBtn: false,
      playBtn: true
    }
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
      if (this.Cesium.defined(vm.layerIndex)) {
        this.viewer.scene.layers.removeVectorLayerByID(vm.layerIndex);
      }
      vm.sliderValue = 0;
      vm.speedValue = 1;
      vm.playBtn = true;
      vm.suspendBtn = false;
    },
    initCityGrowObject() {
      let vm = this;
      let url = vm.baseUrl;
      let colors = [];
      let times = [];
      let options = {};

      vm.featureStyleCopy = Object.assign(vm.featureStyleCopy, vm.featureStyle);
      let cityGrowOptions = {
        heightField: vm.featureStyleCopy.heightField,
        heightRatio: vm.featureStyleCopy.heightRatio,
        startTimeField: vm.featureStyleCopy.startTimeField,
        endTimeField: vm.featureStyleCopy.endTimeField,
        startTime: vm.featureStyleCopy.startTime,
        endTime: vm.featureStyleCopy.endTime,
        buildingsLimit: vm.featureStyleCopy.buildingsLimit,
        updateInterval: vm.featureStyleCopy.updateInterval,
        playTime: vm.featureStyleCopy.growTime,
        colorSampling: false,
        updateHeight: vm.featureStyleCopy.isGrowHeight,
        replay: true,
        displayWithTile: vm.featureStyleCopy.displayWithTile,
        onReady: function (timeControl) {
          let startTime = timeControl.startTime;
          let endTime = timeControl.endTime;
          vm.startTimeCopy = vm.formatDate(startTime);
          vm.minSlider = startTime;
          vm.endTimeCopy = vm.formatDate(endTime);
          vm.maxSlider = endTime;
          vm.startGrow();
          // if (!vm.featureStyleCopy.startTime || !vm.featureStyleCopy.endTime){
          //   vm.startGrow();
          // }
        },
        onUpdate: function (currentPlayTime, currentTimeStamp) {
          vm.timeSliderPlay(currentPlayTime, currentTimeStamp);
        }
      };
      if (vm.featureStyleCopy.colors) {
        for (let i = 0; i < vm.featureStyleCopy.colors.length; i++) {
          let color = this.Cesium.Color.fromCssColorString(vm.featureStyleCopy.colors[i]);
          colors.push(color);
        }
        cityGrowOptions.colors = colors
      }
      if (vm.featureStyleCopy.times) {
        for (let j = 0; j < vm.featureStyleCopy.times.length; j++) {
          let timestamp = new Date(vm.featureStyleCopy.times[j], 1, 1).valueOf() / 1000;
          times.push(timestamp);
        }
        cityGrowOptions.times = times
      }

      if (vm.featureStyleCopy.displayWithTile) {
        options.tileFeaturesCount = vm.tileFeaturesCount;
      } else {
        cityGrowOptions.buildingsLimit = vm.featureStyleCopy.buildingsLimit;
      }
      let style = {
        type: 'cityGrow',
        styleOptions: cityGrowOptions
      };
      options = {autoReset: vm.autoReset, style: style};

      vm.viewer.scene.layers.appendVectorLayer(url, {
        ...options,
        getDocLayerIndexes: function (indexs) {
          vm.layerIndex = indexs[0];
          vm.layer = vm.viewer.scene.layers.getLayer(vm.layerIndex);
          vm.$emit("CityGrow", vm.layer);
          vm.startGrow();
        }
      });
      // }
    },
    //开始加载
    startGrow() {
      let vm = this;
      if (vm.layer && vm.startTimeCopy && vm.endTimeCopy) {
        vm.layer.cityGrowPlay();
      }
    },
    //暂停生长
    stopGrow() {
      let vm = this;
      if (vm.layer) {
        vm.layer.cityGrowStop();
      }
    },
    //时间轴播放效果：
    timeSliderPlay(currentPlayTime, currentTimeStamp) {
      let vm = this;
      //已知当前播放秒数和当前城市建筑的时间戳
      //slider绑定的sliderValue随之增加
      vm.sliderValue = currentTimeStamp;
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
          return y + '-' + this.addT(m);
        case "day":
          return y + '-' + this.addT(m) + '-' + this.addT(d);
      }
      // 时间戳转时间 方法二：
      // return moment(timestamp).format("YYYY-MM-DD");

    },
    addT(m) {
      return m < 10 ? '0' + m : m
    },
    onSliderChange(e) {
      let vm = this;
      if (vm.layer && e) {
        vm.layer.cityGrowSetTime(e, false);
      }
    },
    onFieldChange(val) {
      let vm = this
      this.playBtn = true;
      this.backBtn = false;
      this.suspendBtn = false;
      let startDate = new Date(vm.minSlider * 1000);
      let endDate = new Date(vm.maxSlider * 1000);
      let years = (endDate.getFullYear() - startDate.getFullYear());
      switch (val) {
        case "年":
          this.formatTypeCopy = 'year';
          vm.featureStyleCopy.growTime = years;
          break;
        case "月":
          this.formatTypeCopy = 'month';
          let months = (years * 365) / 30;
          vm.featureStyleCopy.growTime = months;
          break;
        case "日":
          this.formatTypeCopy = 'day';
          vm.featureStyleCopy.growTime = (years * 365);
          break;
      }
      this.unmount();
      this.initCityGrowObject();
    },
    onSpeedChange(val) {
      let vm = this;
      let speed = parseFloat(val);
      if (vm.layer) {
        vm.layer.setCityGrowPlayRate(speed);
      }
    },
    backSetting() {
      this.startGrow();
      this.speedValue = -this.speedValue;
    },
    suspendSetting() {
      const vm = this;
      if (vm.layer) {
        vm.layer.cityGrowStop();
      }
      this.playBtn = false;
      this.backBtn = false;
      this.suspendBtn = true;
    },
    playSetting() {
      this.startGrow();
      this.speedValue = Math.abs(this.speedValue);
    },
    onChange(value) {
      this.speedValue = value;
    }
  }
}
</script>

<style scoped>
</style>