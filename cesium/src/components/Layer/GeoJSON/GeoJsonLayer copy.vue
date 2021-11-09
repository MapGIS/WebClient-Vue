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

export default {
  name: "mapgis-3d-geojson-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
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
      default: false
    },
    popupOptions: {
      type: Object
    },
    enableTips: {
      type: Boolean,
      default: false
    },
    tipsOptions: {
      type: Object
    },
    layerStyle: {
      type: Object,
      default: () => {
        return {};
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
      const { viewer, vueCesium, vueKey, vueIndex, enablePopup } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        // viewer.zoomTo(dataSource);
        viewer.dataSources.add(dataSource);
        vm.changeColor(dataSource);
        vm.$emit("load", { component: this });
        let handler;
        if (enablePopup) {
          handler = vm.bindEvent();
        }
        vueCesium.GeojsonManager.addSource(vueKey, vueIndex, dataSource, {
          handler: handler
        });
      });
    },
    unmount() {
      let { viewer, vueCesium, vueKey, vueIndex } = this;
      const { dataSources } = viewer;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      if (find) {
        if (dataSources) {
          dataSources.remove(find.source, true);
        }
      }
      vueCesium.GeojsonManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    bindEvent() {
      const vm = this;
      const { Cesium, viewer, popupOptions } = this;
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
          if (entities.length <= 0) return;
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
    changeColor(dataSource) {
      let entities = dataSource.entities.values;
      const vm = this;
      const { Cesium, layerStyle } = this;
      const { type } = layerStyle;

      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (type == "point" || entity.billboard) {
          entity.billboard.show = false;
          const style = layerStyle.toCesiumStyle(Cesium);
          const { material, radius, outline } = style;
          entity.ellipse = new Cesium.EllipseGraphics({
            semiMajorAxis: radius,
            semiMinorAxis: radius,
            outline: outline,
            material: material
          });
        } else if (type == "line" || entity.polyline) {
          const style = layerStyle.toCesiumStyle(Cesium);
          const { material, width } = style;
          entity.polyline.material = material;
          entity.polyline.width = width;
        } else if (type == "fill" || entity.polygon) {
          const style = layerStyle.toCesiumStyle(Cesium);
          const { material, outlineColor } = style;
          entity.polygon.material = material;
          entity.polygon.outlineColor = outlineColor;
        }
      }
    },
    highlight(entities) {
      const vm = this;
      const { vueKey, vueIndex, vueCesium } = this;
      const { viewer, Cesium, enablePopup, layerStyle, highlightStyle } = this;
      const { type } = layerStyle;
      const hpolygon = highlightStyle.polygon;
      const hline = highlightStyle.line;
      const hpoint = highlightStyle.point;
      let outlineEntity;
      if (!entities || entities.length <= 0 || !enablePopup) return;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      if (!find) return;
      for (let i = 0; i < find.source.entities.values.length; i++) {
        let entity = find.source.entities.values[i];
        if (entity.id == vm.activeId) {
          if (entity.ellipse) {
            const style = hpoint.toCesiumStyle(Cesium);
            const { material, radius, outline } = style;
            entity.ellipse = new Cesium.EllipseGraphics({
              semiMajorAxis: radius,
              semiMinorAxis: radius,
              outline: outline,
              material: material
            });
          } else if (entity.polyline) {
            const style = hline.toCesiumStyle(Cesium);
            const { material, width } = style;
            entity.polyline.material = material;
            entity.polyline.width = width;
          } else if (entity.polygon) {
            outlineEntity = find.options.outlineEntity;
            const style = hpolygon.toCesiumStyle(Cesium);
            const { material, outlineColor } = style;
            entity.polygon.material = material;
            entity.polygon.outlineColor = outlineColor;
            if (outlineEntity) {
              viewer.entities.remove(outlineEntity);
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
            viewer.entities.add(outlineEntity);
            vueCesium.GeojsonManager.changeOptions(
              vueKey,
              vueIndex,
              "outlineEntity",
              outlineEntity
            );
          }
        } else {
          if (type == "point" || entity.ellipse) {
            const style = layerStyle.toCesiumStyle(Cesium);
            const { material, radius, outline } = style;
            entity.ellipse = new Cesium.EllipseGraphics({
              semiMajorAxis: radius,
              semiMinorAxis: radius,
              outline: outline,
              material: material
            });
          } else if (type == "line" || entity.polyline) {
            const style = layerStyle.toCesiumStyle(Cesium);
            const { material, width } = style;
            entity.polyline.material = material;
            entity.polyline.width = width;
          } else if (type == "fill" || entity.polygon) {
            const style = layerStyle.toCesiumStyle(Cesium);
            const { material, outlineColor } = style;
            entity.polygon.material = material;
            entity.polygon.outlineColor = outlineColor;
          }
        }
      }
    }
  }
};
</script>
