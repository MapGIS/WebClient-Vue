<template>
  <div>
    <mapgis-ui-card
        size="small"
        hoverable
        :style="{ width: `${width}px` }"
        class="mapgis-city-grow"
    >
      <mapgis-ui-slider
          :style="{ width: width }"
          :tip-formatter="formatter"
          :min="minSlider"
          :max="maxSlider"
          v-model="sliderValue"
          @change="onSliderChange"></mapgis-ui-slider>
      <span class="mapgis-city-grow-starttime" v-if="startTimeCopy!==''">起始时间:{{ startTimeCopy }}</span>
      <div class="mapgis-city-grow-toolbar">
        <mapgis-ui-iconfont type="mapgis-chevrons-left"/>
        <mapgis-ui-iconfont type="mapgis-chevron-left"/>
        <mapgis-ui-iconfont
            v-if="!isStartGrow"
            type="mapgis-play-circle-fill"
            class="mapgis-city-grow-toolbar-main"
            @click.capture.stop="startGrow"
        />
        <mapgis-ui-iconfont
            v-else
            type="mapgis-zanting"
            class="mapgis-city-grow-toolbar-main"
            @click.capture.stop="stopGrow"
        />
        <mapgis-ui-iconfont type="mapgis-chevron-right"/>
        <mapgis-ui-iconfont type="mapgis-chevrons-right"/>
      </div>
      <span class="mapgis-city-grow-endtime" v-if="endTimeCopy!==''">结束时间:{{ endTimeCopy }}</span>
    </mapgis-ui-card>
  </div>
</template>

