import { MRFS } from "@mapgis/webclient-es6-service";
import EventBusMapMixin from "../../../lib/eventbus/EventBusMapMixin";
import {
  emitMapChangeStyle,
  emitMapAddLayer,
  emitMapRemoveLayer
} from "../../../lib/eventbus/EmitMap";

const { FeatureService } = MRFS;

export const DefaultThemeLayers = [
  "_单值专题图",
  "_单值专题图_线",
  "_单值专题图_注记",
  "_单值专题图_符号",
  "_分段专题图",
  "_分段专题图_线",
  "_分段专题图_注记",
  "_分段专题图_符号",
  "_等级专题图",
  "_等级专题图_线",
  "_等级专题图_注记",
  "_热力专题图",
  "_热力专题图_线",
  "_热力专题图_注记"
];

export default {
  mixin: [EventBusMapMixin],
  inject: ["mapbox", "map"],
  props: {
    baseUrl: {
      type: String
    },
    sourceId: {
      type: String
    },
    layerId: {
      type: String
    },
    sourceLayer: {
      type: String
    },
    useOriginLayer: {
      type: Boolean,
      default: true
    },
    icons: {
      type: Array
    },
    themeTypeArr: {
      type: Array
    },
    themeDefaultType: {
      type: String
    },
    closeAllPanel: {
      type: Boolean,
      default: false
    },
    panelProps: {
      type: Object,
      default() {
        return {};
      }
    },
    resetAllLayer: {
      type: Boolean,
      default: false
    },
    iconUrl: {
      type: String
    }
  },
  watch: {
    baseUrl: {
      handler: function() {
        this.$_getFromGeoJSON();
      }
    },
    sourceId: {
      handler: function() {
        if (!this.sourceLayer) {
          throw new Error("sourceLayer不能为空！");
        } else if (this.useOriginLayer) {
          throw new Error("请将useOriginLayer设为false！");
        } else {
          this.$_getFromSource(this.sourceLayer);
        }
      }
    },
    layerId: {
      handler: function() {
        if (!this.useOriginLayer) {
          throw new Error("请将useOriginLayer设为true！");
        } else {
          this.layerIdCopy = this.layerId;
          this.$_getFromSource(this.layerIdCopy);
        }
      }
    },
    themeDefaultType: {
      handler: function() {}
    },
    themeTypeArr: {
      handler: function() {
        this.themeTypeArrCopy = this.themeTypeArr;
      }
    }
  },
  data() {
    return {
      defaultValue: undefined,
      colors: [],
      originColors: [],
      startColor: "#FFFFFF",
      endColor: "#FF0000",
      showLayer: true,
      showPanelFlag: true,
      resetPanel: false,
      sourceVector: {
        type: "geojson",
        data: undefined
      },
      dataCopy: undefined,
      showVector: false,
      fields: [],
      selectKey: undefined,
      selectText: undefined,
      dataSource: [],
      checkBoxArr: [],
      allOriginColors: {},
      dataType: "",
      textLayer: undefined,
      offsetText: [0, 0],
      offset: [0, 0],
      themeType: "range",
      opacity: 1,
      lineWidth: 2,
      fontColor: "#000000",
      haloColor: "#FFFFFF",
      haloWidth: 0,
      textRotation: 0,
      textPadding: 0.05,
      fontSize: 11,
      radius: 6,
      heatMapColor: undefined,
      heatMapRadius: 7,
      outerLineOpacity: 1,
      outerLineColor: "#000000",
      lineLayer: undefined,
      textFonts: ["宋体", "微软雅黑"],
      textFont: undefined,
      source_vector_Id: undefined,
      source_vector_layer_Id: undefined,
      originLayer: undefined,
      changeLayerProp: false,
      changeLayerId: undefined,
      layerIdCopy: undefined,
      lineId: undefined,
      textId: undefined,
      extraLayer: [],
      upLayer: undefined,
      allFields: undefined,
      themeTypeArrCopy: undefined,
      rangeFields: [],
      isGradient: true,
      isSingle: true,
      rangeLevel: 10,
      selectValue: undefined,
      opacityBack: {}
    };
  },
  methods: {
    showExtraLayer(layerId, themeType) {
      this.$_showExtraLayer(layerId, themeType);
    },
    hideExtraLayer(layerId, themeType) {
      this.$_hideExtraLayer(layerId, themeType);
    },
    $_hideExtraLayer(layerId, themeType) {
      let extraLayer =
        window.originLayer[layerId][
          layerId + "_" + this.$_getThemeName(themeType) + "_extraLayer"
        ];
      if (extraLayer) {
        if (extraLayer instanceof Array) {
          for (let i = 0; i < extraLayer.length; i++) {
            this.$_setLayOutProperty(
              "visibility",
              "none",
              extraLayer[i].value,
              window.originLayer[layerId][extraLayer[i].value],
              layerId
            );
          }
        } else if (extraLayer instanceof Object) {
          let vm = this;
          Object.keys(extraLayer).forEach(function(key) {
            key = Number(key);
            vm.$_setLayOutProperty(
              "visibility",
              "none",
              extraLayer[key].value,
              window.originLayer[layerId][extraLayer[key].value],
              layerId
            );
          });
        }
      }
      this.$_setLayOutProperty(
        "visibility",
        "none",
        layerId + "_" + this.$_getThemeName(themeType),
        window.originLayer[layerId][
          layerId + "_" + this.$_getThemeName(themeType)
        ],
        layerId
      );
    },
    $_showExtraLayer(layerId, themeType) {
      let extraLayer =
        window.originLayer[layerId][
          layerId + "_" + this.$_getThemeName(themeType) + "_extraLayer"
        ];
      if (extraLayer) {
        if (extraLayer instanceof Array) {
          for (let i = 0; i < extraLayer.length; i++) {
            this.$_setLayOutProperty(
              "visibility",
              "visible",
              extraLayer[i].value,
              window.originLayer[layerId][extraLayer[i].value],
              layerId
            );
          }
        } else if (extraLayer instanceof Object) {
          let vm = this;
          Object.keys(extraLayer).forEach(function(key) {
            key = Number(key);
            vm.$_setLayOutProperty(
              "visibility",
              "visible",
              extraLayer[key].value,
              window.originLayer[layerId][extraLayer[key].value],
              layerId
            );
          });
        }
      }
      this.$_setLayOutProperty(
        "visibility",
        "visible",
        layerId + "_" + this.$_getThemeName(themeType),
        window.originLayer[layerId][
          layerId + "_" + this.$_getThemeName(themeType)
        ],
        layerId
      );
    },
    addThemeLayer(layerId, addLayer, minzoom, maxzoom) {
      minzoom = minzoom || 0;
      maxzoom = maxzoom || 24;
      this.$_addThemeLayer(layerId, addLayer, minzoom, maxzoom);
    },
    $_addLayer(layerId, newId) {
      newId = newId || layerId;
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
        this.map.addLayer(window.originLayer[this.layerIdCopy][newId]);
      }
    },
    $_addThemeLayer(layerId, addLayer, minzoom, maxzoom) {
      this.resetPanel = false;
      this.layerIdCopy = layerId;
      this.showPanelFlag = true;
      let themeId = layerId + "_" + this.$_getThemeName();
      if (!window.originLayer[layerId]) {
        window.originLayer[layerId] = {};
      }
      if (
        window.originLayer[this.layerIdCopy] &&
        (!window.originLayer[this.layerIdCopy].hasOwnProperty(themeId) ||
          !window.originLayer[this.layerIdCopy][themeId])
      ) {
        this.$_getFromSource(layerId, minzoom, maxzoom);
      } else if (
        window.originLayer[this.layerIdCopy] &&
        window.originLayer.layerOrder.indexOf(this.layerIdCopy) > -1
      ) {
        this.$_getFromSource(layerId, minzoom, maxzoom);
      } else {
        this.dataType = window.originLayer[layerId].dataType;
        if (this.themeType === "symbol") {
          this.$_setLayOutProperty(
            "visibility",
            "visible",
            themeId,
            window.originLayer[this.layerIdCopy][themeId]
          );
        } else {
          if (!addLayer) {
            let extraLayer =
              window.originLayer[this.layerIdCopy][
                layerId + "_" + this.$_getThemeName() + "_extraLayer"
              ];
            if (extraLayer && extraLayer.length > 0) {
              for (let i = 0; i < extraLayer.length; i++) {
                this.$_setLayOutProperty(
                  "visibility",
                  "visible",
                  extraLayer[i].value,
                  window.originLayer[this.layerIdCopy][extraLayer[i].value]
                );
              }
            }
            this.$_setLayOutProperty(
              "visibility",
              "visible",
              themeId,
              window.originLayer[this.layerIdCopy][themeId]
            );
          } else {
            let extraLayer =
              window.originLayer[this.layerIdCopy][
                this.layerIdCopy + "_" + this.$_getThemeName() + "_extraLayer"
              ];
            this.map.addLayer(
              window.originLayer[this.layerIdCopy][
                this.layerIdCopy + "_" + this.$_getThemeName()
              ]
            );
            for (let i = 0; i < extraLayer.length; i++) {
              this.map.addLayer(
                window.originLayer[this.layerIdCopy][extraLayer[i].value]
              );
            }
            // this.panelPropsDefault =  window.originLayer[this.layerIdCopy].panelProps.panelProps;
          }
        }
      }
      this.$_setLayerOrder();
    },
    resetLayer(layerId) {
      this.$_resetLayer(layerId);
    },
    $_deleteExtraLayer(layerId, dataType) {
      let extraLayer =
        window.originLayer[layerId][
          layerId + "_" + this.$_getThemeName(dataType) + "_extraLayer"
        ];
      if (extraLayer) {
        if (extraLayer instanceof Array) {
          for (let i = 0; i < extraLayer.length; i++) {
            let id = extraLayer[i].value;
            let layer = this.map.getLayer(id);
            if (layer) {
              emitMapRemoveLayer(id);
              this.map.removeLayer(id);
              if (this.hasOwnProperty(extraLayer[i].key)) {
                this[extraLayer[i].key] = undefined;
              }
            }
          }
        } else if (extraLayer instanceof Object) {
          let vm = this;
          Object.keys(extraLayer).forEach(function(key) {
            key = Number(key);
            let id = extraLayer[key].value;
            let layer = vm.map.getLayer(id);
            if (layer) {
              emitMapRemoveLayer(id);
              vm.map.removeLayer(id);
              if (vm.hasOwnProperty(extraLayer[key].key)) {
                vm[extraLayer[key].key] = undefined;
              }
            }
          });
        }
      }
      if (this.map.getLayer(layerId + "_" + this.$_getThemeName(dataType))) {
        this.map.removeLayer(layerId + "_" + this.$_getThemeName(dataType));
        if (window.originThemeData && window.originThemeData[layerId]) {
          delete window.originThemeData[layerId];
        }
      }
    },
    deleteExtraLayer(layerId, dataType) {
      this.$_deleteExtraLayer(layerId, dataType);
    },
    $_showLayerByOpacity(layerId) {
      let dataType = window.originLayer[layerId].dataType;
      switch (dataType) {
        case "fill":
          this.$_setPaintProperty(
            "fill-opacity",
            window.originLayer[layerId].opacityBack["fill-opacity"],
            layerId,
            window.originLayer[layerId][layerId]
          );
          this.$_setPaintProperty(
            "fill-outline-color",
            window.originLayer[layerId].opacityBack["fill-outline-color"],
            layerId,
            window.originLayer[layerId][layerId]
          );
          break;
        case "line":
          this.$_setPaintProperty(
            "line-opacity",
            window.originLayer[layerId].opacityBack["line-opacity"],
            layerId,
            window.originLayer[layerId][layerId]
          );
          break;
        case "circle":
          this.$_setPaintProperty(
            "circle-opacity",
            window.originLayer[layerId].opacityBack["circle-opacity"],
            layerId,
            window.originLayer[layerId][layerId]
          );
          this.$_setPaintProperty(
            "circle-stroke-opacity",
            window.originLayer[layerId].opacityBack["circle-stroke-opacity"],
            layerId,
            window.originLayer[layerId][layerId]
          );
          break;
      }
    },
    $_resetMainLayer(layerId) {
      // this.$_setLayOutProperty(
      //   "visibility",
      //   "visible",
      //   layerId,
      //   window.originLayer[layerId][layerId]
      // );
      this.$_showLayerByOpacity(layerId);
      delete window.originLayer[layerId];
      emitMapChangeStyle(this.map.getStyle());
      this.resetPanel = true;
      this.$_setLayerOrder();
      this.$emit("resetLayer");
    },
    resetMainLayer(layerId) {
      this.$_resetMainLayer(layerId);
    },
    $_resetLayer(layerId) {
      if (layerId) {
        let lineLayer = this.map.getLayer(this.lineId);
        let textLayer = this.map.getLayer(this.textId);
        if (lineLayer) {
          this.map.removeLayer(this.lineId);
          this.lineLayer = undefined;
          delete window.originLayer[this.layerIdCopy][this.lineId];
        }
        if (textLayer) {
          this.map.removeLayer(this.textId);
          this.textLayer = undefined;
          delete window.originLayer[this.layerIdCopy][this.textId];
        }
        emitMapRemoveLayer(this.lineId);
        emitMapRemoveLayer(this.textId);
        emitMapChangeStyle(this.map.getStyle());
        let paint =
          window.originLayer[this.layerIdCopy][this.layerIdCopy].paint;
        let layout =
          window.originLayer[this.layerIdCopy][this.layerIdCopy].layout;
        for (let key in paint) {
          if (paint.hasOwnProperty(key) && key.indexOf("_") < 0 && paint[key]) {
            this.$_setPaintProperty(key, paint[key]);
          }
        }
        for (let key in layout) {
          if (
            layout.hasOwnProperty(key) &&
            key.indexOf("_") < 0 &&
            layout[key]
          ) {
            this.$_setPaintProperty(key, paint[layout]);
          }
        }
        delete window.originLayer[this.layerIdCopy][this.layerIdCopy];
        delete window.originLayer[this.layerIdCopy][
          this.layerIdCopy + "_" + this.$_getThemeName()
        ];
        this.resetPanel = true;
        this.$emit("resetLayer");
      }
    },
    $_setColors(colors) {
      this.colors = colors;
    },
    $_formatProps() {
      let formatArr = [
        {
          before: "select-value",
          after: "defaultValue"
        },
        {
          before: "icon-size",
          after: "radius"
        },
        {
          before: "icon-size-max",
          after: "radiusMax"
        },
        {
          before: "icon-size-step",
          after: "radiusStep"
        },
        {
          before: "icon-offset-x",
          after: "xOffset"
        },
        {
          before: "icon-offset-x-min",
          after: "xOffsetMin"
        },
        {
          before: "icon-offset-x-max",
          after: "xOffsetMax"
        },
        {
          before: "icon-offset-x-step",
          after: "xOffsetStep"
        },
        {
          before: "icon-offset-y",
          after: "yOffset"
        },
        {
          before: "icon-offset-y-min",
          after: "yOffsetMin"
        },
        {
          before: "icon-offset-y-max",
          after: "yOffsetMax"
        },
        {
          before: "icon-offset-y-step",
          after: "yOffsetStep"
        },
        {
          before: "icon-rotate",
          after: "rotation"
        },
        {
          before: "icon-rotate-step",
          after: "rotationStep"
        },
        {
          before: "text-field",
          after: "labelSelectValue"
        },
        {
          before: "text-font",
          after: "textFontsSelect"
        },
        {
          before: "text-color",
          after: "fontColor"
        },
        {
          before: "text-halo-color",
          after: "haloColor"
        },
        {
          before: "text-halo-width",
          after: "haloWidth"
        },
        {
          before: "text-halo-width-step",
          after: "haloWidthStep"
        },
        {
          before: "text-halo-width-max",
          after: "haloWidthMax"
        },
        {
          before: "text-offset-x",
          after: "xOffsetText"
        },
        {
          before: "text-offset-x-min",
          after: "xOffsetTextMin"
        },
        {
          before: "text-offset-x-max",
          after: "xOffsetTextMax"
        },
        {
          before: "text-offset-x-step",
          after: "xOffsetTextStep"
        },
        {
          before: "text-offset-y",
          after: "yOffsetText"
        },
        {
          before: "text-offset-y-min",
          after: "yOffsetTextMin"
        },
        {
          before: "text-offset-y-max",
          after: "yOffsetTextMax"
        },
        {
          before: "text-offset-y-step",
          after: "yOffsetTextStep"
        },
        {
          before: "text-padding",
          after: "textPadding"
        },
        {
          before: "text-padding-Step",
          after: "textPaddingStep"
        },
        {
          before: "text-padding-max",
          after: "textPaddingMax"
        },
        {
          before: "text-rotate",
          after: "textRotation"
        },
        {
          before: "text-rotate-step",
          after: "textRotationStep"
        },
        {
          before: "text-size",
          after: "fontSize"
        },
        {
          before: "icon-opacity",
          after: "opacity"
        },
        {
          before: "line-width",
          after: "lineWidth"
        },
        {
          before: "line-opacity",
          after: "opacity"
        },
        {
          before: "circle-stroke-width",
          after: "lineWidth"
        },
        {
          before: "line-width-max",
          after: "lineWidthMax"
        },
        {
          before: "line-width-step",
          after: "lineWidthStep"
        },
        {
          before: "line-opacity",
          after: "opacity"
        },
        {
          before: "text-letter-spacing",
          after: "textPadding"
        },
        {
          before: "circle-opacity",
          after: "opacity"
        },
        {
          before: "circle-stroke-opacity",
          after: "outerLineOpacity"
        },
        {
          before: "circle-translate",
          after: "offset"
        },
        {
          before: "circle-translate-x",
          after: "xOffset"
        },
        {
          before: "circle-translate-y",
          after: "yOffset"
        },
        {
          before: "circle-stroke-color",
          after: "outerLineColor"
        },
        {
          before: "fill-opacity",
          after: "opacity"
        },
        {
          before: "heatmap-color",
          after: "heatMapColor"
        },
        {
          before: "heatmap-radius",
          after: "heatMapRadius"
        },
        {
          before: "heatmap-opacity",
          after: "opacity"
        }
      ];
      this.panelPropsDefault = Object.assign(
        this.panelPropsDefault,
        this.panelProps
      );
      let vm = this;
      for (let i = 0; i < formatArr.length; i++) {
        if (this.panelPropsDefault.hasOwnProperty(formatArr[i].before)) {
          this.panelPropsDefault[formatArr[i].after] = this.panelPropsDefault[
            formatArr[i].before
          ];
        }
      }
      Object.keys(this.$data).forEach(function(key) {
        if (vm.panelPropsDefault.hasOwnProperty(key)) {
          vm.$data[key] = vm.panelPropsDefault[key];
        }
      });
    },
    $_getValidHeatFieldFromGeoJson(GeoJson) {
      let features = GeoJson.features,
        field = undefined;
      if (features.length > 0) {
        Object.keys(features[0].properties).forEach(function(key) {
          if (field) {
            return false;
          }
          let valueArr = [];
          for (let i = 0; i < features.length; i++) {
            if (valueArr.indexOf(features[i].properties[key]) < 0) {
              valueArr.push(features[i].properties[key]);
            }
          }
          if (valueArr.length > 10) {
            field = key;
          }
        });
      }
      return field;
    },
    $_gradientColor(startColor, endColor, step) {
      let startRGB = this.$_colorRgb(startColor); //转换为rgb数组模式
      let startR = startRGB[0];
      let startG = startRGB[1];
      let startB = startRGB[2];

      let endRGB = this.$_colorRgb(endColor);
      let endR = endRGB[0];
      let endG = endRGB[1];
      let endB = endRGB[2];

      let sR = (endR - startR) / step; //总差值
      let sG = (endG - startG) / step;
      let sB = (endB - startB) / step;

      let colorArr = [];
      for (let i = 0; i < step; i++) {
        //计算每一步的hex值
        let hex = this.$_colorHex(
          "rgb(" +
            parseInt(sR * i + startR) +
            "," +
            parseInt(sG * i + startG) +
            "," +
            parseInt(sB * i + startB) +
            ")"
        );
        colorArr.push(hex);
      }
      return colorArr;
    },
    $_colorRgb(sColor) {
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      sColor = sColor.toLowerCase();
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          let sColorNew = "#";
          for (let i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
          }
          sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange;
      } else {
        return sColor;
      }
    },
    $_colorHex(rgb) {
      let _this = rgb;
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      if (/^(rgb|RGB)/.test(_this)) {
        let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for (let i = 0; i < aColor.length; i++) {
          let hex = Number(aColor[i]).toString(16);
          hex = hex < 10 ? 0 + "" + hex : hex; // 保证每个rgb的值为2位
          if (hex === "0") {
            hex += hex;
          }
          strHex += hex;
        }
        if (strHex.length !== 7) {
          strHex = _this;
        }
        return strHex;
      } else if (reg.test(_this)) {
        let aNum = _this.replace(/#/, "").split("");
        if (aNum.length === 6) {
          return _this;
        } else if (aNum.length === 3) {
          let numHex = "#";
          for (let i = 0; i < aNum.length; i += 1) {
            numHex += aNum[i] + aNum[i];
          }
          return numHex;
        }
      } else {
        return _this;
      }
    },
    $_toggleLayer() {
      let show = this.showLayer ? "none" : "visible";
      this.showLayer = !this.showLayer;
      this.map.setLayoutProperty(this.layerIdCopy, "visibility", show);
      if (this.map.getLayer(this.lineId)) {
        this.map.setLayoutProperty(this.lineId, "visibility", show);
      }
      if (this.map.getLayer(this.textId)) {
        this.map.setLayoutProperty(this.textId, "visibility", show);
      }
    },
    toggleLayer() {
      this.$_toggleLayer();
    },
    togglePanel(toggleLayer) {
      this.showPanelFlag = !this.showPanelFlag;
      if (toggleLayer) {
        this.$_toggleLayer();
      }
    },
    $_closePanel() {
      if (!this.closeAllPanel) {
        this.showPanelFlag = false;
        if (this.resetAllLayer) {
          this.$emit("resetAllLayer", this);
        } else {
          this.$_resetLayer();
        }
      } else {
        this.$emit("closePanel");
      }
    },
    $_showPanel() {
      this.showPanelFlag = true;
      this.$_toggleLayer();
    },
    $_mount() {
      if (!window._workspace) {
        window._workspace = {};
        window._workspace._layerTypes = {};
      }
      if (!window.originLayer) {
        window.originLayer = {};
        window.originLayer.layerOrder = [];
      }
      if (!window.originThemeData) {
        window.originThemeData = {};
      }
      this.themeTypeArrCopy = this.themeTypeArr;
      if (
        this.panelPropsDefault.hasOwnProperty("xOffset") &&
        this.panelPropsDefault.xOffset
      ) {
        this.$set(this.offset, 0, this.panelPropsDefault.xOffset);
      }
      if (
        this.panelPropsDefault.hasOwnProperty("yOffset") &&
        this.panelPropsDefault.yOffset
      ) {
        this.$set(this.offset, 1, this.panelPropsDefault.yOffset * -1);
      }
      if (
        this.panelPropsDefault.hasOwnProperty("xOffsetText") &&
        this.panelPropsDefault.xOffsetText
      ) {
        this.$set(this.offsetText, 0, this.panelPropsDefault.xOffsetText);
      }
      if (
        this.panelPropsDefault.hasOwnProperty("yOffsetText") &&
        this.panelPropsDefault.yOffsetText
      ) {
        this.$set(this.offsetText, 1, this.panelPropsDefault.yOffsetText * -1);
      }
      if (
        this.panelPropsDefault.hasOwnProperty("opacity") &&
        this.panelPropsDefault.opacity
      ) {
        this.opacity = this.panelPropsDefault.opacity / 100;
      }
      if (this.sourceId && this.sourceLayer) {
        if (this.useOriginLayer) {
          throw new Error("请将useOriginLayer设为false！");
        } else {
          this.$_getFromSource(this.sourceLayer);
        }
      } else if (this.layerId) {
        if (!this.useOriginLayer) {
          throw new Error("请将useOriginLayer设为true！");
        } else {
          this.layerIdCopy = this.layerId;
          this.$_getFromSource(this.layerIdCopy);
        }
      } else if (this.baseUrl) {
        this.$_getFromGeoJSON();
      }
      this.$emit("loaded", this);
    },
    $_lineWidthChanged(lineWidth) {
      switch (this.dataType) {
        case "line":
          this.$_setPaintProperty("line-width", lineWidth);
          break;
        case "circle":
          this.$_setPaintProperty("circle-stroke-width", lineWidth);
          break;
      }
    },
    $_setLayerOrder() {
      window.originLayer.layerOrder = [];
      let style = this.map.getStyle();
      let layerIds = [];
      Object.keys(window.originLayer).forEach(function(key) {
        if (window.originLayer.hasOwnProperty(key) && key !== "layerOrder") {
          Object.keys(window.originLayer[key]).forEach(function(layerId) {
            if (
              layerId !== "layerId" &&
              layerId !== "layerOrder" &&
              layerId !== "panelProps" &&
              layerId !== "themeType"
            ) {
              layerIds.push(layerId);
            }
          });
        }
      });
      for (let i = 0; i < style.layers.length; i++) {
        let id = style.layers[i].id;
        if (layerIds.indexOf(id) > -1) {
          window.originLayer.layerOrder.push(id);
        }
      }
    },
    $_selectTextChanged(value) {
      if (!this.textLayer) {
        if (!this.textFont) {
          this.textFont = this.textFonts[0];
        }
        this.textLayer = {
          id: this.textId,
          source: this.source_vector_Id,
          type: "symbol",
          layout: {
            "text-field": "{" + value + "}",
            "text-size": this.fontSize,
            "text-letter-spacing": this.textPadding,
            "text-offset": this.offsetText,
            "text-font": [this.textFont, this.textFont],
            "text-rotate": this.textRotation
          },
          paint: {
            "text-color": this.fontColor,
            "text-halo-color": this.haloColor,
            "text-halo-width": this.haloWidth
          }
        };
        if (this.source_vector_layer_Id) {
          this.textLayer["source-layer"] = this.source_vector_layer_Id;
        }
        if (!this.map.getLayer(this.textId)) {
          this.map.addLayer(this.textLayer);
        } else {
          this.$_setLayOutProperty(
            "text-field",
            "{" + value + "}",
            this.textId,
            window.originLayer[this.layerIdCopy][this.textId]
          );
        }
        emitMapAddLayer({ layer: this.textLayer });
        emitMapChangeStyle(this.map.getStyle());
      } else {
        this.$_setLayOutProperty(
          "text-field",
          "{" + value + "}",
          this.textId,
          this.textLayer
        );
      }
    },
    $_setLayOutProperty(key, value, layerId, layerVector, extId) {
      let windowId = layerId
        ? layerId
        : this.layerIdCopy + "_" + this.$_getThemeName();
      layerId = layerId || this.layerIdCopy + "_" + this.$_getThemeName();
      layerVector =
        layerVector ||
        window.originLayer[this.layerIdCopy][
          this.layerIdCopy + "_" + this.$_getThemeName()
        ];
      if (layerVector && layerVector.hasOwnProperty("layout")) {
        if (layerId.indexOf("注记") < 0) {
          layerVector.layout[key] = value;
        }
        let layerID = extId || this.layerIdCopy;
        if (layerID) {
          window.originLayer[layerID][windowId].layout[key] = value;
        }
        this.map.setLayoutProperty(layerId, key, layerVector.layout[key]);
        if (layerId.indexOf("专题图") > -1 && key !== "visibility") {
          window.originLayer[this.layerIdCopy].panelProps[
            this.themeType
          ].panelProps[key] = value;
        }
        this.changeLayerProp = true;
        this.changeLayerId = layerId;
      }
    },
    $_radiusChanged(radius) {
      this.$_setPaintProperty("circle-radius", radius);
    },
    $_outerLineColorChanged(color) {
      this.$_setPaintProperty("circle-stroke-color", color);
    },
    $_singleChanged(startColor, endColor) {
      this.isSingle = true;
      this.$_gradientChange(startColor, endColor, false);
    },
    $_clickSingle(startColor, endColor) {
      if (this.isSingle) {
        if (!this.isGradient) {
          window.originThemeData[this.layerIdCopy][
            this.themeType + "_" + this.selectKey + "_back"
          ] = {
            ...window.originThemeData[this.layerIdCopy][
              this.themeType + "_" + this.selectKey
            ]
          };
        }
        this.$_gradientChange(startColor, endColor, false);
      }
    },
    $_clickGradient(startColor, endColor) {
      if (this.isGradient) {
        this.$_gradientChange(startColor, endColor, false);
      } else {
        let colors = this.$_getColors(
          this.dataSource,
          startColor,
          endColor,
          this.selectKey,
          false,
          true
        );
        this.$_setPaintByType(
          window.originThemeData[this.layerIdCopy][
            this.themeType + "_" + this.selectKey + "_back"
          ],
          true
        );
        this.changeLayerProp = true;
        this.changeLayerId = this.layerIdCopy;
      }
    },
    $_singleChangedOut(startColor, endColor) {
      this.$_gradientChange(startColor, endColor);
      window.originLayer[this.layerIdCopy].panelProps[
        window._workspace._layerTypes[this.layerIdCopy]
      ].panelProps.gradientColor = endColor;
    },
    $_fontColorChanged(color) {
      this.$_setPaintProperty("text-color", color, this.textId, this.textLayer);
    },
    $_haloColorChanged(color) {
      this.$_setPaintProperty(
        "text-halo-color",
        color,
        this.textId,
        this.textLayer
      );
    },
    $_haloWidthChanged(color) {
      this.$_setPaintProperty(
        "text-halo-width",
        color,
        this.textId,
        this.textLayer
      );
    },
    $_fontSizeChanged(fontSize) {
      this.$_setLayOutProperty(
        "text-size",
        fontSize,
        this.textId,
        this.textLayer
      );
    },
    $_xOffsetChanged(xOffset) {
      this.offset[0] = xOffset;
      this.$_setPaintProperty("circle-translate", this.offset);
    },
    $_yOffsetChanged(yOffset) {
      this.offset[1] = yOffset;
      this.$_setPaintProperty("circle-translate", this.offset);
    },
    $_yOffsetTextChanged(offset) {
      this.offsetText[1] = offset;
      this.$_setLayOutProperty(
        "text-offset",
        this.offsetText,
        this.textId,
        this.textLayer
      );
    },
    $_xOffsetTextChanged(offset) {
      this.offsetText[0] = offset;
      this.$_setLayOutProperty(
        "text-offset",
        this.offsetText,
        this.textId,
        this.textLayer
      );
    },
    $_textPaddingChanged(textPadding) {
      this.$_setLayOutProperty(
        "text-letter-spacing",
        textPadding,
        this.textId,
        this.textLayer
      );
    },
    $_textRotationChanged(textRotation) {
      this.$_setLayOutProperty(
        "text-rotate",
        textRotation,
        this.textId,
        this.textLayer
      );
    },
    $_outerLineOpacityChanged(opacity) {
      this.$_setPaintProperty("circle-stroke-opacity", opacity);
    },
    $_lineStyleChanged(lineStyle) {
      this.$_setPaintProperty("line-dasharray", lineStyle.value);
    },
    $_getNumberFields(features) {
      let fields = [],
        reg = new RegExp("^[0-9]+$"),
        regFloat = new RegExp("^[.\\d]*$"),
        fieldsObj = {},
        nullFields = {};
      Object.keys(features[0].properties).forEach(function(key) {
        fieldsObj[key] = true;
        nullFields[key] = false;
      });
      for (let i = 0; i < features.length; i++) {
        Object.keys(features[i].properties).forEach(function(key) {
          if (!fieldsObj[key]) {
            return;
          }
          if (features[i].properties[key]) {
            nullFields[key] = true;
          }
          let value = features[i].properties[key];
          if (
            value &&
            !reg.test(value) &&
            !regFloat.test(value) &&
            fieldsObj[key]
          ) {
            fieldsObj[key] = false;
          }
        });
      }
      Object.keys(fieldsObj).forEach(function(key) {
        if (fieldsObj[key] && nullFields[key]) {
          fields.push(key);
        }
      });
      this.rangeFields = fields;
    },
    $_getFields(features) {
      if (this.themeType === "range" || this.themeType === "heatmap") {
        return this.rangeFields;
      } else {
        let fields = [];
        Object.keys(features[0].properties).forEach(function(key) {
          fields.push(key);
        });
        let newFields = [];
        for (let i = 0; i < fields.length; i++) {
          let allNull = true;
          for (let j = 0; j < features.length; j++) {
            if (features[j].properties[fields[i]]) {
              allNull = false;
              break;
            }
          }
          if (!allNull) {
            newFields.push(fields[i]);
          }
        }
        return newFields;
      }
    },
    $_getAllFields(feature) {
      let fields = [];
      Object.keys(feature.properties).forEach(function(key) {
        fields.push(key);
      });
      return fields;
    },
    $_getThemeFields(features) {
      let fields;
      if (features.geometry.type === "Point") {
        if (this.rangeFields.length === 0) {
          fields = [
            {
              key: "unique",
              value: "单值专题图"
            },
            {
              key: "symbol",
              value: "等级符号专题图"
            },
            {
              key: "heatmap",
              value: "热力专题图"
            }
          ];
        } else {
          fields = [
            {
              key: "unique",
              value: "单值专题图"
            },
            {
              key: "range",
              value: "分段专题图"
            },
            {
              key: "symbol",
              value: "等级符号专题图"
            },
            {
              key: "heatmap",
              value: "热力专题图"
            }
          ];
        }
      } else {
        if (this.rangeFields.length === 0) {
          fields = [
            {
              key: "unique",
              value: "单值专题图"
            }
          ];
        } else {
          fields = [
            {
              key: "unique",
              value: "单值专题图"
            },
            {
              key: "range",
              value: "分段专题图"
            }
          ];
        }
      }
      return fields;
    },
    $_changeOriginLayer(layerVector) {
      layerVector =
        layerVector ||
        window.originLayer[this.layerIdCopy][
          this.layerIdCopy + "_" + this.$_getThemeName()
        ];
      let vm = this;
      if (this.useOriginLayer) {
        Object.keys(layerVector.paint).forEach(function(key) {
          try {
            vm.map.setPaintProperty(
              vm.layerIdCopy,
              key,
              layerVector.paint[key]
            );
          } catch (e) {}
        });
      }
    },
    $_getLayerStyle(layerId) {
      let layer = {},
        vm = this;
      let originLayer = this.map.getLayer(layerId);
      if (!originLayer) return layer;
      Object.keys(originLayer).forEach(function(key) {
        switch (key) {
          case "paint":
            let paint = {};
            for (let pKey in originLayer.paint._values) {
              if (
                originLayer.paint._values.hasOwnProperty(pKey) &&
                originLayer.paint._values[pKey]
              ) {
                try {
                  paint[pKey] = vm.map.getPaintProperty(layerId, pKey);
                } catch (e) {}
              }
            }
            layer[key] = paint;
            break;
          case "layout":
            let layout = {};
            for (let lKey in originLayer.layout._values) {
              if (
                originLayer.layout._values.hasOwnProperty(lKey) &&
                originLayer.layout._values[lKey]
              ) {
                try {
                  layout[lKey] = vm.map.getLayoutProperty(layerId, lKey);
                } catch (e) {}
              }
            }
            layer[key] = layout;
            break;
          default:
            layer[key] = originLayer[key];
            break;
        }
      });
      return layer;
    },
    $_getNullFields(features) {
      let fields = [];
      for (let i = 0; i < features.length; i++) {
        Object.keys(features[i].properties).forEach(function(key) {
          if (
            (!features[i].properties[key] ||
              features[i].properties[key] === "" ||
              features[i].properties[key] === "undefined" ||
              features[i].properties[key] === "null") &&
            fields.indexOf(key) < 0
          ) {
            fields.push(key);
          }
        });
      }
      this.$emit("hasNullProperty", fields);
    },
    $_getFromSource(layerId, minzoom, maxzoom) {
      let features;
      if (
        !window.originLayer[this.layerIdCopy].hasOwnProperty(
          layerId + "_features"
        )
      ) {
        features = this.map.queryRenderedFeatures({ layers: [layerId] });
        if (features.length === 0) {
          this.$emit("createLayerFailed", {
            message: "专题图",
            description: "数据量为0!"
          });
          return;
        }
        window.originLayer[this.layerIdCopy][layerId + "_features"] = features;
        this.$_getNullFields(features);
      } else {
        features = window.originLayer[this.layerIdCopy][layerId + "_features"];
      }

      let originLayer = this.map.getLayer(layerId),
        nullProperties = true;
      this.source_vector_Id = originLayer.source;
      this.source_vector_layer_Id = originLayer.sourceLayer;
      let featureCollection = {
        features: [],
        type: "FeatureCollection"
      };
      for (let i = 0; i < features.length; i++) {
        if (nullProperties && JSON.stringify(features[i].properties) !== "{}") {
          nullProperties = false;
        }
        featureCollection.features.push({
          geometry: features[i].geometry,
          properties: features[i].properties,
          type: "Feature"
        });
      }
      if (!nullProperties) {
        this.$_initTheme(
          featureCollection,
          undefined,
          undefined,
          minzoom,
          maxzoom
        );
      } else {
        this.$emit("createLayerFailed", {
          message: "专题图",
          description: "数据中不包含任何属性数据!"
        });
        this.showPanelFlag = false;
      }
    },
    $_getFromGeoJSON() {
      let vm = this;
      FeatureService.get(
        this.baseUrl,
        function(result) {
          result = JSON.parse(result);
          vm.$_initTheme(result);
        },
        function(e) {
          console.log(e);
        }
      );
    },
    $_initTheme(geojson, startColor, endColor, minzoom, maxzoom) {
      this.extraLayer = [];
      this.upLayer = this.$_getUpLayer();
      if (this.$_editGeoJSON) {
        geojson = this.$_editGeoJSON(geojson);
      }
      this.allFields = this.$_getAllFields(geojson.features[0]);
      let vm = this;
      this.map.on("data", function(e) {
        if (vm.changeLayerProp) {
          let layer = {};
          if (vm.changeLayerId === vm.lineId) {
            layer = vm.lineLayer;
          } else if (vm.changeLayerId === this.textId) {
            layer = vm.textLayer;
          } else {
            layer = vm.$_getLayerStyle(vm.changeLayerId);
          }
          vm.$emit("layerChanged", layer);
          emitMapChangeStyle(vm.map.getStyle());
          vm.changeLayerProp = false;
        }
      });
      startColor = startColor || "#FFFFFF";
      endColor = endColor || "#FF0000";
      this.sourceVector.data = geojson;
      this.dataCopy = geojson;
      this.showVector = true;
      this.$_getNumberFields(geojson.features);
      this.fields = this.$_getFields(geojson.features);
      this.defaultValue =
        this.defaultValue === undefined ? this.fields[0] : this.defaultValue;
      this.selectKey = this.fields[0];
      this.themeTypeArrCopy = this.$_getThemeFields(geojson.features[0]);
      this.$emit("getThemeType", this.themeTypeArrCopy);
      this.dataSource = this.$_getData(geojson.features, this.selectKey);
      let colors = this.$_getColors(
        this.dataSource,
        startColor,
        endColor,
        this.selectKey
      );
      this.checkBoxArr = this.originColors.checkArr;
      if (this.$_initThemeCallBack) {
        if (!window.originLayer[this.layerIdCopy].panelProps) {
          window.originLayer[this.layerIdCopy].panelProps = {};
        }
        this.$_initThemeCallBack(
          geojson,
          colors,
          this.dataSource,
          minzoom,
          maxzoom
        );
      } else {
        throw new Error("请设置$_initTheme方法的回到函数！");
      }
      if (!window.originLayer[this.layerIdCopy].panelProps[this.themeType]) {
        window.originLayer[this.layerIdCopy].panelProps[this.themeType] = {
          selectValue: this.fields[0],
          gradientColor: "",
          panelProps: {},
          checkArr: []
        };
      }
      if (!window.originLayer[this.layerIdCopy].layerId) {
        window.originLayer[this.layerIdCopy].layerId = this.layerIdCopy;
      }
      if (!window.originLayer[this.layerIdCopy].themeType) {
        window.originLayer[this.layerIdCopy].themeType = this.themeType;
      }
      if (!window.originLayer[this.layerIdCopy].dataType) {
        window.originLayer[this.layerIdCopy].dataType = this.dataType;
      }
      if (
        !window.originLayer[this.layerIdCopy].hasOwnProperty(this.layerIdCopy)
      ) {
        let originStyle = this.$_getLayerStyle(this.layerIdCopy);
        let originLayer = {};
        Object.keys(originStyle).forEach(function(key) {
          if (originStyle.hasOwnProperty(key) && originStyle[key]) {
            originLayer[key] = originStyle[key];
          }
        });
        if (!window.originLayer[this.layerIdCopy][this.layerIdCopy]) {
          window.originLayer[this.layerIdCopy][this.layerIdCopy] = originLayer;
        }
        this.$_setLayerOrder();
        let paint =
          window.originLayer[this.layerIdCopy][this.layerIdCopy].paint;
        if (JSON.stringify(paint) === "{}") {
          switch (this.dataType) {
            case "fill":
              window.originLayer[this.layerIdCopy][this.layerIdCopy].paint = {
                "fill-color": "#000"
              };
              break;
            case "circle":
              window.originLayer[this.layerIdCopy][this.layerIdCopy].paint = {
                "circle-color": "#000"
              };
              break;
            case "line":
              window.originLayer[this.layerIdCopy][this.layerIdCopy].paint = {
                "line-color": "#000"
              };
              break;
          }
        }
        let layout =
          window.originLayer[this.layerIdCopy][this.layerIdCopy].layout;
        if (JSON.stringify(layout) === "{}") {
          window.originLayer[this.layerIdCopy][this.layerIdCopy].layout = {
            visibility: "visible"
          };
        }
      }
      // this.$_setOriginLayer(colors);
      // this.$_setLayOutProperty(
      //   "visibility",
      //   "none",
      //   this.layerIdCopy,
      //   window.originLayer[this.layerIdCopy][this.layerIdCopy]
      // );
      this.$_hideLayerByOpacity();
      if (this.themeType !== "symbol") {
        if (this.dataType === "fill") {
          if (
            !this.map.getLayer(this.layerIdCopy + "_" + this.$_getThemeName())
          ) {
            this.map.addLayer(
              window.originLayer[this.layerIdCopy][
                this.layerIdCopy + "_" + this.$_getThemeName()
              ],
              this.lineId
            );
          }
        } else {
          if (
            !this.map.getLayer(this.layerIdCopy + "_" + this.$_getThemeName())
          ) {
            this.map.addLayer(
              window.originLayer[this.layerIdCopy][
                this.layerIdCopy + "_" + this.$_getThemeName()
              ],
              this.textId
            );
          }
        }
      }
      if (!window._workspace._layerTypes[this.layerIdCopy]) {
        window._workspace._layerTypes[this.layerIdCopy] = this.themeType;
      }
      // this.$_changeOriginLayer();
      this.$_loadedLayer();
      // this.$nextTick(function () {
      //     this.$_changeOriginLayer();
      //     this.$_loadedLayer();
      // });
    },
    $_hideLayerByOpacity() {
      if (!window.originLayer[this.layerIdCopy].opacityBack) {
        window.originLayer[this.layerIdCopy].opacityBack = {};
      }
      switch (this.dataType) {
        case "fill":
          window.originLayer[this.layerIdCopy].opacityBack["fill-opacity"] =
            window.originLayer[this.layerIdCopy][this.layerIdCopy].paint[
              "fill-opacity"
            ] || 1;
          let outlineColor =
            window.originLayer[this.layerIdCopy][this.layerIdCopy].paint[
              "fill-outline-color"
            ];
          if (!outlineColor) {
            window.originLayer[this.layerIdCopy].opacityBack[
              "fill-outline-color"
            ] = "rgba(0, 0, 0, 1)";
          } else if (outlineColor instanceof String) {
            window.originLayer[this.layerIdCopy].opacityBack[
              "fill-outline-color"
            ] = outlineColor || "rgba(0, 0, 0, 1)";
          } else if (outlineColor.hasOwnProperty("stops")) {
            window.originLayer[this.layerIdCopy].opacityBack[
              "fill-outline-color"
            ] = {};
            window.originLayer[this.layerIdCopy].opacityBack[
              "fill-outline-color"
            ].stops = [];
            for (let i = 0; i < outlineColor.stops.length; i++) {
              window.originLayer[this.layerIdCopy].opacityBack[
                "fill-outline-color"
              ].stops.push(outlineColor.stops[i]);
            }
          }
          this.$_setPaintProperty(
            "fill-opacity",
            0,
            this.layerIdCopy,
            window.originLayer[this.layerIdCopy][this.layerIdCopy]
          );
          this.$_setPaintProperty(
            "fill-outline-color",
            "rgba(255, 255, 255, 0)",
            this.layerIdCopy,
            window.originLayer[this.layerIdCopy][this.layerIdCopy]
          );
          break;
        case "line":
          window.originLayer[this.layerIdCopy].opacityBack["line-opacity"] =
            window.originLayer[this.layerIdCopy][this.layerIdCopy].paint[
              "line-opacity"
            ] || 1;
          this.$_setPaintProperty(
            "line-opacity",
            0,
            this.layerIdCopy,
            window.originLayer[this.layerIdCopy][this.layerIdCopy]
          );
          break;
        case "circle":
          window.originLayer[this.layerIdCopy].opacityBack["circle-opacity"] =
            window.originLayer[this.layerIdCopy][this.layerIdCopy].paint[
              "circle-opacity"
            ] || 1;
          window.originLayer[this.layerIdCopy].opacityBack[
            "circle-stroke-opacity"
          ] =
            window.originLayer[this.layerIdCopy][this.layerIdCopy].paint[
              "circle-stroke-opacity"
            ] || 1;
          this.$_setPaintProperty(
            "circle-opacity",
            0,
            this.layerIdCopy,
            window.originLayer[this.layerIdCopy][this.layerIdCopy]
          );
          this.$_setPaintProperty(
            "circle-stroke-opacity",
            0,
            this.layerIdCopy,
            window.originLayer[this.layerIdCopy][this.layerIdCopy]
          );
          break;
      }
    },
    $_getAllLayerStyle() {
      let layers = [];
      if (this.dataType === "fill") {
        layers.push({
          action: "add",
          layer: this.lineLayer
        });
      }

      layers.push({
        action: "add",
        layer: this.textLayer
      });

      let replaceLayer = this.$_getLayerStyle(this.layerIdCopy);

      layers.push({
        action: "replace",
        originLayer: window.originLayer[this.layerIdCopy][this.layerIdCopy],
        replaceLayer: replaceLayer
      });

      return layers;
    },
    $_loadedLayer() {
      let layers = this.$_getAllLayerStyle();
      this.$emit("themeLoaded", layers);
    },
    $_getColors(dataSource, startColor, endColor, key, noColor, clearColor) {
      let colors;
      if (this.allOriginColors.hasOwnProperty(key) && !clearColor) {
        this.originColors = this.allOriginColors[key];
        colors = this.$_getColorsFromOrigin();
      } else {
        let originColors;
        if (this.$_getColorsCallBack) {
          originColors = this.$_getColorsCallBack(
            colors,
            dataSource,
            startColor,
            endColor,
            key
          );
        } else {
          throw new Error("请设置$_getColors方法的回到函数！");
        }

        if (!originColors) {
          throw new Error(
            "请返回一个originColor对象，该对象包含checkArr、colors以及colorList三个属性！"
          );
        }
        this.originColors = originColors;
        colors = originColors.colors;
        this.allOriginColors[key] = this.originColors;
      }
      if (!noColor) {
        if (this.panelProps.hasOwnProperty("colors")) {
          this.colors = this.panelProps.colors;
        } else {
          this.colors = this.originColors.colorList;
        }
      }
      return colors;
    },
    $_getData(features, value) {
      let datas = [],
        isSort = true;
      for (let i = 0; i < features.length; i++) {
        if (datas.indexOf(features[i].properties[value]) < 0) {
          if (
            features[i].properties[value] &&
            typeof features[i].properties[value] !== "number"
          ) {
            isSort = false;
          }
          if (
            (features[i].properties[value] ||
              typeof features[i].properties[value] === "number") &&
            features[i].properties[value] !== ""
          ) {
            datas.push(features[i].properties[value]);
          }
        }
      }
      if (isSort) {
        datas.sort(function(a, b) {
          return a - b;
        });
      }

      this.dataBack = datas;
      if (this.themeType === "range") {
        datas = this.$_editData(datas);
      }
      return datas;
    },
    $_removeLayer() {},
    $_selectChange(value) {
      if (value !== "") {
        let datas = this.$_getData(this.dataCopy.features, value);
        this.dataSource = datas;
        let colors = this.$_getColors(
          this.dataSource,
          this.startColor,
          this.endColor,
          value
        );
        this.checkBoxArr = this.originColors.checkArr;
        this.selectKey = value;
        window.originLayer[this.layerIdCopy].panelProps[
          window._workspace._layerTypes[this.layerIdCopy]
        ].panelProps.selectValue = value;
        if (this.checkBoxArr.indexOf(true) < 0) {
          this.showVector = false;
        } else {
          this.showVector = false;
          if (this.$_selectChangeCallBack) {
            this.$_selectChangeCallBack(colors);
          } else {
            throw new Error("请设置$_selectChange方法的回到函数！");
          }
          colors = this.$_editColor(colors);
          this.$_setPaintByType(colors, true);
          this.showVector = true;
        }
        this.changeLayerProp = true;
        this.changeLayerId = this.layerIdCopy;
      }
    },
    $_themeTypeChanged(key, value) {
      window._workspace._layerTypes[this.layerIdCopy] = key;
      this.$emit("themeTypeChanged", key, value);
    },
    $_removeIcon() {
      let themeId = this.layerIdCopy + "_" + this.$_getThemeName();
      let paintName;
      switch (this.dataType) {
        case "fill":
          paintName = "fill-pattern";
          break;
        case "line":
          paintName = "line-pattern";
          break;
      }
      if (window.originLayer[this.layerIdCopy][themeId].paint[paintName]) {
        if (this.map.getLayer(themeId)) {
          this.map.removeLayer(themeId);
          delete window.originLayer[this.layerIdCopy][themeId].paint[paintName];
          this.map.addLayer(window.originLayer[this.layerIdCopy][themeId]);
        }
      }
    },
    $_gradientChange(startColor, endColor, noEdit) {
      this.showVector = false;
      this.startColor = startColor;
      this.endColor = endColor;
      let colors = this.$_getColors(
        this.dataSource,
        startColor,
        endColor,
        this.selectKey,
        false,
        true
      );
      this.$_removeIcon();
      this.$_setPaintByType(colors, noEdit);
      this.showVector = true;
      this.changeLayerProp = true;
      this.changeLayerId = this.layerIdCopy;
    },
    $_setPaintByType(colors, noEdit) {
      if (!noEdit) {
        colors = this.$_editColor(colors);
      }
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty(
            "fill-color",
            colors,
            this.layerIdCopy + "_" + this.$_getThemeName(),
            window.originLayer[this.layerIdCopy][
              this.layerIdCopy + "_" + this.$_getThemeName()
            ]
          );
          break;
        case "circle":
          this.$_setPaintProperty(
            "circle-color",
            colors,
            this.layerIdCopy + "_" + this.$_getThemeName(),
            window.originLayer[this.layerIdCopy][
              this.layerIdCopy + "_" + this.$_getThemeName()
            ]
          );
          break;
        case "line":
          this.$_setPaintProperty(
            "line-color",
            colors,
            this.layerIdCopy + "_" + this.$_getThemeName(),
            window.originLayer[this.layerIdCopy][
              this.layerIdCopy + "_" + this.$_getThemeName()
            ]
          );
          break;
      }
    },
    $_lineColorChanged(e) {
      this.showVector = false;
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("fill-outline-color", e);
          break;
        case "circle":
          this.$_setPaintProperty("circle-outline-color", e);
          break;
      }
      this.showVector = true;
    },
    $_opacityChanged(e) {
      this.showVector = false;
      if (this.$_opacityChangedCallBack) {
        this.$_opacityChangedCallBack(e);
      } else {
        throw new Error("请设置$_opacityChanged方法的回到函数！");
      }
      this.showVector = true;
      this.changeLayerProp = true;
      this.changeLayerId = this.layerIdCopy;
    },
    $_oneColorChanged(index, color, colorsBack) {
      window.originLayer[this.layerIdCopy].panelProps[
        window._workspace._layerTypes[this.layerIdCopy]
      ].panelProps.colors = colorsBack;
      let colors = this.$_getColorsFromOrigin(index, color);
      this.isGradient = false;
      this.isSingle = false;
      if (this.$_oneColorChangedCallBack) {
        this.$_oneColorChangedCallBack(colors);
      } else {
        throw new Error("请设置$_oneColorChanged方法的回到函数！");
      }
    },
    /*
     * 修改单一属性的颜色的回调方法
     * @param colors 颜色信息
     * **/
    $_oneColorChangedCallBack(colors) {
      colors = this.$_editColor(colors);
      this.$_removeIcon();
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("fill-color", colors);
          break;
        case "circle":
          this.$_setPaintProperty("circle-color", colors);
          break;
        case "line":
          this.$_setPaintProperty("line-color", colors);
          break;
      }
    },
    $_editData(Source) {
      let dataSource = [];
      for (let i = 0; i < Source.length; i++) {
        if (Number(Source[i])) {
          dataSource.push(Number(Source[i]));
        }
      }
      dataSource = dataSource.sort(function(a, b) {
        return a - b;
      });
      let length = dataSource.length,
        newDataSource = [];
      let range = dataSource[length - 1] - dataSource[0];
      if (range === 0) {
        newDataSource.push(dataSource[0]);
        this.endData = dataSource[0] + 1;
        this.endDataCopy = this.endData;
        return newDataSource;
      } else {
        let rangeSect = range / this.rangeLevel;
        if (dataSource[0] < 0) {
          this.startData = dataSource[0] - 1;
        } else {
          let range = dataSource[1] - dataSource[0];
          this.startData = dataSource[0] - range;
        }
        this.startDataCopy = this.startData;
        for (let i = 0; i < this.rangeLevel; i++) {
          newDataSource.push(dataSource[0] + (i + 1) * rangeSect + 1);
        }
        this.endData = newDataSource[this.rangeLevel - 1] + rangeSect;
        this.endDataCopy = this.endData;
        return newDataSource;
      }
    },
    /*
     * 改变透明度的回调方法
     * @param opacity 透明度
     * **/
    $_opacityChangedCallBack(opacity) {
      switch (this.dataType) {
        case "fill":
          this.$_setPaintProperty("fill-opacity", opacity);
          break;
        case "circle":
          this.$_setPaintProperty("circle-opacity", opacity);
          break;
        case "line":
          this.$_setPaintProperty("line-opacity", opacity);
          break;
      }
    },
    $_editColor(colors) {
      let newColor;
      if (this.themeType === "range") {
        if (!window.originThemeData[this.layerIdCopy]) {
          window.originThemeData[this.layerIdCopy] = {};
        }
        if (
          window.originThemeData[this.layerIdCopy][
            this.themeType + "_" + this.selectKey
          ] &&
          !this.isGradient &&
          !this.isGradient &&
          !this.isSingle
        ) {
          newColor =
            window.originThemeData[this.layerIdCopy][
              this.themeType + "_" + this.selectKey
            ];
        } else {
          newColor = ["step", ["to-number", ["get", colors.property]]];
          let features =
              window.originLayer[this.layerIdCopy][
                this.layerIdCopy + "_features"
              ],
            index = 0,
            valueArr = [];
          for (let i = 0; i < features.length; i++) {
            let value = features[i].properties[this.selectKey];
            if (value && valueArr.indexOf(Number(value)) < 0) {
              valueArr.push(Number(value));
            }
          }
          valueArr = valueArr.sort(function(a, b) {
            return a - b;
          });
          for (let i = 0; i < colors.stops.length; i++) {
            for (let j = index; j < valueArr.length; j++) {
              let value = valueArr[j];
              if (Number(value) <= colors.stops[i][0]) {
                newColor.push(colors.stops[i][1]);
                newColor.push(Number(value));
                if (j === valueArr.length - 1) {
                  index = j + 1;
                }
              } else {
                index = j;
                break;
              }
            }
          }
          newColor.push("#ffffff");
        }
      } else {
        newColor = colors;
      }
      return newColor;
    },
    $_iconLoaded() {},
    $_clickIcon(icon) {
      let hasIcon = this.map.hasImage(icon),
        vm = this;
      let partten;
      switch (this.dataType) {
        case "fill":
          partten = "fill-pattern";
          break;
        case "line":
          partten = "line-pattern";
          break;
      }
      if (hasIcon) {
        vm.$_setPaintProperty(partten, icon);
      }
    },
    $_setPaintProperty(key, value, layerId, layerVector, extId) {
      let windowId = layerId
        ? layerId
        : this.layerIdCopy + "_" + this.$_getThemeName();
      layerId = layerId || windowId;
      layerVector =
        layerVector ||
        window.originLayer[this.layerIdCopy][
          this.layerIdCopy + "_" + this.$_getThemeName()
        ];
      if (layerVector && layerVector.hasOwnProperty("paint")) {
        layerVector.paint[key] = value;
        this.map.setPaintProperty(layerId, key, layerVector.paint[key]);
        let id = extId || this.layerIdCopy;
        if (id) {
          window.originLayer[id][windowId].paint[key] = value;
        }
        this.changeLayerProp = true;
        if (layerId.indexOf("专题图") > -1) {
          window.originLayer[this.layerIdCopy].panelProps[
            this.themeType
          ].panelProps[key] = value;
        }
        this.changeLayerId = layerId;
      }
    },
    $_getUpLayer() {
      let layers = this.map.getStyle().layers,
        upLayerId = undefined;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].id === this.layerIdCopy) {
          if (i + 1 < layers.length) {
            upLayerId = layers[i + 1].id;
          }
          break;
        }
      }
      return upLayerId;
    },
    $_getColorsFromOrigin(index, color, num) {
      let colors;
      let fillName = "";
      switch (this.dataType) {
        case "fill":
          fillName = "fill-color";
          break;
        case "circle":
          fillName = "circle-color";
          break;
        case "line":
          fillName = "line-color";
          break;
      }
      if (this.originColors.colors.hasOwnProperty("stops")) {
        colors = {};
        if (index !== null && index !== undefined) {
          if (color) {
            this.$set(this.originColors.colors.stops[index], 1, color);
          }
          if (num) {
            this.$set(this.originColors.colors.stops[index], 0, num);
          }
        }
        let stops = [];
        for (let i = 0; i < this.originColors.checkArr.length; i++) {
          if (this.originColors.checkArr[i]) {
            stops.push(this.originColors.colors.stops[i]);
          } else {
            stops.push([this.originColors.colors.stops[i][0], "#FFFFFF"]);
          }
        }
        colors.stops = stops;
        colors.property = this.originColors.colors.property;
      } else if (this.originColors.colors.indexOf("match") === 0) {
        if (index !== null && index !== undefined) {
          this.$set(this.originColors.colors, (index + 1) * 2 + 1, color);
        }
        this.$set(this.originColors.colors, (index + 1) * 2 + 1, color);
        colors = [];
        colors.push(this.originColors.colors[0], this.originColors.colors[1]);
        for (let i = 0; i < this.originColors.checkArr.length; i++) {
          if (this.originColors.checkArr[i]) {
            colors.push(
              this.originColors.colors[(i + 1) * 2],
              this.originColors.colors[(i + 1) * 2 + 1]
            );
          }
        }
        colors.push("#FFF");
      }
      return colors;
    },
    $_getThemeName(themeType) {
      themeType = themeType || this.themeType;
      let theme = "";
      switch (themeType) {
        case "unique":
          theme = "单值专题图";
          break;
        case "range":
          theme = "分段专题图";
          break;
        case "symbol":
          theme = "等级符号专题图";
          break;
        case "heatmap":
          theme = "热力专题图";
          break;
      }
      return theme;
    },
    $_addLineLayer(minzoom, maxzoom) {
      switch (this.themeType) {
        case "unique":
          this.lineId = this.layerIdCopy + "_单值专题图_线";
          break;
        case "range":
          this.lineId = this.layerIdCopy + "_分段专题图_线";
          break;
      }
      let layer = this.map.getLayer(this.lineId);
      if (!layer) {
        this.extraLayer.push({
          key: "lineLayer",
          value: this.lineId
        });
        window.originLayer[this.layerIdCopy][
          this.layerIdCopy + "_" + this.$_getThemeName() + "_extraLayer"
        ] = this.extraLayer;
        this.lineLayer = {
          id: this.lineId,
          source: this.source_vector_Id,
          type: "line",
          paint: {
            "line-color": this.outerLineColor,
            "line-opacity": this.outerLineOpacity, //透明度
            "line-width": this.lineWidth
          },
          layout: {},
          minzoom: minzoom,
          maxzoom: maxzoom
        };
        if (this.source_vector_layer_Id) {
          this.lineLayer["source-layer"] = this.source_vector_layer_Id;
        }
        window.originLayer[this.layerIdCopy][this.lineId] = this.lineLayer;
        this.map.addLayer(this.lineLayer, this.upLayer);
        emitMapAddLayer({ layer: this.lineLayer });
        emitMapChangeStyle(this.map.getStyle());
      } else {
        this.lineLayer = this.$_getLayerStyle(this.lineId);
      }
    },
    $_addTextLayer(minzoom, maxzoom) {
      if (!this.textFont) {
        this.textFont = this.textFonts[0];
      }
      switch (this.themeType) {
        case "unique":
          this.textId = this.layerIdCopy + "_单值专题图_注记";
          break;
        case "range":
          this.textId = this.layerIdCopy + "_分段专题图_注记";
          break;
      }
      let layer = this.map.getLayer(this.textId);
      if (!layer) {
        this.extraLayer.push({
          key: "textLayer",
          value: this.textId
        });
        window.originLayer[this.layerIdCopy][
          this.layerIdCopy + "_" + this.$_getThemeName() + "_extraLayer"
        ] = this.extraLayer;
        this.textLayer = {
          id: this.textId,
          source: this.source_vector_Id,
          type: "symbol",
          layout: {
            "text-field": "",
            "text-size": this.fontSize,
            "text-letter-spacing": this.textPadding,
            "text-offset": this.offsetText,
            "text-font": [this.textFont, this.textFont],
            "text-rotate": this.textRotation
          },
          paint: {
            "text-color": this.fontColor,
            "text-halo-color": this.haloColor,
            "text-halo-width": this.haloWidth
          },
          minzoom: minzoom,
          maxzoom: maxzoom
        };
        if (this.source_vector_layer_Id) {
          this.textLayer["source-layer"] = this.source_vector_layer_Id;
        }
        window.originLayer[this.layerIdCopy][this.textId] = this.textLayer;
        this.map.addLayer(this.textLayer, this.upLayer);
        emitMapAddLayer({ layer: this.textLayer });
        emitMapChangeStyle(this.map.getStyle());
      }
    }
  }
};
