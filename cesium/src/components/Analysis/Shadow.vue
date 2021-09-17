<template>
    <div class="mp-widget-shadow-analysis">
      <mapgis-ui-form-model :model="formData" v-bind="layout">
        <mapgis-ui-form-model-item label="日期">
          <mapgis-ui-date-picker
              :default-value="startDate"
              size="small"
              @change="changeDate"
          />
        </mapgis-ui-form-model-item>
        <div>
          <mapgis-ui-form-model-item label="开始时间">
            <mapgis-ui-time-picker
                :default-value="startTime"
                size="small"
                @change="
              val => {
                changeTime(val, 'startTime')
              }
            "
            />
          </mapgis-ui-form-model-item>
          <mapgis-ui-form-model-item label="结束时间">
            <mapgis-ui-time-picker
                :default-value="endTime"
                size="small"
                @change="
              val => {
                changeTime(val, 'endTime')
              }
            "
            />
          </mapgis-ui-form-model-item>
        </div>
        <mapgis-ui-form-model-item label="底部高程">
          <mapgis-ui-input
              v-model.number="formData.min"
              addon-after="(米)"
              size="small"
              type="number"
          />
        </mapgis-ui-form-model-item>
        <mapgis-ui-form-model-item label="拉伸高度">
          <mapgis-ui-input
              v-model.number="formData.max"
              addon-after="(米)"
              min="0"
              size="small"
              type="number"
          />
        </mapgis-ui-form-model-item>
        <mapgis-ui-form-model-item label="阴影颜色">
          <mapgis-ui-sketch-color-picker
              :color.sync="formData.shadowColor"
              :disableAlpha="true"
          />
        </mapgis-ui-form-model-item>
        <mapgis-ui-form-model-item label="非阴影颜色">
          <mapgis-ui-sketch-color-picker
              :color.sync="formData.sunColor"
              :disableAlpha="true"
          />
        </mapgis-ui-form-model-item>
        <mapgis-ui-form-model-item v-show="formData.timeType === 'time'" label="阴影率">
          <mapgis-ui-input
              v-model.number="formData.ratio"
              disabled
              size="small"
              type="number"
          />
        </mapgis-ui-form-model-item>
      </mapgis-ui-form-model>
      <mapgis-ui-setting-footer>
        <mapgis-ui-button
            :disabled="maskShow"
            type="primary"
            @click="shadow"
        >阴影分析
        </mapgis-ui-button
        >
        <mapgis-ui-button type="primary" @click="sun" :disabled="maskShow"
        >日照效果
        </mapgis-ui-button
        >
        <mapgis-ui-button
            type="primary"
            @click="removeAll"
        > 清除
        </mapgis-ui-button
        >
      </mapgis-ui-setting-footer>
      <mapgis-ui-mask
          :parentDivClass="'cesium-map-wrapper'"
          :loading="maskShow"
          :text="maskText"
      ></mapgis-ui-mask>
    </div>
<!--  </div>-->
</template>

