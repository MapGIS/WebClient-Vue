<template>
  <span />
</template>

<script>
import clonedeep from "lodash.clonedeep";
import PopupMixin from "../Mixin/PopupVirtual";
import BaseLayer from "../GeoJSON/BaseLayer";
import CommonLayer from "../CommonLayer";

export default {
  name: "mapgis-3d-igs-feature-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer, PopupMixin, CommonLayer],
  props: {
    baseUrl: {
      type: String,
      default: undefined,
    },
    gdbps: {
      type: [Array, String],
      default: undefined,
    },
    renderer: {
      type: Object,
      default() {
        return {};
      },
    },
    featureStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    renderMode: {
      type: String,
      default: "client",
    },
    token: {
      type: Object,
      default: () => {},
    },
    commonLayer: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  watch: {
    opacity(val) {
      if (this.igsFeatureLayer) {
        this.igsFeatureLayer.opacity = val;
      }
    },
    visible(val) {
      if (this.igsFeatureLayer) {
        this.igsFeatureLayer.visible = val;
      }
    },
    renderer(val, oldVal) {
      if (this.igsFeatureLayer) {
        this.igsFeatureLayer.renderer = this.generateRenderer(val);
      }
    },
    baseUrl(val) {
      this.unmount();
      this.mount();
    },
    gdbps(val) {
      this.unmount();
      this.mount();
    },
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { viewer, vueCesium } = this;
      const { renderer, featureStyle } = this;

      let transformRenderer;

      this.commonMap = this.generateCommonMap();
      this.sceneView = this.generateSceneView(viewer, this.commonMap);

      if (this.commonLayer) {
        this.igsFeatureLayer = this.commonLayer.clone();
        // 在三维上多边形带有弧度，多个IGSFeatureLayer没有办法控制顺序，需要设置贴地模式
        this.setOnTheGroundElevationInfo(this.igsFeatureLayer);
        this.igsFeatureLayer.renderer = this.generateRenderer(renderer);
      } else {
        this.generateFeatureLayer(this.generateRenderer(renderer));
      }

      if (
        JSON.stringify(renderer) === "{}" &&
        JSON.stringify(featureStyle) !== "{}"
      ) {
        if (!this.igsFeatureLayer.loaded) {
          await this.igsFeatureLayer.load();
        }

        const layerRenderer = this.getFeatureRenderer(
          this.igsFeatureLayer.geometryType,
          featureStyle
        );
        if (layerRenderer) {
          this.igsFeatureLayer.renderer = layerRenderer;
        }
      }

      this.commonMap.add(this.igsFeatureLayer);

      this.layerLoaded();
    },
    layerLoaded() {
      const { vueIndex, vueKey, vueCesium } = this;
      const { gdbps, baseUrl } = this;
      const source = [this.igsFeatureLayer];
      if (this.igsFeatureLayer) {
        vueCesium.IgsFeatureManager.addSource(vueKey, vueIndex, source, {
          url: baseUrl,
          gdbp: gdbps,
          commonLayer: this.igsFeatureLayer,
          sceneView: this.sceneView,
          commonMap: this.commonMap,
        });
      }
      this.$emit("load", this);
    },
    async mount() {
      await this.createCesiumObject();
    },
    generateFeatureLayer(renderer) {
      const { viewer } = this;
      const { baseUrl, renderMode, visible, opacity, token } = this;

      let { gdbps } = this;
      if (typeof gdbps === "string") {
        gdbps = gdbps.split(",");
      }

      const options = {
        url: baseUrl,
        gdbp: gdbps[0],
        renderMode,
        renderer,
        visible,
        opacity,
      };

      if (token.tokenKey && token.tokenValue) {
        options.tokenKey = token.tokenKey;
        options.tokenValue = token.tokenValue;
      }

      this.igsFeatureLayer = this.generateIGSFeatureLayer(options);
    },
    async queryFeaturesAndGenerateLayers(gdbps, baseUrl, renderer) {
      const { viewer } = this;
      const { renderMode, visible, opacity } = this;
      this.igsFeatureLayer = this.generateIGSFeatureLayer({
        url: baseUrl,
        gdbp: gdbps,
        renderMode,
        renderer,
        visible,
        opacity,
      });
      await this.igsFeatureLayer.load();
      const featureSet = await this.igsFeatureLayer.queryFeatures();
      // 保存featureSet，更新的时候使用
      this.featureSet = featureSet.toJSON();
      this.addFeaturesToMap();
    },
    addFeaturesToMap(renderer) {
      const { viewer } = this;
      // 先删除feature
      if (this.primitives) {
        this.primitives.forEach((feature) => {
          viewer.scene.primitives.remove(feature);
        });
      }

      // 保证featureSet不变，更新renderer时不再进行网络请求
      const featuresArr = this.cloneFeatureSet(this.featureSet).features;
      const features = featuresArr.map((feature) => {
        return this.cloneFeature(feature);
      });
      // 设置features的renderer
      this.featureSetApplyRenderer(
        features,
        renderer
          ? this.generateRenderer(renderer)
          : this.igsFeatureLayer.renderer
      );

      this.primitives = this.featureToPrimitive(
        "IGSFeatureLayerUtil",
        features,
        {
          viewer,
        }
      );
      this.primitives.forEach((feature) => {
        viewer.scene.primitives.add(feature);
      });
    },
    unmount() {
      const { vueCesium } = this;
      const { vueKey, vueIndex } = this;
      vueCesium.IgsFeatureManager.deleteSource(vueKey, vueIndex);
      this.commonMap.remove(this.igsFeatureLayer);
      this.igsFeatureLayer = null;
      this.commonMap = null;
      this.sceneView = null;
      this.$emit("unload", this);
    },
  },
};
</script>

<style scoped></style>
