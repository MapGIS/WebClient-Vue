<script>
import BaseLayer from "./BaseLayer"
import { Style } from "@mapgis/webclient-es6-service";
const { LineStyle, PointStyle, FillStyle, Shadow } = Style;

export default {
  name: "mapgis-3d-theme-layer-custom",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseLayer],
  mounted() {
    this.$_mount();
  },
  beforeDestroy() {
    this.$_unmount();
  },
  data() {
    return {
      bbox: undefined,
      entities: [],
      tempFilterEntities: [],
      tempHighlightEntities: [],
      tempHighlightInfos: undefined
    }
  },
  watch: {
    baseUrl: {
      handler(value) {
        this.$_unmount();
        this.$_mount();
      },
      deep: true
    },
    visible: {
      handler(value) {
        const cartographic = this.viewer.camera.positionCartographic.height/1000;
        this.$_changeVisible(this.entities, cartographic);
      },
      deep: true
    },
    themeOptions: {
      handler(value) {
        this.$_drawTheme(this.entities);
      },
      deep: true
    },
    highlightStyle: {
      handler(value) {
        this.highlight(this.tempHighlightInfos);
      },
      deep: true
    },
    filter: {
      handler(value) {
        if (this.tempFilterEntities.length != 0) 
          this.$_drawTheme(this.tempFilterEntities);
        this.$_drawFilterTheme(this.entities);
      },
      deep: true
    },
    filterOptions: {
      handler(value) {
        if (this.tempFilterEntities.length != 0) 
          this.$_drawTheme(this.tempFilterEntities);
        this.$_drawFilterTheme(this.entities);
      },
      deep: true
    },
  },
  methods: {
    $_mount() {
      let { viewer, vueCesium, vueKey, vueIndex } = this;
      const { baseUrl, themeOptions, enablePopup, enableTips, visible } = this;
      const vm = this;
      // 判断是否支持图像渲染像素化处理
      viewer.shadows = true;
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) { 
        viewer.resolutionScale = window.devicePixelRatio;
      };
      // 是否开启抗锯齿
      viewer.scene.fxaa = true;
      viewer.scene.postProcessStages.fxaa.enabled = true;
      vm.$emit("load", { component: this });
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        let entities = vm.$_findAllEntities(dataSource);
        vm.entities = entities;
        
        vm.parseData(baseUrl);
        const cartographic = viewer.camera.positionCartographic.height/1000;
        vm.$_changeVisible(entities, cartographic);
        vm.$_setHeight(entities);

        let clickhandler = vm.$_bindClickEvent(vm.parseClick);
        let hoverhandler = vm.$_bindHoverEvent(vm.parseHover);
        vm.$_drawTheme(entities);
        vm.$_drawFilterTheme(entities);
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
    // 点击高亮实现
    highlight(payload) {
      const { entities, currentClickInfo } = payload;
      const pickEntity = entities[0].id;
      const { vueKey, vueIndex, vueCesium, highlightStyle } = this;
      const { point, line, polygon } = highlightStyle;
      let style;
      this.currentClickInfo = currentClickInfo;
      this.tempHighlightInfos = payload;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      if (!entities || entities.length <= 0 || !find) return;
      this.$_drawTheme(this.tempHighlightEntities);
      this.$_drawFilterTheme(this.tempHighlightEntities);
      this.tempHighlightEntities = [];
      for (let i = 0; i < find.source.entities.values.length; i++) {
        let entity = find.source.entities.values[i];
        if (entity.id == pickEntity.id) {
          this.tempHighlightEntities.push(entity);
          if (entity.billboard) {
            style = point;
          } else if (entity.polyline && !entity.polygon) {
            style = line;
          } else if (entity.polygon) {
            style = polygon;
          };
          this.$_setMaterial(this.tempHighlightEntities, {style});
        }
      }
    },
    changePopup(payload) {
      const { currentClickInfo } = payload;
      this.currentClickInfo = currentClickInfo;
    },
    // 根据传入type类型，绘制不同专题图
    $_drawTheme(entities) {
      if (entities.length == 0) return;
      const { themeOptions, type } = this;
      switch (type) {
        case "uniform":
          this.$_drawUniformValueTheme(entities);
          break;
        case "unique":
          this.$_drawUniqueValueTheme(entities);
          break;
        case "range":
          this.$_drawAutoRangeValueTheme(entities);
          if (themeOptions.styleGroups)
            this.$_drawRangeOpitionTheme(entities);
          break;
        case "random":
          this.$_drawRandomTheme(entities);
          break;
        case "gradual":
          this.$_drawGradualValueTheme(entities);
          break;
        default: 
          this.$_drawUniformValueTheme(entities);
      }
    },
    // 绘制统一(默认)专题图
    $_drawUniformValueTheme(entities) {
      const { Cesium, themeOptions } = this;
      if (entities.length == 0) return;
      const style = themeOptions.layerStyle;
      this.$_setMaterial(entities, {style});
    },
    // 绘制单值专题图
    $_drawUniqueValueTheme(entities) {
      const { Cesium, themeOptions, field } = this;
      if (entities.length == 0) return;
      for (let i = 0; i < themeOptions.styleGroups.length; i++) {
        const { hasMaterial, materialType } = themeOptions;
        let { value, style } = themeOptions.styleGroups[i];
        const fieldEntities = this.$_findEntitiesByFieldvalue(entities, field, value);
        this.$_setMaterial(fieldEntities, {hasMaterial, materialType, style});
      }
    },
    // 根据layerStyle绘制分段专题图
    $_drawAutoRangeValueTheme(entities) {
      const { themeOptions, field } = this;
      const { layerStyle } = themeOptions;
      if (!layerStyle) return;
      const { color, outlineColor, outlineWidth, opacity } = layerStyle;
      const { max, min } = this.$_getFieldMaxin(this.entities, field);
      const colorArr = Array.isArray(layerStyle.color) ? layerStyle.color : [layerStyle.color];
      const value = (max - min) / colorArr.length;
      for (let i = 0; i < colorArr.length; i++) {
        let start = min+i*value;
        let end = min+(i+1)*value == max ? min+(i+1.001)*value : min+(i+1)*value;
        let tempRange = [start, end];
        const rangeEntities = this.$_findEntitiesByFieldrange(entities, field, tempRange);
        let style = {
          color: colorArr[i],
          outlineColor,
          outlineWidth,
          opacity,
        };
        this.$_setMaterial(rangeEntities, {style});
      }
    },
    // 根据指定范围的themeOptions绘制分段专题图
    $_drawRangeOpitionTheme(entities) {
      const { cesium, themeOptions, field } = this;
      for (let i = 0; i < themeOptions.styleGroups.length; i++) {
        const { hasMaterial, materialType } = themeOptions;
        let { start, end, style, material } = themeOptions.styleGroups[i];
        const rangeEntities = this.$_findEntitiesByFieldrange(entities, field, [start, end]);
        this.$_setMaterial(rangeEntities, {hasMaterial, materialType, style, material});
      }
    },
    // 绘制随机专题图
    $_drawRandomTheme(entities) {
      const { Cesium, themeOptions } = this;
      if (entities.length == 0) return;
      const { layerStyle } = themeOptions;
      for (let i = 0; i < entities.length; i++) {
        let tempEntities = [entities[i]];
        const style = this.$_setRandomStyle(entities[i], layerStyle);
        this.$_setMaterial(tempEntities, {style});
      }
    },
    // 绘制分段专题图-渐变
    $_drawGradualValueTheme(entities) {
      const { cesium, themeOptions, field } = this;
      const { materialType } = themeOptions;
      let { range } = themeOptions.gradualLayerStyle;
      let gradualStyle = this.$_setGradualStyle(themeOptions.gradualLayerStyle);
      for (let i = 0; i < range.length-1; i++) {
        const rangeEntities = this.$_findEntitiesByFieldrange(entities, field, [range[i], range[i+1]]);
        let style = gradualStyle[i];
        this.$_setMaterial(rangeEntities, {materialType, style});
      }
    },
    // 绘制交互显示内容
    $_drawFilterTheme(entities) {
      if (entities.length == 0) return;
      const { filter, filterOptions } = this; 
      const { fieldName, fieldRange } = filter;
      const { hasMaterial, materialType, layerStyle, styleGroups } = filterOptions;
      const filterEntities = this.$_findEntitiesByFieldvalue(entities, fieldName, fieldRange);
      this.tempFilterEntities = filterEntities;
      const style = layerStyle;
      this.$_setMaterial(filterEntities, {hasMaterial, materialType, style, styleGroups});
    }
  },
}
</script>

<style scoped>

</style>