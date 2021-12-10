<template>
  <div>
    <mapgis-ui-card
        size="small"
        hoverable
        :style="{ width: `${width}px` }"
        class="mapgis-city-grow"
    >
      <!--        <mapgis-ui-popconfirm class="mapgis-ui-popconfirm-style" @confirm="confirmSetting" @cancel="cancelSetting">-->
      <!--          <template slot="title">-->
      <mapgis-ui-modal v-model="showColorSetting" title="颜色设置" ok-text="确认" cancel-text="取消" @ok="hideModal"
                       @cancel="cancelSetting">
        <span>{{ info }}</span>
        <mapgis-ui-colors-setting
            v-model="colorsCopy"
            :rangeField="'高度'"
            :showNumber="false"
            style="margin-top: 8px"
        >
        </mapgis-ui-colors-setting>
      </mapgis-ui-modal>
      <!--          </template>-->
      <mapgis-ui-iconfont
          type="mapgis-setting"
          class="mapgis-city-grow-setting"
          @click="confirmSetColo"
      />
      <!--        </mapgis-ui-popconfirm>-->
      <mapgis-ui-slider
          :style="{ width: width }"
          :tip-formatter="formatter"
          :min="minSlider"
          :max="maxSlider"
          v-model="sliderValue"
          @change="onSliderChange"></mapgis-ui-slider>
      <span class="mapgis-city-grow-starttime">起始时间:{{ startTimeCopy }}</span>
      <div class="mapgis-city-grow-toolbar">
        <mapgis-ui-iconfont type="mapgis-chevrons-left"/>
        <mapgis-ui-iconfont type="mapgis-chevron-left"/>
        <!--         <mapgis-ui-button type="primary" shape="circle" @click="startGrow">-->
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
        <!--         </mapgis-ui-button>-->
        <mapgis-ui-iconfont type="mapgis-chevron-right"/>
        <mapgis-ui-iconfont type="mapgis-chevrons-right"/>
      </div>
      <span class="mapgis-city-grow-endtime">结束时间:{{ endTimeCopy }}</span>
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
    displayWithTile: {
      type: String,
      required: false
    },
    // 建筑生长的颜色和高度更新间隔，默认1s更新一次
    updateInterval: {
      type: Number,
      default: 1
    },
    //总播放时长 默认60秒  60秒演示完整个播放流程
    growTime: {
      type: Number,
      default: 60
    },

    // --------------------矢量文档-----------------
    startTime: {
      type: Number,
      required: true
    },
    endTime: {
      type: Number,
      required: true
    },
    startTimeField: {
      type: String,
      required: true
    },
    endTimeField: {
      type: String,
      required: true
    },
    heightField: {
      type: String,
      default: ''
    },
    heightScale: {
      type: Number,
      default: 1.0
    },
    layers: {
      type: String,
      default: null
    },
    tileFeaturesCount:{
      type: Number,
      default: 400
    },
    buildingsLimit: {
      type: Number,
      default: 400
    },
    filter: {
      type: String,
      default: null
    },
    layerStyle: {
      type: Object,
      default: null
    },
    autoReset: {
      type: Boolean,
      default: true
    },
    buildingcolors: {
      type: Array,
      default: () => {
        return ["#fff0f6", "#ff85c0", "#eb2f96"]
      }
    }
  },
  watch: {
    buildingcolors: {
      handler() {
        let vm = this;
        let colors = this.buildingcolors;
        if (colors.length > 0){
          // vm.colorsCopy =
          for (let i = 0; i < colors.length; i++) {
            let obj = {};
            obj.min = 60*i;
            obj.max = 60*(i+1);
            obj.color = colors[i];
            vm.colorsCopy.push(obj);
            vm.buildingcolorsCopy = vm.colorsCopy;
          }
        }
      },
      deep: true,
      immediate: true
    },
    startTime: {
      handler(next) {
        this.startTimeCopy = this.formatDate(next);
        this.minSlider = next;
      },
      deep: true,
      immediate: true
    },
    endTime: {
      handler(next) {
        this.endTimeCopy = this.formatDate(next);
        this.maxSlider = next;
      },
      deep: true,
      immediate: true
    },
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
      // 初始化创建城市生长
      initial: true,
      minSlider: 0,
      maxSlider: this.growTime || 60,
      colorsCopy: [
        // {min: 0, max: 60, color: "#fff0f6"},
        // {min: 60, max: 120, color: "#ff85c0"},
        // {min: 120, max: 180, color: "#eb2f96"},
      ],
      buildingcolorsCopy:[],
      info: "注意：颜色设置只能在城市生长未开启时设置，生长开启后设置颜色无效。",
      showColorSetting: false
    }
  },
  created() {
    moment.locale();
  },
  mounted() {
    //加载白膜
  },
  beforeDestroy() {
  },
  methods: {
    //开始加载
    startGrow() {
      let vm = this;
      if (vm.sliderValue === 0) {
        vm.initial = true
      } else {
        vm.initial = false
      }
      vm.isStartGrow = true;
      if (vm.initial) {
        let url = vm.baseUrl;
        let colors = [];
        for (let i = 0; i < vm.colorsCopy.length; i++) {
          let color = this.Cesium.Color.fromCssColorString(vm.colorsCopy[i].color);
          colors.push(color);
        }
        let cityGrowOptions = {
          startTimeField: vm.startTimeField,
          endTimeField: vm.endTimeField,
          startTime: vm.startTime,
          endTime: vm.endTime,
          buildingsLimit: vm.buildingsLimit,
          updateInterval: vm.updateInterval,
          playTime: vm.growTime,
          colors: colors,
          colorSampling: false,
          displayWithTile: vm.displayWithTile,
          callback: function (currentPlayTime, currentTimeStamp) {
            vm.timeSliderPlay(currentPlayTime, currentTimeStamp);
          }
        };
        if (vm.displayWithTile){
          cityGrowOptions.tileFeaturesCount = vm.tileFeaturesCount;
        } else {
          cityGrowOptions.buildingsLimit = vm.buildingsLimit;
        }
        let style = {
          type: 'building',
          styleOptions: {
            heightField: vm.heightField,
            heightRatio: vm.heightScale
          }
        };

        let options = {autoReset: vm.autoReset, cityGrow: true, cityGrowOptions: cityGrowOptions, style: style};

        this.viewer.scene.layers.appendVectorLayer(url, {
          ...options,
          getDocLayerIndexes: function (indexs) {
            let layerIndex = indexs[0];
            vm.layer = vm.viewer.scene.layers.getLayer(layerIndex);
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
      vm.layer.cityGrowStop();
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
      let time = new Date(timestamp * 1000);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      return y + '-' + this.addT(m) + '-' + this.addT(d);
    },
    addT(m) {
      return m < 10 ? '0' + m : m
    },
    onSliderChange(e) {
      let vm = this;
      vm.layer.cityGrowSetTime(e, false);
    },
    confirmSetting() {
    },
    cancelSetting() {
      this.colorsCopy = this.buildingcolorsCopy;
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