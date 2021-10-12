<template>
  <div>
    <mapgis-3d-marker-set-pro
      :vue-key="vueKey"
      :markers="markers"
      @mouseenter="mouseEnterEvent"
      @mouseleave="mouseLeaveEvent"
      @popupload="popupLoad"
    >
      <template slot="popup" slot-scope="slotProps">
        <slot name="popup" v-bind="slotProps"></slot>
      </template>
    </mapgis-3d-marker-set-pro>
  </div>
</template>

<script>
import { Style } from "@mapgis/webclient-es6-service";
import VueOptions from "../../Base/Vue/VueOptions";
import Mapgis3dMarkerSetPro from "./3dMarkerSetPro.vue";
import * as turfjs from "@turf/turf";

const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;
const DefaultActiveImagePlotting =
  "data:image/png;base64,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";
const DefaultInactiveImagePlotting =
  "data:image/png;base64,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";

export default {
  name: "mapgis-3d-dynamic-marker-layer",
  components: { Mapgis3dMarkerSetPro },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions,
    data: {
      type: [Object, String],
      required: true
    },
    layerStyle: {
      type: Object,
      default: () => {
        return new MarkerStyle({
          symbol: DefaultInactiveImagePlotting
        });
      }
    },
    highlight: {
      type: Boolean,
      default: true
    },
    highlightStyle: {
      type: Object,
      default: () => {
        return {
          marker: new MarkerStyle({
            symbol: DefaultActiveImagePlotting
          }),
          point: new PointStyle(),
          line: new LineStyle(),
          polygon: new FillStyle()
        };
      }
    },
    idField: {
      type: String,
      default: "fid"
    },
    selects: {
      type: Array,
      default: () => []
    },
    filterWithMap: {
      type: Boolean,
      default: false
    },
    fitBound: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      markers: [],
      currentLayer: null
    };
  },
  watch: {
    data: {
      handler(next) {
        this.parseData(next);
      },
      deep: true
    },
    selects: {
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
    this.parseData();
    this.mount();
  },
  destroyed() {
    this.analysisManager = null;
  },
  methods: {
    mount() {
      const vm = this;
      const { CesiumZondy, vueKey, vueIndex, data } = this;
      const webGlobe = this.CesiumZondy.getWebGlobe(vueKey) || this.webGlobe;
      const { viewer } = webGlobe;
      let analysisManager = new CesiumZondy.Manager.AnalysisManager({
        viewer: viewer
      });

      let promise = new Cesium.GeoJsonDataSource.load(data);
      promise.then(function(dataSource) {
        viewer.dataSources.add(dataSource);
        vm.changeColor(dataSource);
        CesiumZondy.GeojsonManager.addSource(vueKey, vueIndex, dataSource, {
          analysisManager: analysisManager
        });
      });
    },
    unmount() {},
    parseData(data) {
      data = data || this.data;
      const vm = this;
      if (typeof data === "string") {
        fetch(data)
          .then(function(response) {
            return response.json();
          })
          .then(function(resdata) {
            vm.parseMarker(resdata);
          });
      } else {
        vm.parseMarker(data);
      }
    },
    parseMarker(geojson) {
      const { idField, layerStyle } = this;
      if (!geojson || !geojson.features) {
        console.warn("请输入标准的GEOJSON格式，目前只支持FeatureCollection");
        return;
      }
      let markers = geojson.features.map((f, i) => {
        let coordinates = turfjs.center(f).geometry.coordinates;
        let id =
          f.properties && f.properties[idField] ? f.properties[idField] : i;
        let marker = {
          fid: id,
          coordinates,
          img: layerStyle.symbol,
          properties: f.properties,
          feature: f
        };

        return marker;
      });
      this.markers = markers;
    },
    getMarker(fid) {
      return this.markers.find(marker => marker.fid === fid);
    },
    isSelectedMarker(id) {
      return this.selects.findIndex(idField => idField === id) !== -1;
    },
    changeFilterWithMap() {
      const { webGlobe } = this;
      if (!this.filterWithMap) {
        return;
      }
      const rectangle = webGlobe.viewer.camera.computeViewRectangle();
      const bounds = {
        xmin: (rectangle.west / Math.PI) * 180,
        ymin: (rectangle.south / Math.PI) * 180,
        xmax: (rectangle.east / Math.PI) * 180,
        ymax: (rectangle.north / Math.PI) * 180
      };
      this.$emit("map-bound-change", bounds);
    },
    zoomToCartesian3(x, y) {
      const { Cesium, webGlobe } = this;
      const destination = Cesium.Cartesian3.fromDegrees(x, y, z)(
        x,
        y,
        webGlobe.viewer.camera.positionCartographic.height
      );
      webGlobe.viewer.camera.flyTo({ destination });
    },
    zoomTo(bound) {
      const { Cesium, webGlobe } = this;
      const { xmin, ymin, xmax, ymax } = bound;
      const destination = new Cesium.Rectangle.fromDegrees(
        xmin,
        ymin,
        xmax,
        ymax
      );
      webGlobe.viewer.camera.flyTo({ destination });
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
      const marker = this.getMarker(id);

      if (marker) {
        this.highlightFeature(marker);
        this.highlightMarker(marker);
      }
    },
    mouseLeaveEvent(e, id) {
      const marker = this.getMarker(id);
      if (marker) {
        this.clearHighlightFeature(marker);
        this.clearHighlightMarker(marker);
        this.stopDisplay();
      }
    },
    popupLoad(markerId) {
      this.$emit("popupload", markerId);
    },
    changeColor(dataSource) {
      if (!dataSource) return;
      const { Cesium, highlightStyle } = this;
      let entities = dataSource.entities.values;
      const vm = this;
      const { point } = highlightStyle;
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (entity.billboard) {
          entity.billboard.show = false;
          const style = point.toCesiumStyle(Cesium);
          const { material, radius, outline } = style;
          entity.ellipse = new Cesium.EllipseGraphics({
            semiMajorAxis: radius,
            semiMinorAxis: radius,
            outline: outline,
            material: material
          });
          entity.ellipse.show = false;
        } else if (entity.polyline) {
          entity.polyline.show = false;
        } else if (entity.polygon) {
          entity.polygon.show = false;
        }
      }
    },
    getViewExtend() {
      let { vueKey, webGlobe } = this;
      const params = {};
      webGlobe = this.CesiumZondy.getWebGlobe(vueKey) || webGlobe;
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
    highlightFeature(marker) {
      const vm = this;
      const { vueKey, vueIndex } = this;
      const { webGlobe, Cesium, CesiumZondy } = this;
      const { layerStyle, highlightStyle, idField } = this;
      const { point, line, polygon } = layerStyle;
      const hpolygon = highlightStyle.polygon;
      const hline = highlightStyle.line;
      const hpoint = highlightStyle.point;

      let find = CesiumZondy.GeojsonManager.findSource(vueKey, vueIndex);
      if (!find) return;
      for (let i = 0; i < find.source.entities.values.length; i++) {
        let entity = find.source.entities.values[i];
        if (entity.properties[idField] == marker.feature.properties.fid) {
          if (entity.ellipse) {
            const style = hpoint.toCesiumStyle(Cesium);
            const { material, radius, outline } = style;
            entity.ellipse.show = true;
            entity.ellipse = new Cesium.EllipseGraphics({
              semiMajorAxis: radius,
              semiMinorAxis: radius,
              outline: outline,
              material: material
            });
          } else if (entity.polyline) {
            const style = hline.toCesiumStyle(Cesium);
            const { material, width } = style;
            entity.polyline.show = true;
            entity.polyline.material = material;
            entity.polyline.width = width;
          } else if (entity.polygon) {
            const style = hpolygon.toCesiumStyle(Cesium);
            const { material, outlineColor } = style;
            entity.polygon.show = true;
            entity.polygon.material = material;
            entity.polygon.outlineColor = outlineColor;
          }
        } else {
          if (entity.ellipse) {
            entity.ellipse.show = false;
          } else if (entity.polyline) {
            entity.polyline.show = false;
          } else if (entity.polygon) {
            entity.polygon.show = false;
          }
        }
      }
      /* if (featureGeoJSON.features[0].geometry.type === "3DPolygon") {
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
      } */
    },
    stopDisplay() {
      if (this.currentLayer) {
        this.analysisManager.stopCustomDisplay(this.currentLayer);
        this.currentLayer = null;
      }
    },
    clearHighlightFeature(marker) {
      const { CesiumZondy, vueKey, vueIndex, layerStyle } = this;
      let dataSource = CesiumZondy.GeojsonManager.findSource(vueKey, vueIndex);
      this.changeColor(dataSource.source);
    },
    highlightMarker(marker) {
      marker.img = this.highlightStyle.marker.symbol;
    },
    clearHighlightMarker(marker) {
      if (!this.isSelectedMarker(marker.fid)) {
        marker.img = this.layerStyle.symbol;
      }
    },
    onClearHighlightFeature(fid) {
      const marker = this.getMarker(fid);
      this.clearHighlightMarker(marker);
      // this.stopDisplay();
    },
    onHighlightFeature(fid) {
      const marker = this.getMarker(fid);
      let bbox = turfjs.bbox(marker.feature);
      let bound = {
        xmin: bbox[0],
        ymin: bbox[1],
        xmax: bbox[2],
        ymax: bbox[3]
      };
      this.zoomOrPanTo(bound);
      this.highlightMarker(marker);
    }
  }
};
</script>
