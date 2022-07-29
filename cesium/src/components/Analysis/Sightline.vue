<template>
  <div>
    <slot>
      <div class="mapgis-widget-visibility-analysis">
    <mapgis-ui-setting-form v-model="formData" :layout="layout" size="default">
      <mapgis-ui-form-item label="附加高度">
        <mapgis-ui-input-number-addon
            v-model.number="formData.exHeight"
            addon-after="米"
            :min="0"
            :step="0.1"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="不可视区域颜色">
        <mapgis-ui-sketch-color-picker
            :disableAlpha="false"
            :color="formData.unVisibleColor"
            @input="
            val =>
              (formData.unVisibleColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="可视区域颜色">
        <mapgis-ui-sketch-color-picker
            :disableAlpha="false"
            :color="formData.visibleColor"
            @input="
            val =>
              (formData.visibleColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="onClickStart"
      >通视分析
      </mapgis-ui-button
      >
      <mapgis-ui-button type="primary" @click="doLookAroundAnalysis"
      >环视通视分析
      </mapgis-ui-button
      >
      <mapgis-ui-button @click="onClickStop">清除</mapgis-ui-button>
    </mapgis-ui-setting-footer>
    <mapgis-ui-mask
        :loading="maskShow"
        :parentDivClass="'cesium-map-wrapper'"
        :percent="percent"
        :text="maskText"
    ></mapgis-ui-mask>
  </div>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";
import {
  isDepthTestAgainstTerrainEnable,
  setDepthTestAgainstTerrainEnable
} from "../WebGlobe/util";

export default {
  name: "mapgis-3d-sightline",
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
     * @default 1.85
     * @description 观察点的附加高度
     */
    exHeight: {
      type: Number,
      default: 1.85
    },
    /**
     * @type String
     * @default '#008000'
     * @description 可视区域颜色
     */
    visibleColor: {
      type: String,
      default: "#008000"
    },
    /**
     * @type String
     * @default '#ff0000'
     * @description 不可视区域颜色
     */
    unVisibleColor: {
      type: String,
      default: "#ff0000"
    }
  },
  data() {
    return {
      formData: {
        exHeight: 1.85,
        visibleColor: "#008000",
        unVisibleColor: "#ff0000"
      },
      // 是否为鼠标注册了监听事件
      isAddEventListener: false,

      // 是否已选择观察点位置
      hasViewPosition: false,

      // 观察点
      viewPoint: undefined,

      // 目标点
      targetPoint: undefined,

      // 观察点坐标
      viewPosition: undefined,

      //通视分析结果集
      visibilityArr: [],

      isDepthTestAgainstTerrainEnable: undefined, // 深度检测是否已开启，默认为undefined，当这个值为undefined的时候，说明没有赋值，不做任何处理

      handlerAction: undefined,

      percent: 0,
      maskShow: false,
      maskText: '正在分析中, 请稍等...0%',
    };
  },
  computed: {
    formDataNew() {
      return JSON.parse(JSON.stringify(this.formData));
    }
  },
  watch: {
    exHeight: {
      handler: function (newVal, oldVal) {
        this.formData.exHeight = newVal;
      },
      immediate: true
    },
    visibleColor: {
      handler: function (newVal, oldVal) {
        this.formData.visibleColor = newVal;
      },
      immediate: true
    },
    unVisibleColor: {
      handler: function (newVal, oldVal) {
        this.formData.unVisibleColor = newVal;
      },
      immediate: true
    },
    formDataNew: {
      deep: true,
      handler: function (newVal, oldVal) {
        const unVisibleColor = new this.Cesium.Color.fromCssColorString(
            newVal.unVisibleColor
        );
        const visibleColor = new this.Cesium.Color.fromCssColorString(
            newVal.visibleColor
        );
        let find = this.findSource();
        if (this.visibilityArr.length > 0) {
          this.visibilityArr.forEach(item => {
            if (find.options.visiblityAnalysis) {
              let visiblityAnalysis = find.options.visiblityAnalysis;
              visiblityAnalysis.unvisibleColor = unVisibleColor;
              visiblityAnalysis.visibleColor = visibleColor;
              item.unvisibleColor = unVisibleColor;
              item.visibleColor = visibleColor;
              if (newVal.exHeight !== oldVal.exHeight) {
                // 改变通视分析工具的附加高度(分析工具的观察点坐标也会同时更新)
                visiblityAnalysis.exHeight = newVal.exHeight - oldVal.exHeight;
                // 改变观察点坐标
                this.viewPoint.position._value = item.viewPosition;
                // 记录新的观察点坐标
                this.viewPosition = item.viewPosition;
              }
            }
          });
        }
      }
    }
  },
  methods: {
    async createCesiumObject() {
      const {baseUrl, options} = this;
      // return new Cesium.GeoJsonDataSource.load(baseUrl, options);
      return new Promise(
          resolve => {
            resolve();
          },
          reject => {
          }
      );
    },
    mount() {
      const {vueCesium, vueKey, vueIndex} = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        vm.$emit("load", vm);
        vueCesium.VisiblityAnalysisManager.addSource(
            vueKey,
            vueIndex,
            dataSource,
            {
              visiblityAnalysis: null
            }
        );
      });
    },
    unmount() {
      let {vueCesium, vueKey, vueIndex} = this;
      this.onClickStop();
      vueCesium.VisiblityAnalysisManager.deleteSource(vueKey, vueIndex);
    },

    findSource() {
      let {vueCesium, vueKey, vueIndex} = this;
      let find = vueCesium.VisiblityAnalysisManager.findSource(
          vueKey,
          vueIndex
      );
      return find;
    },
    // 点击“分析”按钮回调
    onClickStart() {
      //开启三维视图事件处理（例如鼠标点击）
      this.startEventHandler();
      this.onClickStop();
      //深度检测开启
      this.isDepthTestAgainstTerrainEnable = isDepthTestAgainstTerrainEnable(
          this.viewer
      );
      if (!this.isDepthTestAgainstTerrainEnable) {
        // 如果深度检测没有开启，则开启
        setDepthTestAgainstTerrainEnable(true, this.viewer);
      }
      this.addEventListener();
    },
    doLookAroundAnalysis() {
      let vm  = this;
      // this.startEventHandler();
      if (!this.isDepthTestAgainstTerrainEnable) {
        // 如果深度检测没有开启，则开启
        setDepthTestAgainstTerrainEnable(true, this.viewer);
      }
      // this.addEventListener();
      let visibility;
      let find = this.findSource();
      if (find && find.options && find.options.visiblityAnalysis) {
        visibility = find.options.visiblityAnalysis;
        this.visibilityArr.push(visibility);
      } else {
        visibility = this.createVisibility();
      }
      let drawElement = new Cesium.DrawElement(this.viewer);
      let cesiumColor = Cesium.Color.fromCssColorString("#FF0000"
      ).withAlpha(0.5);
      drawElement.setGroundPrimitiveType('BOTH');
      drawElement.startDrawingCircle({
        color:cesiumColor,
        callback: function (result) {
          drawElement.setGroundPrimitiveType('NONE');
          drawElement.stopDrawing();

          vm.toggleMask(true);

          visibility.lookAroundAnalysis({
            viewPosition: result.center,
            radius: result.radius,
            percentCallback: vm.setPercent
          });
        }
      });
    },
    setPercent(result) {
      let vm = this;
      vm.percent = result;
      vm.maskText = `正在分析中, 请稍等...${Number((result * 100).toFixed(2))}%`;
      const timer = setInterval(() => {
        if (vm.percent === 1) {
          vm.toggleMask(false);
          vm.$emit("success");
        }
        clearInterval(timer);
      }, 100)
    },

    toggleMask(status) {
      this.maskShow = status;
    },

    startEventHandler() {
      this.handlerAction = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    },
    // 创建通视分析工具
    createVisibility() {
      let {viewer} = this;
      const unVisibleColor = new this.Cesium.Color.fromCssColorString(
          this.formData.unVisibleColor
      );
      const visibleColor = new this.Cesium.Color.fromCssColorString(
          this.formData.visibleColor
      );

      // 初始化通视分析类
      const visibility = new Cesium.VisiblityAnalysis({scene: viewer.scene});
      visibility.unvisibleColor = unVisibleColor;
      visibility.visibleColor = visibleColor;
      // 添加通视分析结果显示
      viewer.scene.visualAnalysisManager.add(visibility);
      this.visibilityArr.push(visibility);
      return visibility;
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

    // 点击“结束分析”按钮回调
    onClickStop() {
      // 注销鼠标的各项监听事件
      if (this.handlerAction){
        this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      }
      this.viewer.entities.removeAll();

      if (this.visibilityArr.length > 0 && !this.maskShow) {
        this.visibilityArr.forEach(item => {
          // 移除通视分析结果
          this.viewer.scene.visualAnalysisManager.remove(item);
          // 销毁通视分析类
          item.destroy();
        });
        this.visibilityArr = [];
      }
      //恢复深度检测的原始设置
      this._restoreDepthTestAgainstTerrain();
      this.hasViewPosition = false;
      this.isAddEventListener = false;
    },

    // 为鼠标的各种行为注册监听事件
    addEventListener() {
      if (!this.isAddEventListener) {

        const visibility = this.createVisibility();

        this.handlerAction.setInputAction(event => {
          this.registerMouseLClickEvent(event,visibility);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.handlerAction.setInputAction(event => {
          this.registerMouseRClickEvent(event);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        this.handlerAction.setInputAction(event => {
          this.registerMouseMoveEvent(event,visibility);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.isAddEventListener = true;
      }
    },

    // 注册通视分析鼠标左键点击事件
    registerMouseLClickEvent(event,visibility) {
      let {vueKey, vueIndex,vueCesium} = this;
      let cartesian = this.viewer.getCartesian3Position(
          event.position
      );
      if (!this.hasViewPosition && cartesian !== undefined) {
        // 若还未选择观察点,则记录下观察点坐标

        // 获取当前坐标系标准
        const ellipsoid = this.viewer.scene.globe.ellipsoid;
        // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
        const cartographic = ellipsoid.cartesianToCartographic(cartesian);
        // 抬高观察点
        cartographic.height += this.formData.exHeight;

        cartesian = this.Cesium.Cartographic.toCartesian(cartographic);
        visibility.viewPosition = cartesian;

        this.viewPosition = cartesian;
        // 添加观察点到地图
        // this.addViewPoint(cartesian);
        this.hasViewPosition = true;
      } else {

        const visibility = this.createVisibility();

        // 设置通视分析观察点坐标
        visibility.viewPosition = this.viewPosition;

        // 设置通视分析结束点坐标
        visibility.targetPosition = cartesian;

        //修改manager的options
        vueCesium.VisiblityAnalysisManager.changeOptions(
            vueKey,
            vueIndex,
            "visiblityAnalysis",
            visibility
        );

        // 添加目标点到地图
        // this.addTargetPoint(cartesian);
      }
    },

    // 注册通视分析鼠标右键点击事件
    registerMouseRClickEvent(event) {


      // 注销鼠标的各项监听事件
      this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.isAddEventListener = false;
    },

    // 注册通视分析鼠标移动事件
    registerMouseMoveEvent(event,visiblity) {
      let {vueKey, vueIndex} = this;
      let cartesian = this.viewer.getCartesian3Position(
          event.endPosition
      );
      if (cartesian) {
        visiblity.targetPosition = cartesian;
      }
    },

    // 添加观察点到地图上
    addViewPoint(cartesian) {
      this.removeViewPoint();

      this.viewPoint = this.viewer.entities.add({
        position: cartesian,
        point: {
          color: this.Cesium.Color.BLUE,
          pixelSize: 10
        }
      });
    },

    // 添加目标点到地图上
    addTargetPoint(cartesian) {
      this.removeTargetPoint();

      this.targetPoint = this.viewer.entities.add({
        position: cartesian,
        point: {
          color: this.Cesium.Color.RED,
          pixelSize: 10
        }
      });
    },

    // 从地图上移除观察点
    removeViewPoint() {
      if (this.viewPoint) this.viewer.entities.remove(this.viewPoint);
    },

    // 从地图上移除目标点
    removeTargetPoint() {
      if (this.targetPoint)
        this.viewer.entities.remove(this.targetPoint);
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  }
};
</script>

<style scoped>
::v-deep .mapgis-ui-card-body {
  /*max-height: 400px;*/
  /*overflow: auto;*/
  padding: 16px;
}

::v-deep .mapgis-ui-form-item-label {
  /* line-height: 40px; */
}

::v-deep .mapgis-ui-form label {
  /* font-size: 12px; */
}

::v-deep .mapgis-ui-form-item {
  margin-bottom: 0;
}

::v-deep .mapgis-ui-input-affix-wrapper .mapgis-ui-input:not(:first-child) {
  padding-left: 45px;
}
</style>
