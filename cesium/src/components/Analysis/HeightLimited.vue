<template>
  <div class="mapgis-widget-heightLimited-analysis">
    <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
    <mapgis-ui-color-pick-panel
        :label="colorLabel"
        :color="colorCopy"
        :size="size"
        :disableAlpha="false"
        :labelCol="24"
				:wrapperCol="24"
        style="font-size: 13px"
        @input="val =>
                  (colorCopy = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          ">
    </mapgis-ui-color-pick-panel>
        <mapgis-ui-input-number-panel
            label="最高高度"
            :step="1"
            :range="[minSliderHeightCopy,10000]"
            v-model="maxSliderHeightCopy"
            @change="val => setMaxHeight(val)"
            style="font-size: 13px"/>
    <mapgis-ui-input-number-panel
        label="控制高度"
        :step="1"
        :range="[minSliderHeightCopy,maxSliderHeightCopy]"
        v-model="heightLimitCopy"
        @change="val => setInput(val)"
        style="font-size: 13px"/>
    <!-- <mapgis-ui-switch-panel label="控高面显示" v-model="enablePolygonCopy" size="small" :isTitleBold="false" style="margin:0px;"></mapgis-ui-switch-panel> -->
    <mapgis-ui-group-tab title="控高面显示" :isTitleBold="true" :hasTopMargin="false" :hasBottomMargin="true">
      <mapgis-ui-switch
        slot="handle"
        v-model="enablePolygonCopy"
        size="small"
      >
      </mapgis-ui-switch>
    </mapgis-ui-group-tab>
    <mapgis-3d-draw v-on:drawcreate="handleCreate" v-on:load="handleDrawLoad"
                    :drawStyle="drawStyleCopy"
                    :enableControl="enableControl">
      <div class="parent_div">
        <mapgis-ui-group-tab title="分析范围"></mapgis-ui-group-tab>
        <mapgis-ui-radio-group v-model="radioValue" style="line-height:32px;padding-bottom:8px;">
          <mapgis-ui-radio
              :value=1
          >
            绘制区域
          </mapgis-ui-radio>
          <mapgis-ui-radio
              :value=2
          >
            输入区域
          </mapgis-ui-radio>
        </mapgis-ui-radio-group>
        <div style="text-align: left;padding-bottom:8px;" v-if="radioValue === 1">
          <mapgis-ui-tooltip
              v-for="(item, i) in draws"
              :key="i"
              placement="top"
          >
            <template slot="title">
              <span>{{ item.tip }}</span>
            </template>
            <mapgis-ui-button
                shape="circle"
                :type="item.type"
                @click="item.click"
                :class="item.className"
                style="margin: 0 12px"
            >
              <mapgis-ui-iconfont
                  :type="item.icon"
                  :class="item.className"
                  theme="filled"
              />
            </mapgis-ui-button>
          </mapgis-ui-tooltip>
        </div>
        <div v-if="radioValue === 2">
          <mapgis-ui-setting-form :layout="layout" size="default" class="mapgis-ui-setting-form">
            <mapgis-ui-form-item label="圆心" style="text-align: center">
              <mapgis-ui-row :gutter="8">
                <mapgis-ui-col :span="12">	
                  <mapgis-ui-input-number-addon
                    v-model.number="circleCenter.longitude"
                    allow-clear
                  >
                    <mapgis-ui-tooltip slot="addonBefore" :title="inputDefaultVal1">
                      <mapgis-ui-iconfont type="mapgis-xzhouyidong"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input-number-addon>
                </mapgis-ui-col>
                <mapgis-ui-col :span="12">
                  <mapgis-ui-input-number-addon
                    v-model.number="circleCenter.latitude"
                    allow-clear
                  >
                    <mapgis-ui-tooltip slot="addonBefore" :title="inputDefaultVal2">
                      <mapgis-ui-iconfont type="mapgis-yzhouyidong"/>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-input-number-addon>
                </mapgis-ui-col>
              </mapgis-ui-row>
            </mapgis-ui-form-item>
            <mapgis-ui-form-item label="半径">
              <mapgis-ui-input-number-addon
                v-model.number="radius"
                min="0"
                addon-after="米"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-setting-form>
        </div>
      </div>
    </mapgis-3d-draw>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="startHeightAnalysis">
        分析
      </mapgis-ui-button>
      <mapgis-ui-button @click="toggleDelete">清除</mapgis-ui-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import BaseLayer from "./BaseLayer";
import Mapgis3dDraw from "../UI/Controls/Draw/Draw";
import {deepEqual} from "../Utils/deepequal";
import * as turf from "@turf/turf";

export default {
  name: "mapgis-3d-heightlimited",
  mixins: [BaseLayer],
  props: {
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
     * @default 80
     * @description 控高默认值
     */
    heightLimit: {
      type: Number,
      default: 80
    },
    /**
     * @type Number
     * @default 10
     * @description 滑动条最大值
     */
    maxSliderHeight: {
      type: Number,
      default: 180
    },
    /**
     * @type Number
     * @default 0
     * @description 滑动条最小值
     */
    minSliderHeight: {
      type: Number,
      default: 0
    },
    /**
     * @type String
     * @default 0
     * @description 控高分析结果颜色
     */
    color: {
      type: String,
      default: "rgba(255,0,0,0.5)"
    },
    drawStyle: {
      type: Object,
      default() {
        return {
          color: "#FF8C00",
          opacity: 0.6
        }
      }
    },
    /* 是否显示控高面 */
    enablePolygon: {
      type: Boolean,
      default: false
    }
  },
  components: {Mapgis3dDraw},
  inject: ["Cesium", "vueCesium", "viewer"],
  data() {
    return {
      heightLimitCopy: 10,
      isDrawCircle: false,
      waitManagerName: "M3DIgsManager",
      cartesianForHeight: [],
      enableControl: false,
      size: "default",
      // radio样式
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      },
      colorLabel: "控高颜色",
      colorCopy: "rgba(255,0,0,0.5)",
      opacityCopy: 0.5,
      minSliderHeightCopy: 0,
      maxSliderHeightCopy: 180,
      drawStyleCopy: {
        color: "#FF8C00",
        opacity: 0.6
      },
      draws: [
        {
          icon: "mapgis-huizhijuxing",
          type: "primary",
          tip: "绘制矩形",
          click: this.drawRectangle
        },
        {
          icon: "mapgis-draw-polygon",
          type: "primary",
          tip: "绘制多边形",
          click: this.drawPolygon
        },
        {
          icon: "mapgis-huizhiyuan1",
          type: "primary",
          tip: "绘制圆",
          click: this.drawCircle
        },
      ],
      radioValue: 1,
      inputDefaultVal1: '经度',
      inputDefaultVal2: '纬度',
      circleCenter: {
        longitude: "",
        latitude: ""
      },
      radius: 0,
      layout: "horizontal",
      labelCol: {span: 5},
      wrapperCol: {span: 19},
      lnglat: undefined,

      enablePolygonCopy: this.enablePolygon
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    color: {
      immediate: true,
      handler(next, old) {
        if (!deepEqual(next, old)) {
          this.colorCopy = next;
        }
      }
    },
    colorCopy: {
      immediate: true,
      handler(next) {
        let {vueCesium, vueKey, vueIndex} = this;
        let find = vueCesium.HeightLimitedAnalysisManager.findSource(vueKey, vueIndex);
        if (find && find.options) {
          if (this.lnglat) {
            let {heightLimitedAnalysis} = find.options;
            if (heightLimitedAnalysis) {
              this.heightLimitedAnalysis(this.lnglat);
            }
          }
        }
      }
    },
    heightLimit: {
      immediate: true,
      handler(next) {
        this.heightLimitCopy = next;
      }
    },
    minSliderHeight: {
      immediate: true,
      handler(next) {
        this.minSliderHeightCopy = next;
      }
    },
    maxSliderHeight: {
      immediate: true,
      handler(next) {
        this.maxSliderHeightCopy = next;
      }
    },
    drawStyle: {
      immediate: true,
      handler(next) {
        this.drawStyleCopy = next;
      }
    },
    enablePolygon(e){
      this.enablePolygonCopy = e;
    },
    enablePolygonCopy(){
      if(this.lnglat){
        this.startHeightAnalysis();
      }
    }
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
          resolve => {
            resolve();
          },
          reject => {
          }
      );
    },
    mount() {
      const {viewer, vueCesium, vueKey, vueIndex} = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        vm.$emit("load", vm);
        vueCesium.HeightLimitedAnalysisManager.addSource(
            vueKey,
            vueIndex,
            dataSource,
            {
              heightLimitedAnalysis: null,
              lnglat: null
            }
        );
      });
    },

    /**
     * 开始分析
     */
    startHeightAnalysis() {
      let vm = this;
      // 先判断分析范围：绘制区域和输入区域
      if (vm.radioValue) {
        switch (vm.radioValue) {
          case 1:
            if (vm.lnglat) {
              this.drawer && this.drawer.removeEntities(true);
              this.heightLimitedAnalysis(vm.lnglat);
            } else {
              this.$message.warning("请先绘制控高区域");
            }
            break;
          case 2:
            if (vm.circleCenter.longitude && vm.circleCenter.latitude && vm.radius) {
              //先清除
              vm.lnglat = undefined;
              // 根据用户输入的圆心和半径计算圆范围的坐标点
              let circle = [vm.circleCenter.longitude, vm.circleCenter.latitude];
              vm.lnglat = vm.calculateCirclePosition(circle, vm.radius / 1000);
              this.heightLimitedAnalysis(vm.lnglat);
            } else {
              this.$message.warning("请先输入控高区域");
            }
            break;
        }
      }
    },

    calculateCirclePosition(center, radius) {
      // turf 计算坐标点
      let options = {};
      let positions = turf.circle(center, radius, options);
      return positions.geometry.coordinates[0];
    },

    setInput(data) {
      let vm = this;
      vm.heightLimitCopy = data;
      let {vueCesium, vueKey, vueIndex} = this;
      let find = vueCesium.HeightLimitedAnalysisManager.findSource(
          vueKey,
          vueIndex
      );
      let {options} = find;
      let {heightLimitedAnalysis} = options;
      if (heightLimitedAnalysis) {
        // 设置限高高度
        heightLimitedAnalysis.height = data;
      }
    },
    setMaxHeight(val){},

    changeColor(e) {
      this.colorCopy = e;
      this.remove();
      this.heightLimitedAnalysis(this.lnglat);
    },

    removeDraw() {
      this.drawer.unmount();
    },
    drawPolygon() {
      this.lnglat = undefined;
      this.drawer && this.drawer.enableDrawPolygon();
    },
    drawCircle() {
      this.lnglat = undefined;
      this.isDrawCircle = true;
      this.drawer && this.drawer.enableDrawCircle();
    },
    drawRectangle() {
      this.lnglat = undefined;
      this.drawer && this.drawer.enableDrawRectangle();
    },
    toggleDelete() {
      let vm = this;
      vm.lnglat = undefined;
      this.drawer && this.drawer.removeEntities();
      //清空drawElement
      if (window.drawElement) {
        window.drawElement.stopDrawing();
      }
      this.remove();
    },
    handleDrawLoad(drawer) {
      this.drawer = drawer;
    },

    //绘制组件的回调函数
    handleCreate(cartesian3, lnglat) {
      let vm = this;
      if (vm.isDrawCircle) {
        let center = [];
        // 圆心 笛卡尔转换经纬度
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
        center.push(Cesium.Math.toDegrees(cartographic.longitude));
        center.push(Cesium.Math.toDegrees(cartographic.latitude));
        let radius = lnglat / 1000;
        vm.lnglat = vm.calculateCirclePosition(center, radius);
        vm.isDrawCircle = false;
      } else {
        // 矩形或者多边形，笛卡尔转换经纬度
        if (lnglat.length === 2) {
          vm.lnglat = vm.getAllPointByDegree(lnglat[0], lnglat[1]);
        } else {
          vm.lnglat = lnglat;
        }
      }
      vm.cartesian3 = cartesian3;
      // 绘制完直接进行控高分析
      vm.startHeightAnalysis()
    },

    //开始控高分析
    heightLimitedAnalysis(lnglat) {
      const vm = this;
      // 先remove
      this.remove();
      let {heightLimitCopy, vueCesium, viewer} = this;
      if (lnglat) {
        vm.lnglat = lnglat;
        vueCesium.HeightLimitedAnalysisManager.changeOptions(
            vm.vueKey,
            vm.vueIndex,
            "lnglat",
            lnglat
        );
        //控高分析边界点数组
        let pnts = [];
        for (let i = 0; i < lnglat.length; i++) {
          pnts.push(new Cesium.Cartesian3(lnglat[i][0], lnglat[i][1], 0));
        }
        let cesiumColor = Cesium.Color.fromCssColorString(vm.colorCopy);
        
        let polygonColor; 
        if( vm.enablePolygonCopy ) {
          polygonColor = Cesium.Color.BLACK.withAlpha(0.5)
        }else {
          polygonColor = Cesium.Color.BLACK.withAlpha(0)
        }

        //调用控高分析接口
        let heightLimited = new Cesium.HeightLimited(viewer, {
          height: heightLimitCopy,
          limitedColor: cesiumColor,
          blendTransparency: vm.opacityCopy,
          posArray: pnts,
          polygonColor: polygonColor,
          useOutLine: false
        });
        heightLimited.add();
        vueCesium.HeightLimitedAnalysisManager.changeOptions(
            vm.vueKey,
            vm.vueIndex,
            "heightLimitedAnalysis",
            heightLimited
        );
      }
    },

    //绘制方式返回的点坐标是经纬度坐标
    getAllPointByDegree(lnglat1, lnglat2) {
      let p3 = [], p4 = [];
      p3.push(lnglat1[0]);
      p3.push(lnglat2[1]);
      p3.push(lnglat1[2]);
      p4.push(lnglat2[0]);
      p4.push(lnglat1[1]);
      p4.push(lnglat2[2]);
      let allPoint = [lnglat1, p4, lnglat2, p3];
      return allPoint;
    },

    handleChange(e) {
      let a1 = this.models.filter((m) => {
        return m.title === e;
      })
      this.model = a1[0];
      this.toggleDelete();
    },

    remove() {
      const {vueKey, vueIndex, vueCesium} = this;
      let find = vueCesium.HeightLimitedAnalysisManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        if (find.options.heightLimitedAnalysis) {
          let analysis = find.options.heightLimitedAnalysis;
          analysis.remove();
          find.options.heightLimitedAnalysis = null;
          find.options.lnglat = null;
          this.lnglat = undefined;
        }
      }
    },
    unmount() {
      let {vueCesium, vueKey, vueIndex} = this;
      this.removeDraw();
      this.remove();
      // 这段代码可以认为是对应的vue的获取destroyed生命周期
      vueCesium.HeightLimitedAnalysisManager.deleteSource(vueKey, vueIndex);
    }
  }
}

</script>

<style scoped>
::v-deep .mapgis-ui-select {
  width: 100%;
}
.parent_div {
  width: 100%;
  display: inline-block;
  position: relative;
}
.mapgis-ui-setting-form{
  /*height: 16px;*/
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
}

::v-deep .mapgis-ui-form-item {
  /* margin-bottom: 12px; */
}
::v-deep .mapgis-ui-form-item-control{
  text-align: center!important;
}
::v-deep .mapgis-ui-input-number-panel{
  /* padding: 0; */
}
</style>