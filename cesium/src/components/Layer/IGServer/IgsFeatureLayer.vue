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
      default: null,
    },
    gdbps: {
      type: String,
      default: null,
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
  methods: {
    async createCesiumObject() {
      const { viewer, vueCesium } = this;
      const { baseUrl, gdbps, renderer, featureStyle } = this;

      let transformRenderer;

      const features = await this.queryFeaturesInLayers(gdbps, baseUrl);

      if (
        JSON.stringify(renderer) === "{}" &&
        JSON.stringify(featureStyle) !== "{}"
      ) {
        const fristFeature = features[0];
        if (fristFeature) {
          const type = fristFeature.geometry.type;
          transformRenderer = this.getRenderer(type, featureStyle);
        }
      }
      this.addLayer(viewer, transformRenderer || renderer, features);

      this.getDocLayer(features);
    },
    getDocLayer() {
      const { vueIndex, vueKey, vueCesium } = this;
      if (vueIndex) {
        const source = [this.innerLayer];
        if (source) {
          vueCesium.IgsFeatureManager.addSource(vueKey, vueIndex, source, {
            url: this.baseUrl,
            layerIndex: vueIndex,
          });
        }
        this.$emit("load", this);
      }
    },
    async mount() {
      await this.createCesiumObject();
    },

    unmount() {
      const { viewer, vueCesium } = this;
      const { vueKey, vueIndex } = this;
      const find = vueCesium.IgsFeatureManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        this.innerLayer.destroy();
      }
      vueCesium.IgsFeatureManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
  },
};
</script>

<style scoped></style>
