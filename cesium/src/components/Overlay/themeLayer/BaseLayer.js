import {
  FillStyle,
  LineStyle,
  PointStyle,
} from "@mapgis/webclient-es6-service/base/style";
import bbox from "@turf/bbox";

import VueOptions from "../../Base/Vue/VueOptions";
import PopupMixin from "../../Layer/Mixin/PopupVirtual";

export default {
  mixins: [PopupMixin],
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    baseUrl: {
      type: [String, Object],
      required: true,
    },
    layerId: {
      type: String,
      default: "矢量图层",
    },
    // uniform unique range random gradual
    type: {
      type: String,
      default: "uniform",
    },
    field: {
      type: String,
      default: "",
    },
    autoReset: {
      type: Boolean,
      default: true,
    },
    offsetHeight: {
      type: Number,
      default: 5000,
    },
    themeOptions: {
      type: Object,
      default: function () {
        return {
          hasMaterial: false,
          // PolylineTrailLink PolylineArrow PolylineDash Image CircleWave，默认为PolylineTrailLink材质
          materialType: "",
          layerStyle: {
            color: "#FF3300",
            outlineColor: "#FFFFFF",
            outlineWidth: 1,
            opacity: 1,
          },
          styleGroups: [{}],
          gradualLayerStyle: {},
        };
      },
    },
    filter: {
      type: Object,
      default: function () {
        return {
          filedName: "",
          filedRange: [],
        };
      },
    },
    filterOptions: {
      type: Object,
      default: function () {
        return {
          hasMaterial: false,
          materialType: "",
          layerStyle: {
            color: "#FF3300",
            outlineColor: "#FFFFFF",
            outlineWidth: 1,
            opacity: 1,
          },
          styleGroups: [{}],
          gradualLayerStyle: {},
        };
      },
    },
    enableHighlight: {
      type: Boolean,
      default: false,
    },
    enableHighlightHover: {
      type: Boolean,
      default: false,
    },
    highlightStyle: {
      type: Object,
      default: () => {
        return {
          point: {
            radius: 100,
            color: "#ff0000",
            outlineColor: "#ffffff",
            outlineWidth: 1,
          },
          line: {
            width: 1,
            color: "#ff0000",
          },
          polygon: {
            color: "#ffff00",
            outlineColor: "#ffffff",
            outlineWidth: 1,
            opacity: 1,
          },
        };
      },
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    $_setHeight(entities) {
      const { viewer } = this;
      const vm = this;
      viewer.camera.changed.addEventListener(function () {
        const height = viewer.camera.positionCartographic.height / 1000;
        vm.$_changeVisible(entities, height);
      });
    },
    $_changeVisible(entities, height) {
      if (!Array.isArray(entities)) return;
      if (this.visible && height < this.offsetHeight) {
        entities.forEach((item) => (item.show = true));
      } else {
        entities.forEach((item) => (item.show = false));
      }
    },
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Cesium.GeoJsonDataSource.load(baseUrl, {
        clampToGround: true,
      });
    },
    parseData(data) {
      const vm = this;
      if (typeof data === "string") {
        fetch(data)
          .then((res) => res.json())
          .then((geojson) => {
            vm.parseBBox(geojson);
          });
      } else {
        vm.parseBBox(data);
      }
    },
    parseBBox(geojson) {
      this.bbox = bbox(geojson);
      if (this.bbox && this.autoReset) {
        let [xMin, yMin, xMax, yMax] = this.bbox;
        let center = new Cesium.Cartesian3.fromDegrees(
          (xMin + xMax) / 2,
          (yMin + yMax) / 2
        );
        let dr = new Cesium.Cartographic.fromDegrees(xMax, yMax);
        let ul = new Cesium.Cartographic.fromDegrees(xMin, yMin);
        let geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(dr, ul);
        let radius = geodesic.surfaceDistance;
        let boundingSphere = {
          center: center,
          radius: radius,
        };
        this.viewer.scene.camera.viewBoundingSphere(
          boundingSphere,
          new Cesium.HeadingPitchRange(0.0, -1.42, boundingSphere.radius)
        );
        this.viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      }
      this.$emit("bbox", { bbox: this.bbox });
    },
    parseClick(payload) {
      if (this.enableHighlight) this.highlight(payload);
      const { vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      const pickEntity = payload.entities[0].id;
      if (!find) return;
      for (let i = 0; i < find.source.entities.values.length; i++) {
        let entity = find.source.entities.values[i];
        if (entity.id == pickEntity.id) {
          this.$emit("themeClick", { entity: payload });
        }
      }
    },
    parseHover(payload) {
      if (this.enableHighlightHover) this.highlight(payload);
      if (this.enableTips) this.changePopup(payload);
      const { vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      const pickEntity = payload.entities[0].id;
      if (!find) return;
      for (let i = 0; i < find.source.entities.values.length; i++) {
        let entity = find.source.entities.values[i];
        if (entity.id == pickEntity.id) {
          this.$emit("themeHover", { entity: payload });
        }
      }
    },
    // 根据dataSource获取当前geojson的全部entities
    $_findAllEntities(dataSource) {
      let entities = dataSource.entities.values;
      return entities;
    },
    // 构造16进制随机颜色
    $_setRandomColor() {
      let colorStr = "";
      const randomArr = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
      ];
      for (let i = 0; i < 6; i++) {
        colorStr += randomArr[Math.ceil(Math.random() * (15 - 0) + 0)];
      }
      const randomColor = `#${colorStr}`;
      return randomColor;
    },
    // 根据随机颜色生成随机样式
    $_setRandomStyle(entity, layerStyle) {
      let randomColor = this.$_setRandomColor();
      const color = randomColor;
      const outlineColor = randomColor;
      let tempLayerStyle;
      if (entity.billboard) {
        const { radius, outlineWidth } = layerStyle;
        tempLayerStyle = {
          radius,
          color,
          outlineColor,
          outlineWidth,
        };
      } else if (entity.polyline && !entity.polygon) {
        const { width, outlineWidth } = layerStyle;
        tempLayerStyle = {
          width,
          color,
          outlineColor,
          outlineWidth,
        };
      } else if (entity.polygon) {
        const { outlineWidth, opacity } = layerStyle;
        tempLayerStyle = {
          color,
          outlineColor,
          outlineWidth,
          opacity,
        };
      }
      return tempLayerStyle;
    },
    // 16进制颜色转为RGB
    $_set16ToRgb(str) {
      const reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
      if (!reg.test(str)) {
        return;
      }
      let newStr = str.toLowerCase().replace(/\#/g, "");
      let len = newStr.length;
      if (len == 3) {
        let t = "";
        for (let i = 0; i < len; i++) {
          t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1));
        }
        newStr = t;
      }
      //将字符串分隔，两个两个的分隔
      let arr = [];
      for (var i = 0; i < 6; i = i + 2) {
        let s = newStr.slice(i, i + 2);
        arr.push(parseInt("0x" + s));
      }
      return "rgb(" + arr.join(",") + ")";
    },
    // RGB转为16进制颜色
    $_setRgbTo16(str) {
      const reg = /^(rgb|RGB)/;
      if (!reg.test(str)) {
        return;
      }
      let arr = str.slice(4, str.length - 1).split(",");
      let color = "#";
      for (let i = 0; i < arr.length; i++) {
        let t = Number(arr[i]).toString(16);
        // 十进制中的0-15转为16进制只有一位，需要补齐一个"0"
        if (t.length < 2) {
          t = "0" + t;
        }
        color += t;
      }
      return color;
    },
    // 构造渐变样式，包括颜色、透明度
    $_setGradualStyle(gradualLayerStyle) {
      let {
        range,
        color,
        outlineColor,
        outlineWidth,
        opacity,
        startColor,
        endColor,
        startOpacity,
        endOpacity,
      } = gradualLayerStyle;
      let step = range.length - 1;
      const minRange = Math.min(...range);
      const maxRange = Math.max(...range);
      const normalizeRange = range.map((item) => {
        return (item - minRange) / (maxRange - minRange);
      });
      // 生成均匀渐变颜色
      let gradualColor = [];
      if (startColor && endColor) {
        let startColorRGB = this.$_set16ToRgb(startColor);
        let endColorRGB = this.$_set16ToRgb(endColor);
        let [startR, startG, startB] = startColorRGB
          .slice(4, startColorRGB.length - 1)
          .split(",");
        let [endR, endG, endB] = endColorRGB
          .slice(4, endColorRGB.length - 1)
          .split(",");
        let sR = (endR - startR) / (step - 1);
        let sG = (endG - startG) / (step - 1);
        let sB = (endB - startB) / (step - 1);
        for (let i = 0; i < step; i++) {
          let hex =
            "rgb(" +
            parseInt(Number(startR) + sR * i) +
            "," +
            parseInt(Number(startG) + sG * i) +
            "," +
            parseInt(Number(startB) + sB * i) +
            ")";
          hex = this.$_setRgbTo16(hex);
          gradualColor.push(hex);
        }
      }
      // 生成均匀渐变透明度
      let gradualOpacity = [];
      if (startOpacity && endOpacity) {
        let sO = (endOpacity - startOpacity) / (step - 1);
        for (let j = 0; j < step; j++) {
          let tempOpacity = startOpacity + sO * j;
          gradualOpacity.push(tempOpacity);
        }
        // gradualOpacity = range.map(item => {
        //   return startOpacity + (item - minRange)/(maxRange - minRange)*(endOpacity - startOpacity);
        // });
      }
      let gradualStyle = [];
      for (let k = 0; k < range.length - 1; k++) {
        let style = {
          color: gradualColor[k] ? gradualColor[k] : color,
          outlineColor: gradualColor[k] ? gradualColor[k] : outlineColor,
          outlineWidth: outlineWidth ? outlineWidth : 0,
          opacity: gradualOpacity[k] ? gradualOpacity[k] : opacity,
        };
        gradualStyle.push(style);
      }
      return gradualStyle;
    },
    // 根据字段名称，获取字段的最大最小值
    $_getFieldMaxin(entities, field) {
      let valueArr = [];
      let min = 0;
      let max = 0;
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        let tempValue = entity._properties[field]._value;
        min = tempValue < min ? tempValue : min;
        max = tempValue > max ? tempValue : max;
        valueArr.push[tempValue];
      }
      return { min, max };
    },
    // 根据渲染规则中的属性字段值查找对应entities
    $_findEntitiesByFieldvalue(entities, field, value) {
      if (entities.length == 0) return;
      const valueArr = Array.isArray(value) ? value : [value];
      let fieldEntities = [];
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        let propertyName = entity._properties._propertyNames;
        if (!propertyName.some((item) => item === field)) {
          break;
        }
        for (let j = 0; j < valueArr.length; j++) {
          if (entity._properties[field]._value == valueArr[j]) {
            fieldEntities.push(entity);
          }
        }
      }
      return fieldEntities;
    },
    // 根据渲染规则中的属性字段值范围区间查找对应entities
    $_findEntitiesByFieldrange(entities, field, range) {
      if (entities.length == 0) return;
      let rangeEntities = [];
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        let propertyName = entity._properties._propertyNames;
        if (!propertyName.some((item) => item === field)) {
          break;
        }
        const entityValue = entity._properties[field]._value;
        if (entityValue >= range[0] && entityValue < range[1]) {
          rangeEntities.push(entity);
        }
      }
      return rangeEntities;
    },
    // 设置样式及material
    $_setMaterial(entities, options) {
      const { Cesium } = this;
      let { hasMaterial, materialType, style, material } = options;
      if (entities.length == 0) {
        return;
      }
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (hasMaterial == true) {
          let { duration, direction, image } = material;
          let { gapColor, dashLength, dashPattern, gradient, count } = material;
          let colorRGB = new Cesium.Color.fromCssColorString(style.color);
          switch (materialType) {
            case "PolylineTrailLink":
              let trailLinkMaterial = {
                duration,
                direction,
                image,
                color: colorRGB,
              };
              entity.polyline.material =
                new Cesium.PolylineTrailLinkMaterialProperty(trailLinkMaterial);
              entity.polyline.width = style.width;
              break;
            case "PolylineArrow":
              entity.polyline.material =
                new Cesium.PolylineArrowMaterialProperty(colorRGB);
              entity.polyline.width = style.width;
              break;
            case "PolylineDash":
              let gapColorRGB = new Cesium.Color.fromCssColorString(gapColor);
              let dashMaterial = {
                color: colorRGB,
                gapColor: gapColorRGB,
                dashLength,
                dashPattern,
              };
              entity.polyline.material =
                new Cesium.PolylineDashMaterialProperty(dashMaterial);
              entity.polyline.width = style.width;
              break;
            case "Image":
              let imageMaterial = {
                image,
                repeat: new Cesium.Cartesian2(
                  material.repeatX,
                  material.repeatY
                ),
                color: colorRGB,
                transparent: false,
              };
              entity.polygon.material = new Cesium.ImageMaterialProperty(
                imageMaterial
              );
              let imageMaterialLine = {
                duration,
                direction,
                image,
                color: colorRGB,
              };
              entity.polyline.material =
                new Cesium.PolylineTrailLinkMaterialProperty(imageMaterialLine);
              entity.polyline.width = style.outlineWidth;
              break;
            case "CircleWave":
              entity.billboard.show = false;
              entity.ellipse = new Cesium.EllipseGraphics({
                semiMajorAxis: style.radius,
                semiMinorAxis: style.radius,
                outline: true,
                outlineWidth: style.outlineWidth,
                material: new Cesium.CircleWaveMaterialProperty({
                  duration,
                  gradient,
                  color: colorRGB,
                  count,
                }),
              });
              break;
            default:
              let defaultMaterial = {
                duration,
                direction,
                image,
                color: colorRGB,
              };
              entity.polyline.material =
                new Cesium.PolylineTrailLinkMaterialProperty(defaultMaterial);
              entity.polyline.width = style.width;
          }
        } else {
          if (entity.billboard) {
            entity.billboard.show = false;
            entity.ellipse = new Cesium.EllipseGraphics({
              semiMajorAxis: style.radius,
              semiMinorAxis: style.radius,
              outline: true,
              outlineWidth: style.outlineWidth,
              material: Cesium.Color.fromCssColorString(style.color),
            });
          } else if (entity.polyline && !entity.polygon) {
            entity.polyline.material = new Cesium.ColorMaterialProperty(
              Cesium.Color.fromCssColorString(style.color)
            );
            entity.polyline.width = style.width;
          } else if (entity.polygon) {
            entity.polyline.material = new Cesium.ColorMaterialProperty(
              Cesium.Color.fromCssColorString(style.outlineColor)
            );
            entity.polyline.width = style.outlineWidth;
            entity.polyline.clampToGround = true;
            entity.polygon.material = new Cesium.ColorMaterialProperty(
              Cesium.Color.fromCssColorString(style.color).withAlpha(
                style.opacity
              )
            );
          }
        }
      }
    },
  },
};
