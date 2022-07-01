<template>
  <div class="mapgis-popup-default-wrapper">
    <div v-if="popVisiable">
      <Popup
        :position="iClickPosition"
        :visible="iClickVisible"
        :forceRender="forceRender"
      >
        <mapgis-ui-popup-content
          :feature="gemotryAttribute[0]"
          :popupOptions="popupOptions"
        >
        </mapgis-ui-popup-content>
      </Popup>
    </div>
  </div>
</template>

<script>
import clonedeep from "lodash.clonedeep";
import PopupMixin from "../Mixin/PopupVirtual";
import BaseLayer from "../GeoJSON/BaseLayer";

export default {
  name: "mapgis-3d-igs-feature-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer, PopupMixin],
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    gdbps: {
      type: String,
      default: null
    },
    renderer: {
      type: Object,
      default() {
        return {}
      }
    },
    filter: {
      type: Object,
      default: null
    },
    clampToGround: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      layerIndex: undefined,
      layer: undefined,
      layerRange: [],
      clickhandler: undefined,
      hoverhandler: undefined,
      tempHighlightdata: undefined
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    baseUrl: {
      handler: function () {
        this.unmount();
        this.mount();
      },
    },
    autoReset: {
      handler(value) {
        this.unmount();
        this.mount();
      },
      deep: true
    },
    renderer: {
      handler(value) {
        this.mount();
      },
      deep: true
    }
  },
  methods: {
    async createCesiumObject() {
      let {viewer, vueCesium} = this;
      let { baseUrl, gdbps, autoReset, renderer, filter, clampToGround} = this;
      let vm = this;
      let options = {
        autoReset,
        loadAll: true,
        renderer,
        clampToGround,
        filter: filter
      };
      if (baseUrl.indexOf("/igs/rest/mrfs/layer") !== -1) {
        options.layers = gdbps;
      }
      let transformRenderer = JSON.parse(JSON.stringify(renderer));
      this.transformObject(transformRenderer);
      options.renderer = transformRenderer;
      return new Promise(
        resolve => {
          let layerIndex = viewer.scene.layers.appendFeatureLayer(baseUrl, {
            ...options,
            getDocLayerIndexes: vm.getDocLayer
          });
          resolve({ layerIndex: layerIndex });
        },
        reject => {}
      );
    },
    getDocLayer(index) {
      const vm = this;
      const { vueIndex, vueKey, vueCesium, url, enablePopup } = this;
      if (index) {
        vm.layerIndex = index;
        vm.layer = viewer.scene.layers.getFeatureLayer(vm.layerIndex[0]);
        let source = [vm.layer];
        if (source) {
          vueCesium.IgsFeatureManager.addSource(vueKey, vueIndex, source, {
            url: baseUrl,
            layerIndex: dataSource.layerIndex,
            clickhandler: vm.clickhandler,
            hoverhandler: vm.hoverhandler,
          });
          vm.layerRange = vm.layer._layerRange;
          vm.parseBBox(vm.layerRange);
        }
        vm.$emit("load", { data: vm });
      }
    },
    mount() {
      let {viewer, vueCesium, vueKey, vueIndex, baseUrl, gdbps, enablePopup} = this;

      // 判断是否支持图像渲染像素化处理
      viewer.shadows = true;
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) { 
        viewer.resolutionScale = window.devicePixelRatio;
      };
      // 是否开启抗锯齿
      viewer.scene.fxaa = true;
      viewer.scene.postProcessStages.fxaa.enabled = true;
      this.checkType();
      let promise = this.createCesiumObject();
      let vm = this;
      promise.then(function (dataSource) {
        // 增加图层click和hover事件，在组件外部获得对象
        vm.$_bindClickEvent(vm.parseClick);
        vm.$_bindHoverEvent(vm.parseHover);
        if (vm.enablePopup) {
          vm.clickhandler = vm.$_bindClickEvent(vm.clickHighlight);
        }
        if (vm.enableClick) {
          vm.clickhandler = vm.$_bindClickEvent(vm.clickHighlight);
        }
        if (vm.enableHover) {
          vm.hoverhandler = vm.$_bindHoverEvent(vm.hoverHighlight);
        }
        if (vm.enableQuery) {
          vm.queryPrimitive();
        }
      });
    },
    transformObject(renderer) {
      renderer = renderer || {};
      Object.keys(renderer).forEach( key => {
        if (key == "distanceDisplayCondition") {
          renderer[key] = new Cesium.DistanceDisplayCondition(renderer[key][0], renderer[key][1]);
        }
        if (typeof(renderer[key]) == "object") {
          this.transformObject(renderer[key]);
        }
        if (key == "color") {
          renderer[key] = Cesium.Color.fromCssColorString(renderer[key]);
        }
      })
    },
    unmount() {
      let {viewer, vueCesium} = this;
      const {vueKey, vueIndex, layerIndex} = this;
      let find = vueCesium.IgsFeatureManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        viewer.scene.layers.removeFeatureLayerByID(layerIndex);
      }
      if (find && find.clickhandler) {
        find.clickhandler.destroy();
      }
      if (find && find.hoverhandler) {
        find.hoverhandler.destroy();
      }
      vueCesium.IgsFeatureManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    // 组件回调
    parseClick(payload) {
      this.$emit("featureClick", {pick: payload});
    },
    parseHover(payload) {
      this.$emit("featureHover", {pick: payload});
    },
    parseBBox(bbox) {
      this.$emit("bbox", { bbox: bbox });
    },
  }
}
</script>

<style scoped>

</style>