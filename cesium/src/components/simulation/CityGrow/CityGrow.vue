<template>
  <div>
    <mapgis-ui-card
        size="small"
        hoverable
        :style="{ width: `${width}px` }"
        class="mapgis-city-grow-animationBox">
      <div style="width: 32px;height: 32px;margin: 0 0 0 10px">
        <mapgis-ui-iconfont
            type="mapgis-crosshair"
            :class="['recoverBtn',{'recoverBtnActive':clickBtn === true}]"
            @click.capture.stop="recoverSetting"/>
      </div>
      <div class="animationContainer">
        <div style="position: relative;width: 152px;margin-left: 20px;">
          <span class="sliderline"></span>
          <span class="sliderreduce" @click.capture.stop="reduceSliderVal">-</span>
          <span class="slideradd" @click.capture.stop="addSliderVal">+</span>
          <mapgis-ui-slider
              class="xbsj-slider"
              :default-value="sliderDefaultVal"
              :tooltip-visible="false"
              :step="0.01"
              :min="minSpeed"
              :max="maxSpeed"
              v-model="speedValue"
              @change="onChange"
          />
        </div>
        <span style="display: inline-block; width: 64px; line-height: 32px; margin-left: 6px;">{{ growSpeed }}</span>
        <div>
          <mapgis-ui-iconfont type="mapgis-arrow-left-filling"
                              :class="['backbtn',{'backbtnactive':backBtn === true}]"
                              @click.capture.stop="backSetting"/>
        </div>
        <div>
          <mapgis-ui-iconfont type="mapgis-pause"
                              :class="['suspendbtn',{'suspendbtnactive':suspendBtn === true}]"
                              @click.capture.stop="suspendSetting"/>
        </div>
        <div>
          <mapgis-ui-iconfont type="mapgis-arrow-right-filling"
                              :class="['playbtn',{'playbtnactive': playBtn === true}]"
                              @click.capture.stop="playSetting"/>
        </div>
        <span style="display: inline-block; line-height: 32px; margin-left: 20px;font-size: 19px">{{ formatDate(sliderValue) }}</span>
        <div style="position: absolute;right: 10px">
          <span style="display: inline-block; line-height: 32px; padding: 0 7px 0 15px">播放间隔:</span>
          <mapgis-ui-select v-model="growInterval" size="default" style="height: 30px"
                            @change="val => onFieldChange(val)">
            <mapgis-ui-select-option v-for="item in dataFields" :key="item">
              {{ item }}
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </div>
      </div>
      <div  :style="{ width: `${width-20}px` }">
        <mapgis-ui-slider
            class="mapgis-city-grow-slider"
            :tip-formatter="formatter"
            :min="minSlider"
            :max="maxSlider"
            v-model="sliderValue"
            @change="onSliderChange"></mapgis-ui-slider>
      </div>
    </mapgis-ui-card>
  </div>
</template>

<script>
import moment from "moment";
import {deepEqual} from "../../Utils/deepequal";

