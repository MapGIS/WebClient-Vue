<template>
  <div class="plot-timeline-panel">
    <div class="timeline-setting-panel">
      <mapgis-ui-space>
        <mapgis-ui-iconfont
          :class="['play-btn', { 'btn-active': startBtn === true }]"
          type="mapgis-fuwei"
          @click.capture.stop="start"
          v-if="enableStart"
        />
        <mapgis-ui-iconfont
          :class="['play-btn', { 'btn-active': backBtn === true }]"
          type="mapgis-arrow-left-filling"
          @click.capture.stop="backward"
          v-if="enableBack"
        />
        <mapgis-ui-iconfont
          :class="['play-btn', { 'btn-active': pauseBtn === true }]"
          type="mapgis-pause"
          @click.capture.stop="pause"
          v-if="enablePause"
        />
        <mapgis-ui-iconfont
          :class="['play-btn', { 'btn-active': forwardBtn === true }]"
          type="mapgis-arrow-right-filling"
          @click.capture.stop="forward"
          v-if="enableForward"
        />
        <mapgis-ui-iconfont
          :class="['play-btn', { 'btn-active': endBtn === true }]"
          type="mapgis-zhongzhi"
          @click.capture.stop="end"
          v-if="enableEnd"
        />
      </mapgis-ui-space>

      <div
        class="timeline-current-time"
        :style="{ width: `${curTimeWidth}px` }"
      >
        {{ currentTime }}
      </div>

      <mapgis-ui-tooltip>
        <div class="timeline-current-speed">
          倍速
        </div>
        <template #title>
          <mapgis-ui-input-number
            v-model="speedCopy"
            :formatter="value => `${value}X`"
            :parser="value => value.replace('X', '')"
            :step="speedStep"
            :min="minSpeed"
            :max="maxSpeed"
          />
        </template>
      </mapgis-ui-tooltip>

      <mapgis-ui-tooltip :visible="showInterval">
        <div class="timeline-select" @mouseenter="() => (showInterval = true)">
          播放间隔
        </div>
        <template #title>
          <mapgis-ui-select-panel
            :showLabel="false"
            v-model="intervalCopy"
            :selectOptions="intervalOptions"
            :placeholder="intervalCopy"
            :wrapperCol="24"
            @mouseenter.native="() => (showInterval = true)"
            @mouseleave.native="closeIntervalPanel"
          />
        </template>
      </mapgis-ui-tooltip>
    </div>

    <div class="timeline-main">
      <div class="timeline-bar" ref="timebar">
        <div
          class="time-tick time-tick-lg"
          v-for="item in [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220]"
          :key="item"
        >
          <span class="time-mark">{{ item }}</span>
          <div
            class="time-tick time-tick-sm"
            v-for="item in [1, 2, 3, 4]"
            :key="item"
          />
          <div class="time-tick time-tick-md">
            <span class="time-mark">{{ item + 10 }}</span>
          </div>
          <div
            class="time-tick time-tick-sm"
            v-for="item in [5, 6, 7, 8]"
            :key="item"
          />
        </div>
        <div class="time-tick time-tick-lg-last">
          <span class="time-mark">240</span>
        </div>
        <div class="timeline-needle" style="left: 0px;">
          <img src="./style/images/u196.png" class="timeline-needle-top" />
          <!-- <mapgis-ui-iconfont type="mapgis-down" class="timeline-needle-top" /> -->
          <div class="timeline-needle-bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "mapgis-ui-plot-timeline",
  props: {
    currentTime: {
      type: String,
      default: "2022-02"
    },
    curTimeWidth: {
      type: Number,
      default: null
    },
    /** 滑动条的值 */
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 60
    },
    duration: {
      type: Number,
      default: 24
    },
    /** 选择的时间间隔 */
    interval: {
      type: String,
      default: "月"
    },
    // intervalPlaceholder: {
    //   type: String,
    //   default: "月"
    // },
    /** 时间间隔选项 */
    intervalOptions: {
      type: Array,
      default: () => {
        return ["年", "月", "日", "时", "分", "秒"];
      }
    },
    /** 倍速大小 */
    speed: {
      type: Number,
      default: 1
    },
    /** 倍速改变步长值 */
    speedStep: {
      type: Number,
      default: 1
    },
    /** 倍速最小值 */
    minSpeed: {
      type: Number,
      default: 0
    },
    /** 倍速最大值 */
    maxSpeed: {
      type: Number,
      default: 50
    },
    /**定义按钮的显示状态 */
    enableStart: {
      type: Boolean,
      default: true
    },
    enableBack: {
      type: Boolean,
      default: true
    },
    enablePause: {
      type: Boolean,
      default: true
    },
    enableForward: {
      type: Boolean,
      default: true
    },
    enableEnd: {
      type: Boolean,
      default: true
    },
    /**定义按钮的初始激活状态 */
    startActive: {
      type: Boolean,
      default: false
    },
    backActive: {
      type: Boolean,
      default: false
    },
    pauseActive: {
      type: Boolean,
      default: false
    },
    forwardActive: {
      type: Boolean,
      default: false
    },
    endActive: {
      type: Boolean,
      default: false
    },
    // 是否禁用暂停按钮的功能
    disableBackward: {
      type: Boolean,
      default: false
    },
    disablePause: {
      type: Boolean,
      default: false
    },
    disableForward: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    disableForward: {
      handler(next) {
        this.disableForwardCopy = next;
      },
      deep: true,
      immediate: true
    },
    disableBackward: {
      handler(next) {
        this.disableBackwardCopy = next;
      },
      deep: true,
      immediate: true
    },
    disablePause: {
      handler(next) {
        this.disablePauseCopy = next;
      },
      deep: true,
      immediate: true
    },
    value: {
      handler(next) {
        this.valueCopy = next;
      },
      deep: true,
      immediate: true
    },
    valueCopy: {
      handler(next) {
        this.valueChange();
        this.$emit("change", next);
      },
      deep: true
    },
    width: {
      handler() {
        this.valueChange();
      },
      deep: true
    },
    speed: {
      handler(next) {
        this.speedCopy = next;
      },
      immediate: true
    },
    speedCopy: {
      handler(next) {
        this.$emit("speedChange", next);
      },
      deep: true
    },
    interval: {
      handler(next) {
        this.intervalCopy = next;
      },
      deep: true,
      immediate: true
    },
    intervalCopy: {
      handler(next) {
        this.$emit("intervalChange", next);
        // console.log("intervalChange", next);
      },
      deep: true
    },
    startActive: {
      handler(next) {
        this.startBtn = next;
      }
    },
    backActive: {
      handler(next) {
        this.backBtn = next;
      }
    },
    forwardActive: {
      handler(next) {
        this.forwardBtn = next;
      }
    },
    pauseActive: {
      handler(next) {
        this.pauseBtn = next;
      }
    },
    endActive: {
      handler(next) {
        this.endBtn = next;
      }
    }
  },
  data() {
    return {
      valueCopy: this.value,
      speedCopy: this.speed,
      intervalCopy: this.interval,

      startBtn: this.startActive,
      backBtn: this.backActive,
      pauseBtn: this.pauseActive,
      forwardBtn: this.forwardActive,
      endBtn: this.endActive,

      // 时间轴
      percent: undefined,
      raf: undefined,
      lasttime: undefined,
      curtime: undefined,
      showInterval: false,
      // 时间轴的宽度
      width: undefined,
      disableBackwardCopy: this.disableBackward,
      disablePauseCopy: this.disablePause,
      disableForwardCopy: this.disableForward
    };
  },
  created() {
    moment.locale();
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      const vm = this;
      this.getWindowWidth();
      window.onresize = function() {
        vm.width = vm.$refs.timebar.clientWidth;
      };

      //实现时间轴的拖拽功能
      let ele = document.querySelector(".timeline-needle");

      ele.onmousedown = function(ev) {
        ev.preventDefault();
        let width = vm.width;
        let initL = parseFloat(ele.style.left) || 0;
        let initX = ev.clientX - initL;

        document.onmousemove = function(ev) {
          let left = ev.clientX - initX;
          left = left < 0 ? 0 : left;
          left = left > width ? width : left;
          vm.percent = left / width;
          vm.valueCopy = vm.percent * (vm.max - vm.min) + vm.min;
        };

        document.onmouseup = function() {
          document.onmouseup = null;
          document.onmousemove = null;
        };
      };

      this.$emit("loaded", this);
    },
    unmount() {
      this.stopPlay();
      this.raf = undefined;
    },
    getWindowWidth() {
      let bar = document.querySelector(".timeline-bar");
      this.width = this.$refs.timebar.clientWidth;
      // console.log("vm.$refs.width", vm.$refs.timebar.clientWidth);
      // console.log("window.getComputedStyle(bar).width", window.getComputedStyle(bar).width);
      // console.log("parseFloat(window.getComputedStyle(bar).width || 0) ", parseFloat(window.getComputedStyle(bar).width || 0) );
    },
    //实现时间轴的播放功能
    startPlay() {
      const vm = this;
      //经过的时间（秒数）
      if (!this.lasttime) {
        this.lasttime = Date.now();
      }

      let curtime = Date.now();
      let diff = (curtime - this.lasttime) / 1000;
      this.lasttime = curtime;
      // console.log("diff", diff);
      if (this.forwardBtn) {
        // 前进
        vm.valueCopy += (vm.max - vm.min) * (diff / vm.duration) * vm.speedCopy;
        if (vm.valueCopy >= vm.max) {
          if (vm.loop) {
            vm.valueCopy = vm.min;
          } else {
            vm.valueCopy = vm.max;
            vm.stopPlay();
            return;
          }
        }
      } else if (this.backBtn) {
        // 后退
        vm.valueCopy -= (vm.max - vm.min) * (diff / vm.duration) * vm.speedCopy;
        if (vm.valueCopy <= vm.min) {
          if (vm.loop) {
            vm.valueCopy = vm.max;
          } else {
            vm.valueCopy = vm.min;
            vm.stopPlay();
            return;
          }
        }
      }
      // console.log("value", vm.valueCopy);
      this.raf = requestAnimationFrame(vm.startPlay);
    },
    stopPlay() {
      const vm = this;
      this.lasttime = undefined;
      cancelAnimationFrame(vm.raf);
      this.forwardBtn = false;
    },
    valueChange() {
      this.percent = (this.valueCopy - this.min) / (this.max - this.min);
      let ele = document.querySelector(".timeline-needle");
      let width = this.width;
      let left = this.percent * width;
      // console.log("width, left", width, left);
      document.querySelector(".timeline-needle").style.left = left + "px";
    },
    closeIntervalPanel() {
      const vm = this;
      setTimeout(() => {
        vm.showInterval = false;
        // console.log("effextive");
      }, 1000);
    },
    start() {
      this.startBtn = true;
      this.backBtn = false;
      this.pauseBtn = false;
      this.forwardBtn = false;
      this.endBtn = false;
      this.$emit("start");

      this.valueCopy = this.min;
    },
    backward() {
      if (this.disableBackwardCopy) {
        this.$emit("backward");
        return;
      }
      this.startBtn = false;
      this.backBtn = true;
      this.pauseBtn = false;
      this.forwardBtn = false;
      this.endBtn = false;
      this.$emit("backward");
      this.startPlay();
    },
    pause() {
      if (this.disablePauseCopy) {
        this.$emit("pause");
        return;
      }
      this.startBtn = false;
      this.backBtn = false;
      this.pauseBtn = true;
      this.forwardBtn = false;
      this.endBtn = false;
      this.$emit("pause");
      this.stopPlay();
    },
    forward() {
      if (this.disableForwardCopy) {
        this.$emit("forward");
        return;
      }
      this.startBtn = false;
      this.backBtn = false;
      this.pauseBtn = false;
      this.forwardBtn = true;
      this.endBtn = false;
      this.$emit("forward");
      this.startPlay();
    },
    end() {
      this.startBtn = false;
      this.backBtn = false;
      this.pauseBtn = false;
      this.forwardBtn = false;
      this.endBtn = true;
      this.$emit("end");

      this.valueCopy = this.max;
    }
  }
};
</script>
