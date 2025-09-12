<template>
  <span />
</template>

<script>
import clonedeep from "lodash.clonedeep";
import PopupMixin from "../Mixin/PopupVirtual";
import BaseLayer from "./BaseLayer";
import CommonLayer from "../CommonLayer";
import { Projection, SpatialReference } from "@mapgis/webclient-common";

export default {
  name: "mapgis-3d-geojson-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer, PopupMixin, CommonLayer],
  props: {
    renderer: {
      type: Object,
      default() {
        return {};
      },
    },
    data: [String, Object],
    layerStyle: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  watch: {
    opacity(val) {
      if (this.geojsonLayer) {
        this.geojsonLayer.opacity = val;
      }
    },
    visible(val) {
      if (this.geojsonLayer) {
        this.geojsonLayer.visible = val;
      }
    },
    renderer(val, oldVal) {
      if (this.geojsonLayer) {
        this.geojsonLayer.renderer = this.generateRenderer(val);
      }
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
      const { viewer, vueCesium, Cesium } = this;
      const { data, renderer, layerStyle } = this;

      let transformRenderer;
      if (layerStyle) {
        const { type } = layerStyle;
        switch (type) {
          case "point":
            transformRenderer = this.getSimplePointRenderer(layerStyle);
            break;
          case "line":
            transformRenderer = this.getSimpleLineRenderer(layerStyle);
            break;
          case "fill":
            transformRenderer = this.getSimplePolygonRenderer(layerStyle);
            break;
          default:
            break;
        }
      }
      // 若未配置样式则使用layerStyle的样式
      const applyRenderer =
        JSON.stringify(renderer) === "{}"
          ? transformRenderer
          : this.generateRenderer(renderer);

      this.commonMap = this.generateCommonMap();
      this.sceneView = this.generateSceneView(viewer, this.commonMap);
      this.generateLayer(data, applyRenderer);
      this.commonMap.add(this.geojsonLayer);
      const { autoReset } = this;
      this.geojsonLayer.load().then((layer) => {
        if (autoReset) {
          const projectedGeometry = Projection.project(
            layer.extent,
            new SpatialReference({
              wkid: 4326,
            })
          );
          const { xmin, ymin, xmax, ymax } = projectedGeometry;
          const rectangle = new Cesium.Rectangle.fromDegrees(
            xmin,
            ymin,
            xmax,
            ymax
          );
          viewer.camera.flyTo({
            destination: rectangle,
          });
        }
      });
      this.onGeojsonLayerLoaded();
    },
    generateLayer(data, renderer) {
      this.geojsonLayer = this.generateGeoJSONLayer({
        url: data,
        renderer,
      });
    },
    onGeojsonLayerLoaded() {
      const { vueIndex, vueKey, vueCesium } = this;
      const { data } = this;
      if (vueIndex) {
        let source = [this.geojsonLayer];
        vueCesium.GeojsonManager.addSource(vueKey, vueIndex, source, {
          data,
          sceneView: this.sceneView,
          commonMap: this.commonMap,
        });
        this.$emit("load", this);
      }
    },
    mount() {
      this.createCesiumObject();
    },
    unmount() {
      const { vueCesium } = this;
      const { vueKey, vueIndex } = this;
      vueCesium.GeojsonManager.deleteSource(vueKey, vueIndex);
      this.commonMap.remove(this.geojsonLayer);
      this.geojsonLayer = null;
      this.commonMap = null;
      this.sceneView = null;
      this.$emit("unload", this);
    },
  },
};
</script>

<style scoped></style>
