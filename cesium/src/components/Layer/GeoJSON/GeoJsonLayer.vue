<template>
  <span>
    <Popup :position="position" v-model="visible" forceRender>
      <PopupContent
        ref="click"
        :mode="clickMode"
        :currentLayerInfo="currentClickInfo"
      >
      </PopupContent>
      <PopupContent
        ref="hover"
        :mode="hoverMode"
        :currentLayerInfo="currentHoverInfo"
      >
      </PopupContent
    ></Popup>
  </span>
</template>

<script>
import VueOptions from "../../Base/Vue/VueOptions";
import Popup from "../../UI/Popup/Popup.vue";
import PopupContent from "../../UI/Geojson/Popup";

import { Style } from "@mapgis/webclient-es6-service";
const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;
const DefaultActiveImagePlotting =
  "data:image/png;base64,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";
const DefaultInactiveImagePlotting =
  "data:image/png;base64,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";

export default {
  name: "mapgis-3d-geojson-layer",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions,
    layerId: {
      type: String,
      default: "矢量图层"
    },
    baseUrl: {
      type: [String, Object],
      required: true
    },
    enablePopup: {
      type: Boolean,
      defalut: false
    },
    popupOptions: {
      type: Object
    },
    enableTips: {
      type: Boolean,
      defalut: false
    },
    tipsOptions: {
      type: Object
    },
    layerStyle: {
      type: Object,
      default: () => {
        return {
          point: new PointStyle(),
          line: new LineStyle(),
          polygon: new FillStyle()
        };
      }
    },
    highlightStyle: {
      type: Object,
      default: () => {
        return {
          point: new PointStyle(),
          line: new LineStyle(),
          polygon: new FillStyle()
        };
      }
    }
  },
  data() {
    return {
      activeId: undefined,
      visible: false,
      position: {
        longitude: 110,
        latitude: 30,
        height: 0
      },
      currentClickInfo: [],
      currentHoverInfo: [],
      clickMode: "click",
      hoverMode: "hover"
    };
  },
  components: {
    Popup,
    PopupContent
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Cesium.GeoJsonDataSource.load(baseUrl, options);
    },
    mount() {
      const { webGlobe, CesiumZondy, vueKey, vueIndex, enablePopup } = this;
      const { viewer } = webGlobe;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        // viewer.zoomTo(dataSource);
        viewer.dataSources.add(dataSource);
        let entities = dataSource.entities.values;
        vm.changeColor(entities);
        vm.$emit("load", { component: this });
        let handler;
        if (enablePopup) {
          handler = vm.bindEvent();
        }
        CesiumZondy.GeojsonManager.addSource(vueKey, vueIndex, dataSource, {
          handler: handler
        });
      });
    },
    unmount() {
      let { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const { dataSources } = viewer;
      let find = CesiumZondy.GeojsonManager.findSource(vueKey, vueIndex);
      if (find) {
        if (dataSources) {
          dataSources.remove(find.source, true);
        }
      }
      CesiumZondy.GeojsonManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    bindEvent() {
      const vm = this;
      const { Cesium, webGlobe, popupOptions } = this;
      const { viewer } = webGlobe;
      let tempRay = new Cesium.Ray();
      let tempPos = new Cesium.Cartesian3();
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function(movement) {
        let foundPosition = false;

        const scene = viewer.scene;
        if (scene.mode !== Cesium.SceneMode.MORPHING) {
          let cartesian = viewer.scene.pickPosition(movement.position);
          let ray = scene.camera.getPickRay(movement.position, tempRay);
          let cartesian2 = scene.globe.pick(ray, scene, tempPos);

          // 多选模式
          let entities = scene.drillPick(movement.position);
          // 单选模式
          /* let feature = scene.pick(movement.position);
          if (feature instanceof Cesium.Cesium3DTileFeature) {
            feature.color = Cesium.Color.RED;
          } else if (feature instanceof Cesium.Primitive) {
            let nc = new Cesium.Color.fromCssColorString("#ff0000").withAlpha(
              1.0
            );
            feature.id.polygon.material = nc;
            feature.id.polygon.outline = Cesium.Color.fromCssColorString("#000000");
          } */

          let longitudeString2, latitudeString2, heightString2;

          if (Cesium.defined(cartesian2)) {
            let cartographic2 = Cesium.Cartographic.fromCartesian(cartesian2);
            longitudeString2 = Cesium.Math.toDegrees(cartographic2.longitude);
            latitudeString2 = Cesium.Math.toDegrees(cartographic2.latitude);
            heightString2 = cartographic2.height;
          }

          if (cartesian || cartesian2) {
            vm.visible = true;
            vm.position = {
              longitude: longitudeString2,
              latitude: latitudeString2,
              height: heightString2
            };
            vm.currentClickInfo = entities.map(e => {
              let info = {
                layer: { id: e.id ? e.id.id : "未知数据" },
                properties: {}
              };
              vm.activeId = e.id ? e.id.id : undefined;
              if (e.id && e.id.properties) {
                Object.keys(e.id.properties)
                  .filter(p => {
                    let inner =
                      p.indexOf("Subscription") <= 0 &&
                      !["_propertyNames", "_definitionChanged"].find(
                        n => n == p
                      );
                    return inner;
                  })
                  .forEach(p => {
                    let name = p.substr(1);
                    info.properties[name] = e.id.properties[p]._value;
                  });
                info.layer.id =
                  vm.layerId ||
                  info.properties["name"] ||
                  info.properties["title"];
                let titlefield = popupOptions ? popupOptions.title : undefined;
                if (titlefield) {
                  info.title = info.properties[titlefield];
                }
              }
              return info;
            });
            vm.highlight(entities);
          } else {
            vm.visible = false;
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      return handler;
    },
    changeColor(entities) {
      const vm = this;
      const { Cesium, layerStyle } = this;
      const { point, line, polygon } = layerStyle;

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
        } else if (entity.polyline) {
          const style = line.toCesiumStyle(Cesium);
          const { material, width } = style;
          entity.polyline.material = material;
          entity.polyline.width = width;
        } else if (entity.polygon) {
          const style = polygon.toCesiumStyle(Cesium);
          const { material, outlineColor } = style;
          entity.polygon.material = material;
          entity.polygon.outlineColor = outlineColor;
        }
      }
    },
    highlight(entities) {
      const vm = this;
      const { vueKey, vueIndex } = this;
      const {
        webGlobe,
        Cesium,
        CesiumZondy,
        enablePopup,
        layerStyle,
        highlightStyle
      } = this;
      const { point, line, polygon } = layerStyle;
      const hpolygon = highlightStyle.polygon;
      let outlineEntity;
      if (!entities || entities.length <= 0 || !enablePopup) return;
      let find = CesiumZondy.GeojsonManager.findSource(vueKey, vueIndex);
      if (!find) return;
      for (let i = 0; i < find.source.entities.values.length; i++) {
        let entity = find.source.entities.values[i];
        if (entity.id != vm.activeId) {
          if (entity.polygon) {
            const style = polygon.toCesiumStyle(Cesium);
            const { material } = style;
            entity.polygon.material = material;
          }
        } else {
          if (entity.polygon) {
            outlineEntity = find.options.outlineEntity;
            const style = hpolygon.toCesiumStyle(Cesium);
            const { material, outlineColor } = style;
            entity.polygon.material = material;
            entity.polygon.outlineColor = outlineColor;
            if (outlineEntity) {
              webGlobe.viewer.entities.remove(outlineEntity);
            }
            outlineEntity = new Cesium.Entity({
              polyline: {
                width: 20,
                positions: entity.polygon.hierarchy._value.positions,
                material: new Cesium.PolylineGlowMaterialProperty({
                  glowPower: 0.7,
                  color: new Cesium.Color.fromCssColorString("#7cc4db")
                }),
                clampToGround: true
              }
            });
            webGlobe.viewer.entities.add(outlineEntity);
            CesiumZondy.GeojsonManager.changeOptions(
              vueKey,
              vueIndex,
              "outlineEntity",
              outlineEntity
            );
          }
        }
      }
    }
  }
};
</script>
