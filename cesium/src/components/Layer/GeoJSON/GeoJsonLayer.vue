<template>
  <span />
</template>

<script>
import clonedeep from "lodash.clonedeep";
import PopupMixin from "../Mixin/PopupVirtual";
import BaseLayer from "./BaseLayer";
import CommonLayer from "../CommonLayer";
import axios from "axios";

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
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { viewer, vueCesium } = this;
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
        JSON.stringify(renderer) === "{}" ? transformRenderer : renderer;

      let dataObj;
      // 如果data是geojson数据直接处理，如果是url地址则请求数据
      if (data instanceof Object) {
        dataObj = data;
      } else {
        dataObj = await this.getGeojsonData(data);
      }
      const { features } = dataObj;
      const featureSet = this.constructFeatureSet(features);
      this.addLayer(viewer, applyRenderer, featureSet);
      this.onGeojsonLoaded(dataObj);
    },
    getGeojsonData(url) {
      return new Promise((resolve, inject) => {
        axios
          .get(url)
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            console.log(`请求Geojson数据地址：${url}失败`);
            inject();
          });
      });
    },
    onGeojsonLoaded(dataObj) {
      const { vueIndex, vueKey, vueCesium } = this;
      if (vueIndex) {
        let source = [this.innerLayer];
        vueCesium.GeojsonManager.addSource(vueKey, vueIndex, source, {
          data: dataObj,
          layerIndex: vueIndex,
        });
        this.$emit("load", this);
      }
    },
    mount() {
      this.createCesiumObject();
    },
    transformObject(renderer) {
      renderer = renderer || {};
      Object.keys(renderer).forEach((key) => {
        if (key == "distanceDisplayCondition") {
          renderer[key] = new Cesium.DistanceDisplayCondition(
            renderer[key][0],
            renderer[key][1]
          );
        }
        if (typeof renderer[key] == "object") {
          this.transformObject(renderer[key]);
        }
        if (key == "color") {
          renderer[key] = Cesium.Color.fromCssColorString(renderer[key]);
        }
      });
    },
    unmount() {
      const { viewer, vueCesium } = this;
      const { vueKey, vueIndex } = this;
      const find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        this.innerLayer.destroy();
      }
      vueCesium.GeojsonManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
  },
};
</script>

<style scoped></style>
