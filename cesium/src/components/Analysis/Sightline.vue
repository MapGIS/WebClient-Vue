<template>
  <div class="mapgis-widget-visibility-analysis">
    <mapgis-ui-form-model v-model="formData" v-bind="layout">
      <mapgis-ui-form-model-item label="附加高度(米)">
        <mapgis-ui-input
            v-model.number="formData.exHeight"
            type="number"
            :min="0"
            :step="0.1"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="不可视区域颜色">
        <mapgis-ui-sketch-color-picker
            :disableAlpha="false"
            :color="formData.unVisibleColor"
            @input="
              val =>
                (formData.unVisibleColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
            "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="可视区域颜色">
        <mapgis-ui-sketch-color-picker
            :disableAlpha="false"
            :color="formData.visibleColor"
            @input="
              val =>
                (formData.visibleColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
            "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>
    <mapgis-ui-setting-footer>
      <a-button type="primary" @click="onClickStart">分析</a-button>
      <a-button @click="onClickStop">清除</a-button>
    </mapgis-ui-setting-footer>
  </div>
</template>

<script>
import VueOptions from "../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-sightline",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions
  },
  data() {
    return {
      layout: {
        labelCol: {span: 9},
        wrapperCol: {span: 15},
      },
      formData: {
        exHeight: 1.85,
        visibleColor: '#008000',
        unVisibleColor: '#ff0000'
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

      //clone formData
      formDataCloneVal: undefined,

      //通视分析结果集
      visibilityArr: []
    };
  },
  watch: {
    formDataCloneVal: {
      deep: true,
      handler: function (newVal, oldVal) {
        const unVisibleColor = new this.Cesium.Color.fromCssColorString(
            newVal.unVisibleColor
        )
        const visibleColor = new this.Cesium.Color.fromCssColorString(
            newVal.visibleColor
        )
        if (this.visibilityArr.length > 0) {
          this.visibilityArr.forEach(item => {
            item._unvisibleColor = unVisibleColor;
            item._visibleColor = visibleColor;
            if (newVal.exHeight !== oldVal.exHeight) {
              // 改变通视分析工具的附加高度(分析工具的观察点坐标也会同时更新)
              item.exHeight = newVal.exHeight - oldVal.exHeight;

              // 改变观察点坐标
              this.viewPoint.position._value = item.viewPosition;
              // 记录新的观察点坐标
              this.viewPosition = item.viewPosition;
            }
          })
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
      const {webGlobe, CesiumZondy, vueKey, vueIndex} = this;
      const {viewer} = webGlobe;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        vm.$emit("load", {component: this});
        CesiumZondy.VisiblityAnalysisManager.addSource(
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
      let {CesiumZondy, vueKey, vueIndex} = this;
      this.onClickStop();
      CesiumZondy.VisiblityAnalysisManager.deleteSource(vueKey, vueIndex);
    },
    formDataClone() {
      let vm = this;
      vm.formDataCloneVal = JSON.parse(JSON.stringify(this.formData));
      return vm.formDataCloneVal;
    },
    findSource() {
      let {CesiumZondy, vueKey, vueIndex} = this;
      let find = CesiumZondy.VisiblityAnalysisManager.findSource(vueKey, vueIndex);
      return find;
    },
    // 点击“分析”按钮回调
    onClickStart() {
      this.onClickStop();
      this.webGlobe.viewer.scene.globe.depthTestAgainstTerrain = true;
      // this.isOpenDepthTest()
      this.addEventListener();
    },
    // 创建通视分析工具
    createVisibility() {
  const unVisibleColor = new this.Cesium.Color.fromCssColorString(
      this.formData.unVisibleColor
  )
  const visibleColor = new this.Cesium.Color.fromCssColorString(
      this.formData.visibleColor
  )

  // 初始化高级分析功能管理类
  const advancedAnalysisManager = new window.CesiumZondy.Manager.AdvancedAnalysisManager(
      {
        viewer: this.webGlobe.viewer
      }
  )

  // 初始化通视分析类
  const visibility = advancedAnalysisManager.createVisibilityAnalysis()
  visibility._unvisibleColor = unVisibleColor
  visibility._visibleColor = visibleColor

  this.visibilityArr.push(visibility)

  return visibility
},

    // 点击“结束分析”按钮回调
    onClickStop() {
      // 注销鼠标的各项监听事件
      this.webGlobe.unRegisterMouseEvent('LEFT_CLICK')
      this.webGlobe.unRegisterMouseEvent('RIGHT_CLICK')

      this.webGlobe.viewer.entities.removeAll()

      if (this.visibilityArr.length > 0) {
        this.visibilityArr.forEach(item => {
          // 移除通视分析结果
          this.webGlobe.viewer.scene.VisualAnalysisManager.remove(item)
          // 销毁通视分析类
          item.destroy()
        })
      }

      this.webGlobe.viewer.scene.globe.depthTestAgainstTerrain = false
      this.hasViewPosition = false
      this.isAddEventListener = false
      this.visibilityArr = []
    },

    // 为鼠标的各种行为注册监听事件
    addEventListener() {
      if (!this.isAddEventListener) {
        this.webGlobe.registerMouseEvent('LEFT_CLICK', event => {
          this.registerMouseLClickEvent(event)
        })
        this.webGlobe.registerMouseEvent('RIGHT_CLICK', event => {
          this.registerMouseRClickEvent(event)
        })

        this.isAddEventListener = true
      }
    },

    // 注册通视分析鼠标左键点击事件
    registerMouseLClickEvent(event) {
      let cartesian = this.webGlobe.viewer.getCartesian3Position(event.position)

      if (!this.hasViewPosition && cartesian !== undefined) {
        // 若还未选择观察点,则记录下观察点坐标

        // 获取当前坐标系标准
        const ellipsoid = this.webGlobe.viewer.scene.globe.ellipsoid
        // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
        const cartographic = ellipsoid.cartesianToCartographic(cartesian)
        // 抬高观察点
        cartographic.height += this.formData.exHeight

        cartesian = this.Cesium.Cartographic.toCartesian(cartographic)
        this.viewPosition = cartesian

        // 添加观察点到地图
        this.addViewPoint(cartesian)
        this.hasViewPosition = true
      } else {
        const visibility = this.createVisibility()

        // 设置通视分析观察点坐标
        visibility.viewPosition = this.viewPosition

        // 设置通视分析结束点坐标
        visibility.targetPosition = cartesian

        // 添加目标点到地图
        this.addTargetPoint(cartesian)
      }
    },

    // 注册通视分析鼠标右键点击事件
    registerMouseRClickEvent(event) {
      // 注销鼠标的各项监听事件
      this.webGlobe.unRegisterMouseEvent('LEFT_CLICK')
      this.webGlobe.unRegisterMouseEvent('RIGHT_CLICK')
      this.isAddEventListener = false
    },

    // 添加观察点到地图上
    addViewPoint(cartesian) {
      this.removeViewPoint()

      this.viewPoint = this.webGlobe.viewer.entities.add({
        position: cartesian,
        point: {
          color: this.Cesium.Color.BLUE,
          pixelSize: 10
        }
      })
    },

    // 添加目标点到地图上
    addTargetPoint(cartesian) {
      this.removeTargetPoint()

      this.targetPoint = this.webGlobe.viewer.entities.add({
        position: cartesian,
        point: {
          color: this.Cesium.Color.RED,
          pixelSize: 10
        }
      })
    },

    // 从地图上移除观察点
    removeViewPoint() {
      if (this.viewPoint) this.webGlobe.viewer.entities.remove(this.viewPoint)
    },

    // 从地图上移除目标点
    removeTargetPoint() {
      if (this.targetPoint) this.webGlobe.viewer.entities.remove(this.targetPoint)
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
};
</script>

<style scoped>
::v-deep .mapgis-ui-card-body {
  /*max-height: 400px;*/
  /*overflow: auto;*/
  padding: 16px;
}

::v-deep .mapgis-ui-form-item-label {
  line-height: 40px;
}
::v-deep .mapgis-ui-form label {
  font-size: 12px;
}
::v-deep .mapgis-ui-form-item {
  margin-bottom: 0;
}
::v-deep .mapgis-ui-input-affix-wrapper .mapgis-ui-input:not(:first-child) {
  padding-left: 45px;
}
</style>