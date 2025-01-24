<template>
  <span />
</template>

<script>
import CommonLayer from "../CommonLayer";

export default {
  name: "mapgis-3d-ogc-wfs-layer",
  inject: ["Cesium", "vueCesium", "viewer"], // 地图脚本Cesium
  mixins: [CommonLayer],
  props: {
    vueKey: {
      type: String,
      default: "default",
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      },
    },
    baseUrl: {
      type: String,
      default: null,
    },
    renderer: {
      type: Object,
    },
    opacity: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    index: { type: Number },
    sublayerId: { type: String, default: "Map_湖北省4326:t70" },
  },
  data() {
    return {};
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    index(val) {
      if (this.wfsLayer) {
        this.wfsLayer.index = typeof val === "number" ? val : 0;
      }
    },
    sublayerId(val) {
      if (this.wfsLayer) {
        this.wfsLayer.sublayerId = sublayerId;
      }
    },
    opacity(val) {
      if (this.wfsLayer) {
        this.wfsLayer.opacity = val;
      }
    },
    visible(val) {
      if (this.wfsLayer) {
        this.wfsLayer.visible = val;
      }
    },
    renderer(val, oldVal) {
      if (this.wfsLayer) {
        this.wfsLayer.renderer = this.generateRenderer(val);
      }
    },
  },
  methods: {
    async mount() {
      const { baseUrl, renderer, opacity, visible, index, sublayerId } = this;

      this.generateLayer({
        url: baseUrl,
        renderer: renderer ? this.generateRenderer(renderer) : null,
        opacity,
        visible,
      });

      // 判断传入的是index还是sublayerId，都无默认index=0
      if (sublayerId) {
        this.wfsLayer.sublayerId = sublayerId;
      } else {
        this.wfsLayer.index = typeof index === "number" ? index : 0;
      }

      this.commonMap = this.generateCommonMap();
      this.sceneView = this.generateSceneView(viewer, this.commonMap);
      this.commonMap.add(this.wfsLayer);
      this.onWFSLayerLoaded();
    },
    generateLayer(options) {
      this.wfsLayer = this.generateWFSLayer(options);
    },
    onWFSLayerLoaded() {
      const { vueCesium, vueKey, vueIndex } = this;
      const source = [this.wfsLayer];
      vueCesium.OGCWFSManager.addSource(vueKey, vueIndex, source, {
        url: this.baseUrl,
        sceneView: this.sceneView,
        commonMap: this.commonMap,
      });
      this.$emit("load", { data: this });
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      vueCesium.OGCWFSManager.deleteSource(vueKey, vueIndex);
      this.commonMap.remove(this.wfsLayer);
      this.wfsLayer = null;
      this.commonMap = null;
      this.sceneView = null;
      this.$emit("unload", this);
    },
  },
};
</script>