export default {
  name: "mapgis-3d-city-grow",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    width: {
      type: Number,
      default: 500
    },
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
    growSpeed:{
      handler(next){
        let vm = this;
        let speed = parseFloat(next);
        if (vm.layer) {
          vm.layer.setCityGrowPlayRate(speed);
        }
      }
    },
    speedValue:{
      handler(next){
        if (!this.suspendBtn){
          if (next >= this.middleSpeed){
            this.playBtn = true;
            this.backBtn = false;
            this.suspendBtn = false;
          } else {
            this.playBtn = false;
            this.backBtn = true;
            this.suspendBtn = false;
          }
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
    backBtn:{
      handler(next){
        if (next){
          this.startGrow()
        }
      }
    }
  },
  data() {
    return {
      // 符号标记
      isStartGrow: false,
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
      showColorSetting: false,
      tooltipVisible: true,
      // 播放间隔
      growInterval: "月",
      dataFields: ['年', '月', '日'],
      placeholder1: '月',
      // 倍速播放
      growSpeed: '1x',
      sliderDefaultVal: 26,
      minSpeed:0,
      maxSpeed:50,
      middleSpeed:25,
      speedValue: 26,
      speedOptions: ['2.5x', '2x', '1.5x', '1.2x', '1x', '0.5x'],
      placeholder2: '1x',
      formatTypeCopy: 'month',
      clickBtn: false,
      backBtn: false,
      suspendBtn:false,
      playBtn:true
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
      vm.isStartGrow = false;
      vm.sliderValue = 0;
      vm.growSpeed = '1x';
      vm.speedValue = vm.middleSpeed + 1;
      vm.playBtn = true;
      vm.suspendBtn = false;
    },
    initCityGrowObject() {
      let vm = this;
      // if (vm.sliderValue === 0) {
      //   vm.initial = true
      // } else {
      //   vm.initial = false
      // }
      // if (vm.initial) {
        let url = vm.baseUrl;
        let colors = [];
        let times = [];
        let options = {};
        //始终显示时间
        // vm.tooltipVisible = true;
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
      vm.isStartGrow = true;
      if (vm.layer && vm.startTimeCopy && vm.endTimeCopy) {
        vm.layer.cityGrowPlay();
      }
    },
    //暂停生长
    stopGrow() {
      let vm = this;
      vm.isStartGrow = false;
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
      if (vm.layer) {
        vm.layer.cityGrowSetTime(e, false);
      }
    },
    onFieldChange(val) {
      let vm = this
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
    recoverSetting() {
      this.clickBtn = true;
      this.growSpeed = '1x';
      this.speedValue = this.middleSpeed + 1;
    },
    backSetting() {
      this.backBtn = true;
      this.suspendBtn = false;
      this.playBtn = false;
      this.growSpeed = -Math.abs(parseFloat(this.growSpeed)) +'x';
      this.speedValue = this.middleSpeed + parseFloat(this.growSpeed);
    },
    suspendSetting() {
      const vm = this;
      this.suspendBtn = true;
      this.backBtn = false;
      this.playBtn = false;
      vm.isStartGrow = false;
      if (vm.layer) {
        vm.layer.cityGrowStop();
      }
    },
    playSetting() {
      this.playBtn = true;
      this.backBtn = false;
      this.suspendBtn = false;
      this.growSpeed = Math.abs(parseFloat(this.growSpeed)) +'x';
      this.speedValue = this.middleSpeed + parseFloat(this.growSpeed);
    },
    onChange(value) {
      const vm = this;
      let speed;
      vm.middleSpeed = (vm.maxSpeed - vm.minSpeed)/2;
      this.clickBtn = false;
      switch (true) {
        case value === vm.middleSpeed:
          speed = 0 + 'x';
          break;
        case value > vm.middleSpeed:
          speed = (value - vm.middleSpeed).toFixed(2) + 'x';
          break;
        case value < vm.middleSpeed:
          speed = -(vm.middleSpeed - value).toFixed(2) + 'x';
      }
      this.growSpeed = speed;
    },
    addSliderVal() {
      const vm = this;
      this.clickBtn = false;
      if (this.growSpeed !== (vm.middleSpeed +'x') && this.growSpeed !== '0x') {
        this.growSpeed = parseFloat(this.growSpeed) + 1 + 'x';
      } else if (this.growSpeed === '0x') {
        this.growSpeed = '1x';
      }
      this.speedValue++;
    },
    reduceSliderVal() {
      const vm = this;
      this.clickBtn = false;
      if (this.growSpeed !== (-vm.middleSpeed +'x') && this.growSpeed !== '0x') {
        this.growSpeed = parseFloat(this.growSpeed) - 1 + 'x';
      } else if (this.growSpeed === '0x') {
        this.growSpeed = '-1x';
      }
      this.speedValue--;
    }
  }
}
</script>

<style scoped>
/*.mapgis-city-grow {*/
/*  position: absolute;*/
/*  left: 10px;*/
/*  bottom: 10px;*/
/*  margin: 0px auto;*/
/*}*/

.mapgis-city-grow-toolbar > .anticon {
  font-size: 22px;
}

.mapgis-ui-card-small > .mapgis-ui-card-body {
  padding: 6px 12px;
}

.mapgis-city-grow-slider {
  width: 100%;
}

::v-deep .mapgis-ui-select-panel {
  padding: 0px !important;
}


.mapgis-city-grow-animationBox {
  position: absolute;
  height: 62px;
  bottom: 10px;
  left: 10px;
  display: flex;
  padding: 0 !important;
}

::v-deep .mapgis-ui-card-small > .mapgis-ui-card-body {
  padding: 0 5px;
  display: flex;
  flex-wrap: wrap;
}

.recoverBtn {
  font-size: 32px;
  border: none
}

.recoverBtnActive {
  color: #0081e2;
}

.animationContainer {
  display: flex;
  /*width: 676px;*/
  height: 30px;
}

.sliderline {
  position: absolute;
  left: 50%;
  top: 6px;
  display: inline-block;
  width: 1px;
  height: 18px;
  background-color: hsl(0deg 17% 20% / 79%);
  z-index: 100;
  cursor: pointer;
}

.sliderreduce {
  left: 10px;
  position: absolute;
  top: 0;
  font-size: 17px;
  color: hsl(0deg 17% 20% / 79%);
  z-index: 100;
  user-select: none;
  cursor: pointer;
}

.slideradd {
  right: 10px;
  line-height: 26px;
  position: absolute;
  top: 0;
  font-size: 17px;
  color: hsl(0deg 17% 20% / 79%);
  z-index: 100;
  user-select: none;
  cursor: pointer;
}

.xbsj-slider {
  line-height: normal;
}

.backbtn, .playbtn, .suspendbtn {
  font-size: 26px;
  margin-top: 3px;
  border-radius: 4px;
  cursor: pointer;
}

.suspendbtn {
  margin-left: 35px;
}

.playbtn {
  margin-left: 35px;
}

.backbtnactive, .playbtnactive, .suspendbtnactive {
  background-color: #33333347 !important;
  color: #0081e2;
}


::v-deep .xbsj-slider >.mapgis-ui-select-selection--single {
  height: 30px;
}

::v-deep .mapgis-ui-slider {
  margin: 4px 6px 4px;
  padding: unset;
}

::v-deep .xbsj-slider >.mapgis-ui-slider-handle {
  border: unset;
  border-radius: 0;
  width: 6px;
  height: 22px;
  background: url("./slider.png");
  background-size: contain;
  outline: 0;
  margin-top: 0px;
}

::v-deep .xbsj-slider >.mapgis-ui-slider-rail {
  height: 22px;
}

::v-deep .xbsj-slider >.mapgis-ui-slider-track {
  height: 22px;
  background-color: unset;
}

::v-deep .mapgis-ui-slider:hover .mapgis-ui-slider-track{
  background-color: unset;
}
</style>