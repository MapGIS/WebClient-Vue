<template>
  <div>
  </div>
</template>
<script>
import clonedeep from "lodash.clonedeep";
import PopupMixin from "../Mixin/PopupVirtual";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-3d-geojson-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer, PopupMixin],
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    renderer: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      layerIndex: undefined,
      layer: undefined,
      layerRange: [],
      clickhandler: undefined,
      hoverhandler: undefined,
      tempHighlightdata: undefined,
      tempQueryDataArr: []
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
        this.unmount();
        this.mount();
      },
      deep: true
    }
  },
  methods: {
    async createCesiumObject() {
      let {viewer, vueCesium} = this;
      let { baseUrl, gdbps, autoReset, renderer} = this;
      let vm = this;
      let options = {
        autoReset,
        loadAll: true,
        renderer,
        getDocLayerIndexes: indexs => {
          this.layerIndex = indexs[0];
        },
        clampToGround: false
      };
      let transformRenderer = JSON.parse(JSON.stringify(renderer));
      this.transformObject(transformRenderer);
      options.renderer = transformRenderer;

      return new Promise(
        resolve => {
          let layerIndex = viewer.scene.layers.appendGeojsonLayer(baseUrl, {
            ...options,
            loaded: vm.onGeojsonLoaded
          });
          resolve({ layerIndex: layerIndex });
        },
        reject => {}
      );
    },
    onGeojsonLoaded(layer) {
      const vm = this;
      const { vueIndex, vueKey, vueCesium, baseUrl } = this;
      if (layer) {
        vm.layer = layer;
        let source = layer;
        vueCesium.GeojsonManager.addSource(vueKey, vueIndex, source, {
          url: baseUrl,
          layerIndex: vm.layerIndex,
          clickhandler: vm.clickhandler,
          hoverhandler: vm.hoverhandler,
        });
        vm.layerRange = vm.layer._layerRange;
        vm.parseBBox(vm.layerRange);
        vm.$emit("load", { data: vm });
      }
    },
    mount() {
      let {viewer, vueCesium, vueKey, vueIndex, baseUrl} = this;
      let vm = this;

      // 判断是否支持图像渲染像素化处理
      viewer.shadows = true;
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) { 
        viewer.resolutionScale = window.devicePixelRatio;
      };
      // 是否开启抗锯齿
      viewer.scene.fxaa = true;
      viewer.scene.postProcessStages.fxaa.enabled = true;

      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        // vm.layer = viewer.scene.layers.getGeojsonLayer(dataSource.layerIndex);
        // 增加图层click和hover事件，在组件外部获得对应entity
        vm.$_bindClickEvent(vm.parseClick);
        vm.$_bindHoverEvent(vm.parseHover);
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
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        viewer.scene.layers.removeGeojsonLayerByID(layerIndex);
      }
      if (find && find.clickhandler) {
        find.clickhandler.destroy();
      }
      if (find && find.hoverhandler) {
        find.hoverhandler.destroy();
      }
      vueCesium.GeojsonManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    // 组件回调
    parseClick(payload) {
      this.$emit("geojsonClick", {pick: payload});
    },
    parseHover(payload) {
      this.$emit("geojsonHover", {pick: payload});
    },
    parseBBox(bbox) {
      this.$emit("bbox", { bbox: bbox });
    },
  }
}
</script>

<style scoped>

</style>