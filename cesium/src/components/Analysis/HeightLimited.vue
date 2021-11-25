<template>
  <div class="mapgis-widget-heightLimited-analysis">
<!--    <mapgis-ui-group-tab-->
<!--        title="模型"-->
<!--        :has-top-margin="false"-->
<!--        v-if="models.length > 1"></mapgis-ui-group-tab>-->
<!--    <mapgis-ui-form-item v-if="models.length > 1">-->
<!--&lt;!&ndash;    <mapgis-ui-row class="model" v-if="models.length > 1">&ndash;&gt;-->
<!--      <mapgis-ui-select :size="size" :default-value="model.title"  @change="handleChange">-->
<!--        <mapgis-ui-select-option v-for="(node, index) in models" :key="index" :value="node.title">-->
<!--          {{ node.title }}-->
<!--        </mapgis-ui-select-option>-->
<!--      </mapgis-ui-select>-->
<!--    </mapgis-ui-form-item>-->
    <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
    <mapgis-ui-setting-form :label-width="72">
      <mapgis-ui-form-item label="限高颜色">
        <mapgis-ui-sketch-color-picker
            :color.sync="colorCopy"
            :disableAlpha="false"
            class="colorCopy-picker"
        >
        </mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="限制高度">
        <mapgis-ui-slider  :disabled="readonly"
                           :max="maxSliderHeight" :min="minSlider"
                           :step="5"
                           v-model="heightLimit"
                           @change="setInput"/>
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
    <mapgis-3d-draw :vue-key="vueKey" v-on:drawcreate="handleCreate" v-on:load="handleDrawLoad" :drawStyle="drawStyle"
                    :enableControl="enableControl">
      <div class="parent_div">
        <mapgis-ui-group-tab title="绘制区域"></mapgis-ui-group-tab>
        <div style="text-align: right" class="child_div">
          <mapgis-ui-tooltip
              v-for="(item, i) in draws"
              :key="i"
              placement="bottom"
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