<script>
import BaseMixin from "./BaseLayer";
const shadowMoment = require('moment');
const manager = "shadowAnalysisManager";
export default {
  name: "mapgis-3d-shadow",
  mixins: [BaseMixin],
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
  },
  data() {
    return {
      formData: {
        date: '2021-7-1', // 日期
        startTime: '10:00:00', // 开始时间
        endTime: '14:00:00', // 结束时间
        dateTimeVal: '10:00:00',
        min: 0, // 最低高程(米)
        max: 20, // 拉伸高度(米)
        shadowColor: 'rgba(0,255,0,255)', // 阴影颜色
        sunColor: 'rgba(255,0,0,255)', // 非阴影颜色
        // ratio: 0, // 阴影率(时间点范围阴影分析输出结果)
        // timeType: 'timeRange', // 分析类型(time：时间点；timeRange:时间段)
        // time: '10:00:00' // 时间点
      },
      startDate: "",
      formDataTime: "",
      startTime: '',
      endTime: '',
      waitManagerName: "M3DIgsManager",
      percent: 0,
      layout: {
        labelCol: {span: 5},
        wrapperCol: {span: 16},
      },
      maskShow: false,
      maskText: '正在分析中, 请稍等...0%'
    }
  },
  created() {
    this.startDate = shadowMoment(this.formData.date, 'YYYY-MM-DD');
    this.formDataTime = shadowMoment(this.formData.time, 'HH:mm:ss');
    this.startTime = shadowMoment(this.formData.startTime, 'HH:mm:ss');
    this.endTime = shadowMoment(this.formData.endTime, 'HH:mm:ss');
  },
  mounted() {
  },
  beforeDestroy() {
    this.removeAll();
  },
  watch: {
    formData: {
      handler: function (e) {
        this.reloadAnalysis();
      },
      deep: true
    }
  },
  methods: {
    /**
     * 日期组件值变化
     */
    changeDate(val) {
      const date = shadowMoment(val).format('YYYY-MM-DD')
      this.$set(this.formData, 'date', date)
    },

    /**
     * 时间组件值变化
     */
    changeTime(val, tag) {
      const time = shadowMoment(val).format('HH:mm:ss')
      this.$set(this.formData, tag, time)
    },

    /**
     * 时间字符串转JulianDate时间
     */
    getJulianDate(timeStr) {
      const utc = this.Cesium.JulianDate.fromDate(new Date(timeStr)) // UTC
      return this.Cesium.JulianDate.addHours(utc, 0, new this.Cesium.JulianDate()) // 北京时间
    },

    /**
     * 十六进制颜色值转为raga
     * @param {string} color 十六进制颜色值
     */
    colorToRgba(val) {
      //16进制的正则
      let reg = new RegExp("^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$");
      let color = val.toLowerCase();
      if (val.includes('rgba')) {
        return val;
      }
      let result = '';
      if (reg.test(color)) {
        let colorChange = [];
        for (let i = 1; i < 7; i += 2) {
          colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
          result = "rgba(" + colorChange.join(",")
        }
        result = result + ",255)";
      }
      return result;
    },

    /**
     * 范围时间段阴影分析
     */
    shadow() {
      this.remove();
      const {viewer} = this.webGlobe;
      // 初始化交互式绘制控件
      let drawElement = new this.Cesium.DrawElement(viewer);
      let {date, min, max, timeType, shadowColor, sunColor} = this.formData;
      shadowColor = this.colorToRgba(shadowColor);
      sunColor = this.colorToRgba(sunColor);
      const time = new Date(`${date} ${this.formData.time}`);
      const startTime = new Date(`${date} ${this.formData.startTime}`);
      const endTime = new Date(`${date} ${this.formData.endTime}`);

      const self = this;
      let shadowAnalysis;
      // 1.绘制分析区域(矩形)
      // 激活交互式绘制工具
      drawElement.startDrawingPolygon({
        // 绘制完成回调函数
        callback: positions => {
          // self.remove();
          self.toggleMask(true);
          this.$emit("analysisBegin");
          let xmin
          let ymin
          let xmax
          let ymax

          positions.forEach(point => {
            const {x, y} = point
            if (xmin === undefined || x < xmin) {
              xmin = x
            }
            if (xmax === undefined || x > xmax) {
              xmax = x
            }
            if (ymin === undefined || y < ymin) {
              ymin = y
            }
            if (ymax === undefined || y > ymax) {
              ymax = y
            }
          })

          // 多边形x方向长度
          const recXLength = self.Cesium.Cartesian3.distance(
              new this.Cesium.Cartesian3(xmin, ymin, 0),
              new this.Cesium.Cartesian3(xmax, ymin, 0)
          )
          // 多边形y方向长度
          const recYLength = self.Cesium.Cartesian3.distance(
              new this.Cesium.Cartesian3(xmin, ymin, 0),
              new this.Cesium.Cartesian3(xmin, ymax, 0)
          )
          const xPaneNum = Math.ceil(recXLength / 4) // X轴方向插值点个数
          const yPaneNum = Math.ceil(recYLength / 4) // Y轴方向插值点个数
          const zPaneNum = Math.ceil((max - min) / 4) // Z轴方向插值点个数

          shadowAnalysis = new Cesium.ShadowAnalysis(viewer, {
            xPaneNum,
            yPaneNum,
            zPaneNum,
            shadowColor: shadowColor,
            sunColor: sunColor,
            percentCallback: this.setPercent(this.percent)
          })
          // 时间段范围阴影分析
          const result = shadowAnalysis.calcPointsArrayInShadowTime(
              positions,
              min,
              max,
              startTime,
              endTime
          )
          // 深拷贝positions数组对象
          let positionCopy = [];
          positionCopy = this.copy(positions);
          // positionCopy = JSON.parse(JSON.stringify(positions));
          CesiumZondy.shadowAnalysisManager.addSource(
              self.vueKey,
              self.vueIndex,
              {shadowAnalysis, drawElement},
              {positionCopy: positionCopy}
          );
          console.log("CesiumZondy.shadowAnalysisManager",CesiumZondy.shadowAnalysisManager);
        }
      })

    },

    /**
     * 原生日照分析
     */
    sun() {
      this.removeSun();
      // this.remove();
      const {viewer} = this.webGlobe;
      viewer.scene.globe.enableLighting = true; // 开启日照
      viewer.shadows = true; // 开启阴影
      const {date, startTime, endTime, time, timeType} = this.formData;
      // 时间段日照分析
      viewer.clock.shouldAnimate = true // 开启计时
      viewer.clock.startTime = this.getJulianDate(
          `${date} ${this.formData.startTime}`
      )
      viewer.clock.stopTime = this.getJulianDate(
          `${date} ${this.formData.endTime}`
      )
      viewer.clock.currentTime = this.getJulianDate(
          `${date} ${this.formData.startTime}`
      )
      viewer.clock.multiplier = 3600 // cesium中1秒表示现实中1个小时
      viewer.clock.clockRange = this.Cesium.ClockRange.LOOP_STOP // 循环动画
    },

    /**
     * 参数更新后重新加载分析结果
     */
    reloadAnalysis() {
      let {vueKey, vueIndex} = this;
      const {viewer} = this.webGlobe;
      // let findSource = vm.$_getManager(manager);
      let findSource = CesiumZondy[manager].findSource(vueKey, vueIndex);
      let xPaneNum;
      let yPaneNum;
      let zPaneNum;
      let positions = [];
      const startTime = new Date(`${this.formData.date} ${this.formData.startTime}`);
      const endTime = new Date(`${this.formData.date} ${this.formData.endTime}`);
      const shadowColor = this.colorToRgba(this.formData.shadowColor);
      const sunColor = this.colorToRgba(this.formData.sunColor);
      if (findSource && findSource.source && findSource.options) {
        let originAnaysis = findSource.source.shadowAnalysis;
        let drawElement = findSource.source.drawElement;
        xPaneNum = originAnaysis.xPaneNum;
        yPaneNum = originAnaysis.yPaneNum;
        zPaneNum = originAnaysis.zPaneNum;
        positions = findSource.options.positionCopy;
        this.remove();
        this.$emit("analysisBegin");
        let shadowAnalysis = new Cesium.ShadowAnalysis(viewer, {
          xPaneNum,
          yPaneNum,
          zPaneNum,
          shadowColor: shadowColor,
          sunColor: sunColor,
          percentCallback: this.setPercent(this.percent)
        })
        // 时间段范围阴影分析
        const result = shadowAnalysis.calcPointsArrayInShadowTime(
            positions,
            this.formData.min,
            this.formData.max,
            startTime,
            endTime
        )
        let positionCopy = [];
        positionCopy = this.copy(positions);
        //存放到管理器中
        CesiumZondy.shadowAnalysisManager.addSource(
            this.vueKey,
            this.vueIndex,
            {shadowAnalysis, drawElement},
            {positionCopy: positionCopy}
        );
      }
    },

    // /**
    //  * 时间段阴影分析回调函数，获取分析进度值
    //  */
    // setPercent(result){
    //     this.percent = result;
    //     const timer = setInterval(()=>{
    //       if (this.percent === result){
    //         console.log("result",result);
    //         this.$emit("analysisEnd",result);
    //       }
    //       clearInterval(timer);
    //     },200)
    // },

    /**
     * 时间段阴影分析回调函数，获取分析进度值
     */
    setPercent(result) {
      debugger
      this.percent = result;
      this.maskText = `正在分析中, 请稍等...${Number((result * 100).toFixed(2))}%`;
      const timer = setInterval(() => {
        if (this.percent === result) {
          this.toggleMask(false);
        }
        clearInterval(timer);
      }, 200)
    },
    //数组对象深拷贝
    copy(obj) {
      var newobj = obj.constructor === Array ? [] : {};
      if (typeof obj !== 'object') {
        return;
      }
      for (let i in obj) {
        newobj[i] = typeof obj[i] === 'object' ? this.copy(obj[i]) : obj[i];
      }
      return newobj;
    },
    /**
     * 移除绘制插件和阴影分析结果
     */
    remove() {
      let {vueKey, vueIndex} = this;
      // let findSource = vm.$_getManager(manager);
      let findSource = CesiumZondy[manager].findSource(vueKey, vueIndex);
      // 判断是否已有阴影分析结果
      if (findSource && findSource.source) {
        // 移除阴影分析显示结果
        findSource.source.shadowAnalysis.remove();
        findSource.source.shadowAnalysis = null
      }
      if (findSource && findSource.source) {
        // 取消交互式绘制矩形事件激活状态
        findSource.source.drawElement.stopDrawing()
        findSource.source.drawElement = null
      }
      // 这段代码可以认为是对应的vue的获取destroyed生命周期
      CesiumZondy[manager].deleteSource(vueKey, vueIndex);
      console.log("CesiumZondy.shadowAnalysisManager",CesiumZondy.shadowAnalysisManager);
      // this.$set(this.formData, 'ratio', 0)
    },
    /**
     * 移除日照分析结果
     */
    removeSun() {
      const { viewer } = this.webGlobe
      viewer.scene.globe.enableLighting = false
      viewer.shadows = false
      viewer.clock.multiplier = 1
      viewer.clock.shouldAnimate = false // 关闭计时
    },
    removeAll(){
      this.remove();
      this.removeSun();
    },
    /**
     * 阴影分析遮罩层
     */
    toggleMask(status) {
      this.maskShow = status;
    },

    changeShadowColor(color) {
      this.formData.shadowColor = color;
    },
    changeSunColor(color) {
      this.formData.sunColor = color;
    }
  }
}
</script>

<style scoped>
::v-deep .mapgis-ui-form-item {
  margin-bottom: 0;
}
::v-deep .mapgis-ui-form label {
  font-size: 12px;
}

::v-deep .mapgis-ui-form-item-label {
  line-height: 40px;
}

::v-deep .mapgis-ui-input {
  padding: 4px 11px;
}

::v-deep .mapgis-ui-time-picker{
  width: 193px;
}
::v-deep .mapgis-ui-col-5{
  width: 23.833333%;
}
</style>