<script>
import moment from "moment";

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
    tileFeaturesCount:{
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
      default(){
        return {}
      }
    },
    // featureStyle: {
    //   type: Object,
    //   default:() => {
    //     return {
    //       displayWithTile:false,
    //       growTime:60, //总播放时长 默认60秒  60秒演示完整个播放流程
    //       updateInterval:1, // 建筑生长的颜色和高度更新间隔，默认1s更新一次
    //       colors:["#fff0f6","#ff85c0","#eb2f96"],
    //       buildingsLimit:200,
    //       heightRadio:1
    //       //必传项 startTimeField、endTimeField、heightField
    //     }
    //   }
    // }
  },
  watch: {
    featureStyle:{
      handler(next){
        if (next.startTime){
          this.startTimeCopy = this.formatDate(next.startTime);
          this.minSlider = next.startTime;
        }
        if (next.endTime){
          this.endTimeCopy = this.formatDate(next.endTime);
          this.maxSlider = next.endTime;
        }
      },
      deep: true,
      immediate: true
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
      layerIndex:undefined,
      // 初始化创建城市生长
      initial: true,
      minSlider: 0,
      maxSlider: this.growTime || 60,
      featureStyleCopy:{
        startTimeField:"startTime",
        endTimeField:"endTime",
        displayWithTile:false,
        growTime:60, //总播放时长 默认60秒  60秒演示完整个播放流程
        updateInterval:1, // 建筑生长的颜色和高度更新间隔，默认1s更新一次
        colors:["#fff0f6","#ff85c0","#eb2f96"],
        buildingsLimit:200,
        heightRadio:1
      },
      info: "注意：颜色设置只能在城市生长未开启时设置，生长开启后设置颜色无效。",
      showColorSetting: false
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
    mount(){
      this.$emit("loaded", this);
    },
    unmount(){
      let vm  = this;
      if (this.Cesium.defined(vm.layerIndex)) {
        this.viewer.scene.layers.removeVectorLayerByID(vm.layerIndex);
      }
    },
    //开始加载
    startGrow() {
      let vm = this;
      vm.isStartGrow = true;
      if (vm.sliderValue === 0) {
        vm.initial = true
      } else {
        vm.initial = false
      }
      if (vm.initial) {
        let url = vm.baseUrl;
        let colors = [];
        let options = {};
        vm.featureStyleCopy = Object.assign(vm.featureStyleCopy,vm.featureStyle);
        for (let i = 0; i < vm.featureStyleCopy.colors.length; i++) {
          let color = this.Cesium.Color.fromCssColorString(vm.featureStyleCopy.colors[i]);
          colors.push(color);
        }
        let cityGrowOptions = {
          heightField: vm.featureStyleCopy.heightField,
          heightRatio: vm.featureStyleCopy.heightRadio,
          startTimeField: vm.featureStyleCopy.startTimeField,
          endTimeField: vm.featureStyleCopy.endTimeField,
          startTime: vm.featureStyleCopy.startTime,
          endTime: vm.featureStyleCopy.endTime,
          buildingsLimit: vm.featureStyleCopy.buildingsLimit,
          updateInterval: vm.featureStyleCopy.updateInterval,
          playTime: vm.featureStyleCopy.growTime,
          colors: colors,
          colorSampling: false,
          displayWithTile: vm.featureStyleCopy.displayWithTile,
          onReady:function (timeControl) {
            let startTime =  timeControl.startTime;
            let endTime =  timeControl.endTime;
            vm.startTimeCopy = vm.formatDate(startTime);
            vm.minSlider = startTime;
            vm.endTimeCopy = vm.formatDate(endTime);
            vm.maxSlider = endTime;
          },
          onUpdate:function (currentPlayTime, currentTimeStamp) {
            vm.timeSliderPlay(currentPlayTime, currentTimeStamp);
          }
        };
        if (vm.featureStyleCopy.displayWithTile){
          options.tileFeaturesCount = vm.tileFeaturesCount;
        } else {
          cityGrowOptions.buildingsLimit = vm.featureStyleCopy.buildingsLimit;
        }
        let style = {
          type: 'cityGrow',
          styleOptions:cityGrowOptions
        };
         options = {autoReset: vm.autoReset, style: style};

        this.viewer.scene.layers.appendVectorLayer(url, {
          ...options,
          getDocLayerIndexes: function (indexs) {
            vm.layerIndex = indexs[0];
            vm.layer = vm.viewer.scene.layers.getLayer(vm.layerIndex);
            vm.$emit("CityGrow",vm.layer);
          }
        });
      } else {
        if (vm.layer) {
          vm.layer.cityGrowPlay();
        }
      }
    },
    //暂停生长
    stopGrow() {
      let vm = this;
      vm.isStartGrow = false;
      if (vm.layer){
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
      return y + '-' + this.addT(m) + '-' + this.addT(d);
      // 时间戳转时间 方法二：
      // return moment(timestamp).format("YYYY-MM-DD");

    },
    addT(m) {
      return m < 10 ? '0' + m : m
    },
    onSliderChange(e) {
      let vm = this;
      if (vm.layer){
        vm.layer.cityGrowSetTime(e, false);
      }
    },
    confirmSetting() {
    },
    changeModelValue(e) {
      this.colorsCopy = e;
    },
    confirmSetColo() {
      this.showColorSetting = true;
    },
    hideModal() {
      this.showColorSetting = false;
    }
  }
}
</script>

<style scoped>
.mapgis-city-grow {
  position: absolute;
  left: 10px;
  bottom: 10px;
  margin: 0px auto;
}

.mapgis-city-grow-toolbar {
  display: flex;
  width: 110px;
  margin: 0px auto;
}

.mapgis-city-grow-toolbar-main:hover {
  color: #49A8FF;
}

.mapgis-city-grow-toolbar-main {
  color: #1890ff;
}

.mapgis-city-grow-toolbar > .anticon {
  font-size: 22px;
}

.mapgis-ui-card-small > .mapgis-ui-card-body {
  padding: 6px 12px;
}

.mapgis-city-grow-starttime {
  position: absolute;
  left: 10px;
}

.mapgis-city-grow-endtime {
  position: absolute;
  right: 10px;
  bottom: 12px;
}

.mapgis-city-grow-setting {
  position: absolute;
  font-size: 18px;
  top: 4px;
  right: 4px;
}

.mapgis-ui-popover {
  background: transparent;
}

.mapgis-ui-popconfirm-style {
  display: inline;
}

</style>