export default {
  name: "mapgis-3d-heightlimited",
  mixins: [BaseLayer],
  props: {
    // 模型集合
    models: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: "#ff0000"
    }
  },
  components: {Mapgis3dDraw},
  inject: ["Cesium", "vueCesium", "viewer"],
  data() {
    return {
      //定义
      heightLimit: 10,
      // slider滑块是否禁用
      readonly: false,
      minSlider:0,
      boundingSphere: "",
      waitManagerName: "M3DIgsManager",
      cartesianForHeight: [],
      enableControl: false,
      // 选中模型
      model: null,
      size: "default",
      // radio样式
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      },
      colorCopy: "#ff0000",
      opacityCopy: 0.5,
      maxSliderHeight: 50,
      drawStyle:{
        color:"#ff0000"
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
      ],
      // m3d模型对象
      m3d:undefined
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    models: {
      handler: function (layers) {
        if (layers && layers.length > 0) {
          this.model = layers[layers.length - 1];
        } else {
          this.model = null;
        }
      },
      deep: true,
      immediate: true
    },
    model: {
      deep: true,
      immediate: true,
      handler: function () {
        // this.removeDraw();
        this.remove();
        this.changeModel();
      }
    },
    color: {
      immediate: true,
      handler(next, old) {
        if (!deepEqual(next, old)) {
          this.colorCopy = next;
          this.drawStyle.color = next;
        }
      }
    },
    colorCopy: {
      immediate: true,
      handler(next, old) {
        this.drawStyle.color = next;
        this.remove();
        this.heightLimitedAnalysis();
      }
    },
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
     * 判断传入的m3d图层是否加载完毕
     */
    m3dIsReady() {
      const {vueCesium, vueKey, vueIndex, model} = this;
      return new Promise((resolve, reject) => {
        if (model && model.vueIndex) {
          let id = model.vueIndex;
          let layerIndex = 0;
          if (id.includes(":")) {
            const strs = id.split(":");
            id = strs[0];
            layerIndex = strs[1];
          }
          this.$_getM3DByInterval(
              function (m3ds) {
                if (m3ds && m3ds.length > 0) {
                  if (
                      !m3ds[layerIndex] ||
                      !m3ds[layerIndex].hasOwnProperty("source") ||
                      !m3ds[layerIndex].source
                  ) {
                    reject(null);
                  } else {
                    resolve(m3ds[layerIndex]);
                  }
                } else {
                  reject(null);
                }
              },
              vueKey,
              id
          );
        } else {
          reject(null);
        }
      });
    },

    changeModel() {
      let vm = this;
      this.m3dIsReady().then(m3d => {
        let id = this.model.vueIndex;
        let layerIndex = 0;
        if (id.includes(":")) {
          const strs = id.split(":");
          id = strs[0];
          layerIndex = strs[1];
        }
        const {source} = m3d;
        vm.m3d = m3d;
        vm.zoomToM3dLayerBySource(source[layerIndex]);
        vm.getM3dHeight(source[layerIndex]);
      });
    },

    /**
     * 跳转到模型范围，视角不变。基于source
     * @param source
     */
    zoomToM3dLayerBySource(source) {
      const m3d = this.getM3D();
      m3d.zoomToM3dLayer(source);
    },

    /**
     * 获取M3DLayer对象
     * @returns M3DLayer对象
     */
    getM3D() {
      const {viewer} = this;
      const m3d = new window.CesiumZondy.Layer.M3DLayer({
        viewer: viewer
      });
      return m3d;
    },

    /**
     * 获取模型的高度
     */
    getM3dHeight(source) {
      let vm = this;
      let _boundingVolume = source._root._boundingVolume;
      //求外包盒的高度
      let height = Math.abs(_boundingVolume.maximumHeight - _boundingVolume.minimumHeight);
      this.maxSliderHeight = height;
    },

    /**
     * 开始分析
     */
    startHeightAnalysis() {
      this.heightLimitedAnalysis();
    },

    setInput(data) {
      let vm = this;
      vm.heightLimit = data;
      let { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.HeightLimitedAnalysisManager.findSource(
          vueKey,
          vueIndex
      );
      let { options } = find;
      let { heightLimitedAnalysis } = options;
      if (heightLimitedAnalysis) {
        // 设置限高高度
        heightLimitedAnalysis.height = data;
      }
      // vm.heightLimitedAnalysis();
    },
    removeDraw() {
      this.drawer.unmount();
    },
    drawPolygon() {
      this.drawer && this.drawer.enableDrawPolygon();
    },
    drawRectangle() {
      this.drawer && this.drawer.enableDrawRectangle();
    },
    toggleDelete() {
      this.drawer && this.drawer.removeEntities();
      this.remove();
    },
    handleDrawLoad(drawer) {
      this.drawer = drawer;
    },

    //绘制组件的回调函数
    handleCreate(cartesian3, lnglat) {
      let vm = this;
      this.drawer && this.drawer.removeEntities(true);
      vm.cartesian3 = cartesian3;
      vm.lnglat = lnglat;
      this.heightLimitedAnalysis(lnglat);
      window.drawElement.stopDrawing();
    },

    //开始控高分析
    heightLimitedAnalysis(lnglat) {
      const vm = this;
      // 先remove
      this.remove();
      let {vueKey, vueIndex} = this
      let {heightLimit, vueCesium, viewer} = this;
      //先判断m3d模型是否加载完成
      vm.m3dIsReady().then(m3d => {
        //判断分析方式，不通过绘制矩形和绘制面的方式，则lnglat为空，走if,否则绘制方式就走else
        if (!lnglat) {
          let find = vueCesium.HeightLimitedAnalysisManager.findSource(vueKey, vueIndex);
          if (find && find.options && find.options.lnglat) {
            lnglat = find.options.lnglat;
            // this.remove();
          } else {
            vm._boundingVolume = m3d.source[0]._root._boundingVolume;
            const northeastCornerCartesian = vm._boundingVolume.northeastCornerCartesian;
            const southwestCornerCartesian = vm._boundingVolume.southwestCornerCartesian;
            lnglat = vm.getAllPoint(southwestCornerCartesian, northeastCornerCartesian);
          }
        } else if (lnglat.length === 2) {
          lnglat = vm.getAllPointByDegree(lnglat[0], lnglat[1]);
        } else {
          let temp = [];
          lnglat.forEach((l, index) => {
            let lTemp = {};
            lTemp.longitude = l[0];
            lTemp.latitude = l[1];
            temp[index] = lTemp;
          })
          lnglat = temp;
        }
        vueCesium.HeightLimitedAnalysisManager.changeOptions(
            vm.vueKey,
            vm.vueIndex,
            "lnglat",
            lnglat
        );
        //控高分析边界点数组
        let pnts = [];
        for (let i = 0; i < lnglat.length; i++) {
          pnts.push(new Cesium.Cartesian3(lnglat[i].longitude, lnglat[i].latitude, 0));
        }
        let cesiumColor = Cesium.Color.fromCssColorString(vm.colorCopy);

        //调用控高分析接口
        let heightLimited = new Cesium.HeightLimited(viewer, {
          height: heightLimit,
          limitedColor: cesiumColor,
          blendTransparency: vm.opacityCopy,
          posArray: pnts,
          polygonColor: Cesium.Color.WHITE.withAlpha(0),
          useOutLine: false
        });
        heightLimited.add();
        vueCesium.HeightLimitedAnalysisManager.changeOptions(
            vm.vueKey,
            vm.vueIndex,
            "heightLimitedAnalysis",
            heightLimited
        );
      })
    },


    transformToLocal(cartesian3, findSource) {
      let localCertesian3 = [];
      let transform = findSource.source[0]._root.transform;
      //求逆矩阵
      const inverMatrix = Cesium.Matrix4.inverse(transform, new Cesium.Matrix4());
      //各点的相对坐标
      for (let i = 0; i < cartesian3.length; i++) {
        let point = cartesian3[i];
        let result = Cesium.Matrix4.multiplyByPoint(inverMatrix, point, new Cesium.Cartesian3());
        localCertesian3.push(result);
      }
      return localCertesian3;
    },

    //根据外包盒子两个点求出四个点
    getAllPoint(southwest, northeast) {
      let p1 = this.degreefromCartesian(southwest);
      let p2 = this.degreefromCartesian(northeast);
      let p3 = {}, p4 = {};
      p3.longitude = p1.longitude;
      p3.latitude = p2.latitude;
      p3.height = p1.height;
      p4.longitude = p2.longitude;
      p4.latitude = p1.latitude;
      p4.height = p2.height;
      //p3,p4的笛卡尔坐标
      let p3Caetesian = Cesium.Cartesian3.fromDegrees(p3.longitude, p3.latitude, p3.height);
      let p4Caetesian = Cesium.Cartesian3.fromDegrees(p4.longitude, p4.latitude, p4.height);
      let allPoint = [p1, p4, p2, p3];
      return allPoint;
    },

    //绘制方式返回的点坐标是经纬度坐标
    getAllPointByDegree(lnglat1, lnglat2) {
      let p1 = {}, p2 = {}, p3 = {}, p4 = {};
      p1.longitude = lnglat1[0];
      p1.latitude = lnglat1[1];
      p1.height = lnglat1[2];
      p2.longitude = lnglat2[0];
      p2.latitude = lnglat2[1];
      p2.height = lnglat2[2];
      p3.longitude = p1.longitude;
      p3.latitude = p2.latitude;
      p3.height = p1.height;
      p4.longitude = p2.longitude;
      p4.latitude = p1.latitude;
      p4.height = p2.height;
      let allPoint = [p1, p4, p2, p3];
      return allPoint;
    },

    //根据笛卡尔坐标求出点的经纬度坐标
    degreefromCartesian(p) {
      let point = {};
      let cartographic = Cesium.Cartographic.fromCartesian(p);
      point.longitude = Cesium.Math.toDegrees(cartographic.longitude);
      point.latitude = Cesium.Math.toDegrees(cartographic.latitude);
      point.height = cartographic.height; //模型高度
      return point;
    },

    handleChange(e){
      let a1 = this.models.filter((m)=>{
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
        }
      }
    },
    unmount() {
      let { vueCesium, vueKey, vueIndex} = this;
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

.parent_div{
  width: 100%;
  display: inline-block;
  position: relative;
}
.child_div{
  position: absolute;
  top:0;
  right: 0px;
}
</style>