<template>
  <div>
    <mp-3d-marker-set-pro
      :vue-key="vueKey"
      :markers="markers"
      @mouseenter="mouseEnterEvent"
      @mouseleave="mouseLeaveEvent"
      @popupload="popupLoad"
    >
      <template slot="popup" slot-scope="slotProps">
        <slot name="popup" v-bind="slotProps"></slot>
      </template>
    </mp-3d-marker-set-pro>
  </div>
</template>

<script>
import Mp3dMarkerSetPro from "./3dMarkerSetPro.vue";

export default {
  name: "mapgis-3d-marker-plotting",
  components: { Mp3dMarkerSetPro },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    vueKey: String,
    filterWithMap: {
      type: Boolean,
      default: false
    },
    selectedMarkers: {
      default: () => []
    },
    markers: {
      type: Array,
      required: true
    },
    fitBound: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selectionBound: {
      type: Object,
      default: () => {
        return {};
      }
    },
    center: {
      type: Array,
      default: () => {
        return [0, 0];
      }
    },
    highlightStyle: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      entityNames: [],
      currentLayer: null
    };
  },
  watch: {
    selectedMarkers: {
      handler(markers, prevMarkers = []) {
        prevMarkers.forEach(this.onClearHighlightFeature);
        markers.forEach(this.onHighlightFeature);
      }
    },
    fitBound(nV) {
      if (nV) {
        this.zoomTo(nV);
      }
    },
    selectionBound(nV) {
      this.zoomOrPanTo(nV);
    },
    center(nV) {
      this.zoomToCartesian3(nV[0], nV[1]);
    }
  },
  mounted() {
    const _webGlobe =
      this.CesiumZondy.getWebGlobe(this.vueKey) || this.webGlobe;
    const cesiumZondyWebGlobe = [this.Cesium, this.CesiumZondy, _webGlobe];
    this.sceneControllerWebGlobe = _webGlobe;
    this.analysisManager = new this.CesiumZondy.Manager.AnalysisManager({
      viewer: _webGlobe.viewer
    });
  },
  destroyed() {
    this.analysisManager = null;
  },
  methods: {
    changeFilterWithMap() {
      if (!this.filterWithMap) {
        return;
      }
      const cExtent = this.sceneController.getCurrentExtent();
      const bounds = {
        xmin: cExtent.xmin,
        ymin: cExtent.ymin,
        xmax: cExtent.xmax,
        ymax: cExtent.ymax
      };
      this.$emit("map-bound-change", bounds);
    },
    zoomToCartesian3(x, y) {
      const destination = this.sceneController.getCartesian3FromDegrees(
        x,
        y,
        this.sceneController.getPositionCartographicHeight()
      );
      this.sceneController.cameraFlyTo({ destination });
    },
    zoomTo(bound) {
      const destination = this.sceneController.getRectangleFromDegrees(bound);
      this.sceneController.cameraFlyTo({ destination });
    },
    zoomOrPanTo({ xmin, ymin, xmax, ymax }) {
      const {
        xmin: b_xmin,
        ymin: b_ymin,
        xmax: b_xmax,
        ymax: b_ymax
      } = this.getViewExtend();
      // 先查看是否在地图范围内
      if (xmin > b_xmin && ymin > b_ymin && xmax < b_xmax && ymax < b_ymax) {
        return;
      }
      // 然后查看两个矩形的范围大小，如果选择集的范围较当前大，需要做缩放
      if (xmax - xmin > b_xmax - b_xmin || ymax - ymin > b_ymax - b_ymin) {
        this.zoomTo({ xmin, ymin, xmax, ymax });
      } else {
        this.zoomToCartesian3((xmin + xmax) / 2, (ymin + ymax) / 2);
      }
    },
    mouseEnterEvent(e, id) {
      // 高亮要素
      const marker = this.markers.find(marker => marker.markerId == id);

      if (marker) {
        this.highlightFeature(marker);
      }
    },
    mouseLeaveEvent(e, id) {
      this.clearHighlight();
      this.stopDisplay();
    },
    popupLoad(markerId) {
      this.$emit("popupload", markerId);
    },
    highlightFeature({ feature }) {
      const featureGeoJSON = {
        features: [feature],
        type: "FeatureCollection"
      };
      // 需要根据要素类型来使用不同的type
      if (featureGeoJSON.features[0].geometry.type === "Point") {
        // 点要素的高亮符号怎么处理?
      } else if (featureGeoJSON.features[0].geometry.type === "LineString") {
        const lineColor = new this.Cesium.Color.fromCssColorString(
          this.highlightStyle.feature.line.color
        );
        for (let i = 0; i < featureGeoJSON.features.length; i += 1) {
          const coords = featureGeoJSON.features[i].geometry.coordinates;
          const name = `result-entity-${i}`;
          this.entityNames.push(name);
         /*  this.sceneOverlays.addLine({
            name: name,
            pointsArray: coords
              .join(",")
              .split(",")
              .map(Number),
            width: this.highlightStyle.feature.line.size,
            color: lineColor
          }); */
        }
      } else if (featureGeoJSON.features[0].geometry.type === "Polygon") {
        const fillColor = new this.Cesium.Color.fromCssColorString(
          this.highlightStyle.feature.reg.color
        );
        const fillOutlineColor = new this.Cesium.Color.fromCssColorString(
          this.highlightStyle.feature.line.color
        );
        for (let i = 0; i < featureGeoJSON.features.length; i += 1) {
          const coords = featureGeoJSON.features[i].geometry.coordinates[0];
          const name = `result-entity-${i}`;
          this.entityNames.push(name);
          /* this.sceneOverlays.addPolygon(
            name,
            coords
              .join(",")
              .split(",")
              .map(Number),
            fillColor,
            fillOutlineColor
          ); */
        }
      } else if (featureGeoJSON.features[0].geometry.type === "3DPolygon") {
        const { source } = this.sceneController.findSource(
          featureGeoJSON.features[0].properties.specialLayerId
        );
        if (source && source.length > 0) {
          this.stopDisplay();
          this.currentLayer = [source[0]];
          const idList = [featureGeoJSON.features[0].properties.FID];
          const options = {
            // 高亮颜色
            color: new this.Cesium.Color.fromCssColorString(
              this.highlightStyle.feature.reg.color
            ),
            // 高亮模式：REPLACE为替换
            colorBlendMode: this.Cesium.Cesium3DTileColorBlendMode.REPLACE
          };
          // 开始闪烁查找到的模型
          this.analysisManager.startCustomDisplay(
            this.currentLayer,
            idList,
            options
          );
        }
      }
    },
    stopDisplay() {
      if (this.currentLayer) {
        this.analysisManager.stopCustomDisplay(this.currentLayer);
        this.currentLayer = null;
      }
    },
    clearHighlight() {
      for (let i = this.entityNames.length - 1; i >= 0; i -= 1) {
        // this.sceneOverlays.removeEntityByName(this.entityNames[i]);
        this.entityNames.pop();
      }
    },
    getViewExtend() {
      const params = {};
      const webGlobe = this.sceneControllerWebGlobe;
      const extend = webGlobe.viewer.camera.computeViewRectangle();
      if (typeof extend === "undefined") {
        // 2D下会可能拾取不到坐标，extend返回undefined,所以做以下转换
        const canvas = webGlobe.viewer.scene.canvas;
        // canvas左上角坐标转2d坐标
        const upperLeft = new this.Cesium.Cartesian2(0, 0);
        // canvas右下角坐标转2d坐标
        const lowerRight = new this.Cesium.Cartesian2(
          canvas.clientWidth,
          canvas.clientHeight
        );

        const ellipsoid = webGlobe.viewer.scene.globe.ellipsoid;
        // 2D转3D世界坐标
        const upperLeft3 = webGlobe.viewer.camera.pickEllipsoid(
          upperLeft,
          ellipsoid
        );

        // 2D转3D世界坐标
        const lowerRight3 = webGlobe.viewer.camera.pickEllipsoid(
          lowerRight,
          ellipsoid
        );

        // 3D世界坐标转弧度
        const upperLeftCartographic = ellipsoid.cartesianToCartographic(
          upperLeft3
        );
        // 3D世界坐标转弧度
        const lowerRightCartographic = ellipsoid.cartesianToCartographic(
          lowerRight3
        );

        // 弧度转经纬度
        const xmin = this.Cesium.Math.toDegrees(
          upperLeftCartographic.longitude
        );
        // 弧度转经纬度
        const xmax = this.Cesium.Math.toDegrees(
          lowerRightCartographic.longitude
        );

        // 弧度转经纬度
        const ymin = this.Cesium.Math.toDegrees(
          lowerRightCartographic.latitude
        );
        // 弧度转经纬度
        const ymax = this.Cesium.Math.toDegrees(upperLeftCartographic.latitude);

        params.xmin = xmin;
        params.xmax = xmax;
        params.ymin = ymin;
        params.ymax = ymax;
      } else {
        // 3D获取方式
        params.xmax = this.Cesium.Math.toDegrees(extend.east);
        params.ymax = this.Cesium.Math.toDegrees(extend.north);

        params.xmin = this.Cesium.Math.toDegrees(extend.west);
        params.ymin = this.Cesium.Math.toDegrees(extend.south);
      }
      // 返回屏幕所在经纬度范围
      return params;
    },
    onClearHighlightFeature() {
      this.clearHighlight();
      this.stopDisplay();
    },
    onHighlightFeature({ feature }) {
      const bound = feature.properties.specialLayerBound;
      // || Feature.getGeoJSONFeatureBound(feature);
      this.zoomOrPanTo(bound);
      this.highlightFeature({ feature });
    }
  }
};
</script>
