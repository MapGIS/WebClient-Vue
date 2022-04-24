import { FillStyle, LineStyle, PointStyle } from "@mapgis/webclient-es6-service/base/style";
import bbox from "@turf/bbox";

import VueOptions from "../../Base/Vue/VueOptions";
import PopupMixin from "../../Layer/Mixin/PopupVirtual";

export const DefaultThemeMains = [
  "_单值专题图",
  "_分段专题图",
];

export const DefaultThemeSubs = [
  "_单值专题图_线",
  "_单值专题图_注记",
  "_单值专题图_符号",
  "_分段专题图_线",
  "_分段专题图_注记",
  "_分段专题图_符号",
];

export const DefaultThemeLayers = [
  "_单值专题图",
  "_单值专题图_线",
  "_单值专题图_注记",
  "_单值专题图_符号",
  "_分段专题图",
  "_分段专题图_线",
  "_分段专题图_注记",
  "_分段专题图_符号",
];

// let themeManager = new ZondyThemeManager();
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
    renderRule: {
      type: Object,
      default: function() {
        return {
          type: "default",
          // type: "uniform",
          // type: "unique",
          // type: "range",
          // type: "gradual",
          // field: "name",
          field: "childrenNum",
          defaultSymbol: new FillStyle({
            color: '#FF3300',
            outlineColor: '#FFFFFF',
            outlineWidth: 1,
            opacity: 1,
          }),
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
        }
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      bbox: undefined,
      dataSource: [],
      entities: [],
    }
  },
  watch: {

  },
  methods: {
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
      this.$emit("bbox", { bbox: this.bbox });
    },
    // parseClick(payload) {
    //   this.$emit("themeClick", {entity: payload});
    // },
    parseHover(payload) {
      this.$emit("themeHover", {entity: payload});
    },
    // 根据dataSource获取当前geojson的全部entities
    $_findAllEntities(dataSource) {
      let entities = dataSource.entities.values;
      return entities;
    },
    // 构造16进制随机颜色
    $_setRandomColor() {
      var colorStr = "";
      var randomArr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
      for(var i = 0; i < 6; i++){
        colorStr += randomArr[Math.ceil(Math.random() * (15-0) + 0)];
      }
      const randomColor = `#${colorStr}`;
      return randomColor;
    },
    // 16进制颜色转为RGB
    $_set16ToRgb(str){
      const reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
      if (!reg.test(str)) {
        return;
      }
      let newStr = (str.toLowerCase()).replace(/\#/g, '')
      let len = newStr.length;
      if (len == 3) {
        let t = '';
        for (let i = 0; i < len; i++) {
          t += newStr.slice(i,i+1).concat(newStr.slice(i,i+1));
        }
        newStr = t;
      }
      //将字符串分隔，两个两个的分隔
      let arr = [];
      for(var i = 0; i < 6; i = i+2){
        let s = newStr.slice(i, i+2);
        arr.push(parseInt("0x" + s));
      }
      return 'rgb(' + arr.join(",")  + ')';
    },
    // RGB转为16进制颜色
    $_setRgbTo16(str) {
      const reg = /^(rgb|RGB)/;
      if (!reg.test(str)) {
        return;
      }
      let arr = str.slice(4, str.length-1).split(",");
      let color = '#';
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
    $_setGradualStyle(gradualValueInfos) {
      let { range, color, outlineColor, outlineWidth, opacity, startColor, endColor, startOpacity, endOpacity } = gradualValueInfos;
      let step = range.length - 1;
      const minRange = Math.min(...range);
      const maxRange = Math.max(...range);
      const normalizeRange = range.map(item => {
        return (item - minRange)/(maxRange - minRange);
      })

      // 生成均匀渐变颜色
      let gradualColor = [];
      if (startColor && endColor) {
        let startColorRGB = this.$_set16ToRgb(startColor);
        let endColorRGB = this.$_set16ToRgb(endColor);
        let [ startR, startG, startB ] = startColorRGB.slice(4, startColorRGB.length-1).split(",");
        let [ endR, endG, endB ] = endColorRGB.slice(4, endColorRGB.length-1).split(",");

        let sR = (endR - startR) / (step - 1);
        let sG = (endG - startG) / (step - 1);
        let sB = (endB - startB) / (step - 1);

        for (let i = 0; i < step; i++) {
          let hex = 'rgb('+ parseInt(Number(startR) + sR * i) + ',' + parseInt(Number(startG) + sG * i) + ',' + parseInt(Number(startB) + sB * i) + ')';
          hex = this.$_setRgbTo16(hex);
          gradualColor.push(hex);
        };
      };

      // 生成均匀渐变透明度
      let gradualOpacity = [];
      if (startOpacity && endOpacity) {
        let sO = (endOpacity - startOpacity) / (step - 1);
        for (let j = 0; j < step; j ++) {
          let tempOpacity = startOpacity + sO * j;
          gradualOpacity.push(tempOpacity);
        };
        // gradualOpacity = range.map(item => {
        //   return startOpacity + (item - minRange)/(maxRange - minRange)*(endOpacity - startOpacity);
        // });
      };
      
      let gradualStyle = [];
      for (let k = 0; k < range.length-1; k++) {
        let symbolStyle = new FillStyle({
          color: gradualColor[k] ? gradualColor[k] : color,
          outlineColor: gradualColor[k] ? gradualColor[k] : outlineColor,
          outlineWidth: outlineWidth ? outlineWidth : 0,
          opacity: gradualOpacity[k] ? gradualOpacity[k] : opacity
        });
        gradualStyle.push(symbolStyle);
      };
      return gradualStyle;
    },
    // 根据渲染规则中的属性字段值查找对应entities
    $_findEntitiesByFieldvalue(entities, field, value) {
      if (entities.length == 0) {
        return {};
      }
      let fieldEntities = [];
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        let propertyName = entity._properties._propertyNames;
        if (!propertyName.some(item => item === field)) {
          break;
        }
        if (entity._properties[field]._value == value) {
          fieldEntities.push(entity);
        }
      }
      return fieldEntities;
    },
    // 根据渲染规则中的属性字段值范围区间查找对应entities
    $_findEntitiesByFieldrange(entities, field, range) {
      if (entities.length == 0) {
        return {};
      }
      let rangeEntities = [];
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        let propertyName = entity._properties._propertyNames;
        if (!propertyName.some(item => item === field)) {
          break;
        }
        const entityValue = entity._properties[field]._value;
        if (typeof entityValue == "number") {
          if (entityValue >= range[0] && entityValue < range[1]) {
            rangeEntities.push(entity);
          }
        } else {
          for (let j = 0; j < range.length; j++) {
            if (entityValue == range[j]) {
              rangeEntities.push(entity);
            }
          }
        }
      }
      return rangeEntities;
    },
    // 根据对应的style为entity贴上material
    $_setMaterial(entities, symbolStyle) {
      const { Cesium } = this;
      const symbolStyleLine = new LineStyle({
        width: symbolStyle.outlineWidth,
        color: symbolStyle.outlineColor
      });
      const style = symbolStyle.toCesiumStyle(Cesium);
      const { material, outlineColor } = style;
      const styleLine = symbolStyleLine.toCesiumStyle(Cesium);
      const { width } = styleLine;

      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        entity.polygon.material = material;
        entity.polygon.outlineColor = outlineColor;
        entity.polyline.material = styleLine.material;
        entity.polyline.width = width;
      }
    },
  }
}
