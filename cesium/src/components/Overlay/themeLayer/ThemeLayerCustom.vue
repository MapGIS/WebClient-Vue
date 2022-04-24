<script>
import BaseLayer from "./BaseLayer"
// import BaseRender from "./BaseRender"

import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  name: "mapgis-3d-theme-layer-custom",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  mounted() {
    this.$_mount();
  },
  destoryed() {
    this.$_unmount();
  },
  methods: {
    $_mount() {
      let { viewer, vueCesium, vueKey, vueIndex } = this;
      const { baseUrl, renderRule, enablePopup, enableTips } = this;
      const vm = this;
      vm.$emit("load", { component: this });
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        let entities = vm.$_findAllEntities(dataSource);
        vm.parseData(baseUrl);
        vm.$_bindClickEvent(vm.parseClick);
        vm.$_bindHoverEvent(vm.parseHover);
        let clickhandler, hoverhandler;
        if (enablePopup) {
          clickhandler = vm.$_bindClickEvent(vm.highlight);
        }
        if (enableTips) {
          hoverhandler = vm.$_bindHoverEvent(vm.changePopup);
        }

        vm.$_drawTheme(entities);

        vueCesium.GeojsonManager.addSource(vueKey, vueIndex, dataSource, {
          clickhandler: clickhandler,
          hoverhandler: hoverhandler,
        });
      })
    },
    $_unmount() {
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
    parseClick(payload) {
      this.$emit("themeClick", {entity: payload});
    },
    highlight(payload) {
      const { entities, currentClickInfo } = payload;
      const vm = this;
      const { vueKey, vueIndex, vueCesium } = this;
      const { viewer, Cesium, enablePopup, renderRule, highlightStyle } = this;
      const hpolygon = highlightStyle.polygon;
      const hline = highlightStyle.line;
      const hpoint = highlightStyle.point;
      vm.currentClickInfo = currentClickInfo;
      let outlineEntity;
      if (!entities || entities.length <= 0 || !enablePopup) return;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      if (!find) return;

      let tempEntities = [];

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
              material: color,
            });
          } else if (entity.polyline && !entity.polygon) {
            const style = hline.toCesiumStyle(Cesium);
            const { material, width } = style;
            entity.polyline.material = material;
            entity.polyline.width = width;
          } else if (entity.polygon) {
            if (tempEntities.length != 0) {
              tempEntities = [];
            }
            tempEntities.push(entity);
            // 高亮当前区样式
            this.$_setMaterial([entity], hpolygon);

            // 高亮轮廓样式
            outlineEntity = find.options.outlineEntity;
            if (outlineEntity) {
              viewer.entities.remove(outlineEntity);
            }
            outlineEntity = new Cesium.Entity({
              polyline: {
                width: 20,
                positions: entity.polygon.hierarchy._value.positions,
                material: new Cesium.PolylineGlowMaterialProperty({
                  glowPower: 0.7,
                  color: new Cesium.Color.fromCssColorString("#7cc4db"),
                }),
                clampToGround: true,
              },
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
          this.$_drawTheme([entity]);
        }
      }
    },
    changePopup(payload) {
      const { currentClickInfo } = payload;
      this.currentClickInfo = currentClickInfo;
    },
    // 根据render规则，绘制不同类型的专题图
    $_drawTheme(entities) {
      const { renderRule } = this;
      const { type } = renderRule;
      if (type == "default") {
        this.$_drawRandomTheme(entities);
      } else if (type == "uniform") {
        this.$_drawUniformValueTheme(entities);
      } else if (type == "unique") {
        this.$_drawUniqueValueTheme(entities);
      } else if (type == "range") {
        this.$_drawRangeValueTheme(entities);
      } else if (type == "gradual") {
        this.$_drawGradualValueTheme(entities);
      }
    },
    // 绘制默认专题图
    $_drawRandomTheme(entities) {
      const { Cesium, renderRule } = this;
      if (entities.length == 0) {
        return {};
      }
      const { defaultSymbol } = renderRule;
      let { outlineWidth, opacity } = defaultSymbol;
      for (let i = 0; i < entities.length; i++) {
        let tempEntities = [entities[i]];
        let randomColor = this.$_setRandomColor();
        const color = randomColor;
        const outlineColor = randomColor;
        const tempSymbolStyle = new FillStyle({
          color,
          outlineColor,
          outlineWidth,
          opacity
        });
        this.$_setMaterial(tempEntities, tempSymbolStyle);
      }
    },
    // 绘制渲染规则下的统一专题图
    $_drawUniformValueTheme(entities) {
      const { Cesium, renderRule } = this;
      if (entities.length == 0) {
        return {};
      };
      const { defaultSymbol } = renderRule;
      this.$_setMaterial(entities, defaultSymbol);
    },
    // 绘制渲染规则下的单值专题图
    $_drawUniqueValueTheme(entities) {
      const { Cesium, renderRule } = this;
      if (entities.length == 0) {
        return {};
      };
      for (let i = 0; i < renderRule.uniqueValueInfos.length; i++) {
        const field = renderRule.field;
        let { value, symbolStyle } = renderRule.uniqueValueInfos[i];
        const fieldEntities = this.$_findEntitiesByFieldvalue(entities, field, value);
        if (fieldEntities.length != 0) {
          this.$_setMaterial(fieldEntities, symbolStyle);
        }
      }
    },
    // 绘制渲染规则下的分段专题图
    $_drawRangeValueTheme(entities) {
      const { cesium, renderRule } = this;
      if (entities.length == 0) {
        return {};
      };
      for (let i = 0; i < renderRule.rangeValueInfos.length; i++) {
        const field = renderRule.field;
        let { range, symbolStyle } = renderRule.rangeValueInfos[i];
        const rangeEntities = this.$_findEntitiesByFieldrange(entities, field, range);
        if (rangeEntities.length != 0) {
          this.$_setMaterial(rangeEntities, symbolStyle);
        };
      }
    },
    // 绘制渲染规则下的分段专题图-渐变
    $_drawGradualValueTheme(entities) {
      const { cesium, renderRule } = this;
      if (entities.length == 0) {
        return {};
      };
      const field = renderRule.field;
      let { range } = renderRule.gradualValueInfos;
      let gradualStyle = this.$_setGradualStyle(renderRule.gradualValueInfos);
      for (let i = 0; i < range.length-1; i++) {
        const rangeEntities = this.$_findEntitiesByFieldrange(entities, field, [range[i], range[i+1]]);
        let symbolStyle = gradualStyle[i];
        if (rangeEntities.length != 0) {
          this.$_setMaterial(rangeEntities, symbolStyle);
        };
      }
    }
  },
}
</script>

<style scoped>

</style>