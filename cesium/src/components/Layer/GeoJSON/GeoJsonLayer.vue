<script>
import VueOptions from "../../Base/Vue/VueOptions";
import PopupMixin from "../Mixin/PopupMixin";

import { Style } from "@mapgis/webclient-es6-service";
const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;

export default {
  name: "mapgis-3d-geojson-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [PopupMixin],
  props: {
    ...VueOptions,
    baseUrl: {
      type: [String, Object],
      required: true
    },
    layerId: {
      type: String,
      default: "矢量图层"
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
      const { baseUrl, options } = this;
      return new Cesium.GeoJsonDataSource.load(baseUrl, options);
    },
    mount() {
      const { viewer, vueCesium, vueKey, vueIndex } = this;
      const { enablePopup, enableTips } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        // viewer.zoomTo(dataSource);
        viewer.dataSources.add(dataSource);
        vm.changeColor(dataSource);
        vm.$emit("load", { component: this });
        let clickhandler, hoverhandler;
        if (enablePopup) {
          clickhandler = vm.$_bindClickEvent(vm.highlight);
        }
        if (enableTips) {
          hoverhandler = vm.$_bindHoverEvent();
        }
        vueCesium.GeojsonManager.addSource(vueKey, vueIndex, dataSource, {
          clickhandler: clickhandler,
          hoverhandler: hoverhandler
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
        if (find.clickhandler) {
          find.clickhandler.destroy();
        }
        if (find.hoverhandler) {
          find.hoverhandler.destroy();
        }
      }
      vueCesium.GeojsonManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
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
          const { color, pixelSize, outlineColor } = style;
          entity.ellipse = new Cesium.EllipseGraphics({
            semiMajorAxis: pixelSize,
            semiMinorAxis: pixelSize,
            outline: outlineColor,
            material: color
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
    highlight(payload) {
      const { entities, currentClickInfo } = payload;
      const vm = this;
      const { vueKey, vueIndex, vueCesium } = this;
      const { viewer, Cesium, enablePopup, layerStyle, highlightStyle } = this;
      const { type } = layerStyle;
      const hpolygon = highlightStyle.polygon;
      const hline = highlightStyle.line;
      const hpoint = highlightStyle.point;
      vm.currentClickInfo = currentClickInfo;
      let outlineEntity;
      if (!entities || entities.length <= 0 || !enablePopup) return;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      if (!find) return;
      for (let i = 0; i < find.source.entities.values.length; i++) {
        let entity = find.source.entities.values[i];
        if (entity.id == vm.activeId) {
          if (entity.ellipse) {
            const style = hpoint.toCesiumStyle(Cesium);
            const { color, pixelSize, outlineColor } = style;
            entity.ellipse = new Cesium.EllipseGraphics({
              semiMajorAxis: pixelSize,
              semiMinorAxis: pixelSize,
              outline: outlineColor,
              material: color
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
            const { color, pixelSize, outlineColor } = style;
            entity.ellipse = new Cesium.EllipseGraphics({
              semiMajorAxis: pixelSize,
              semiMinorAxis: pixelSize,
              outline: outlineColor,
              material: color
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
