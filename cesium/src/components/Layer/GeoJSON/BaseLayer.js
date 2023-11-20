import Popup from "../../UI/Popup/Popup.vue";
import PopupContent from "../../UI/Geojson/Popup";

import PopupMixin from "../Mixin/PopupVirtual";

export default {
  mixins: [PopupMixin],
  inject: ["Cesium", "vueCesium", "viewer"],
  components: {
    Popup,
    PopupContent,
  },
  props: {
    vueKey: {
      type: String,
      default: "default",
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      },
    },
    layerId: {
      type: String,
      default: "theme",
    },
    autoReset: {
      type: Boolean,
      default: true,
    },
    enableClick: {
      type: Boolean,
      default: false,
    },
    enableHover: {
      type: Boolean,
      default: false,
    },
    enableQuery: {
      type: Boolean,
      default: false,
    },
    highlightSymbol: {
      type: Object,
      default: () => {
        return {};
      },
    },
    queryInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      gemotryAttribute: undefined,
      popVisiable: false,
      forceRender: true,
      visiblePop: true,
      checkTypeResult: 0,
      otherQueryDataArr: [],
    };
  },
  watch: {
    gemotryAttribute: {
      handler: function (value) {
        if (value) {
          this.popVisiable = true;
        }
      },
    },
    enableQuery: {
      handler: function (value) {
        let layer = this.findDataSource(this.layerType);
        if (value) {
          this.queryPrimitive();
        } else {
          this.clearQuery();
        }
      },
    },
    queryInfo: {
      handler(value) {
        if (this.enableQuery) {
          this.clearQuery();
          this.queryPrimitive();
        }
      },
      deep: true,
    },
    // visible: {
    //   handler: function(value) {
    //     this.changeVisible();
    //   }
    // }
  },
  methods: {
    // 获取vueManager中的source
    findDataSource(layerType) {
      let { vueKey, vueIndex } = this;
      layerType = layerType ? layerType : this.layerType;
      let find;
      switch (layerType) {
        case "feature":
          find = vueCesium.IgsFeatureManager.findSource(vueKey, vueIndex);
          break;
        case "geojson":
          find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
          break;
      }
      return find;
    },
    // 查询primitive
    queryPrimitive() {
      let { viewer, vueCesium, vueKey, vueIndex, queryInfo, renderer } = this;
      if (queryInfo == undefined) {
        return;
      }
      let { field, type, minValue, maxValue, value } = queryInfo;
      let queryField = field ? field : renderer.field;
      // let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      let find = this.findDataSource();
      let primitivesArr = find.source[0]._primitivesArr;
      switch (type) {
        case "range":
          this.queryPrimitiveByRange(
            primitivesArr,
            queryField,
            minValue,
            maxValue
          );
          break;
        case "value":
          this.queryPrimitiveByValue(primitivesArr, queryField, value);
          break;
        default:
          this.queryPrimitiveByValue(primitivesArr, queryField, value);
          break;
      }
    },
    // 通过数字范围查询primitive
    queryPrimitiveByRange(primitivesArr, queryField, minValue, maxValue) {
      for (let i = 0; i < primitivesArr.length; i++) {
        let queryPrimitive = primitivesArr[i].primitive;
        for (let j = 0; j < queryPrimitive.geometryInstances.length; j++) {
          let queryGeometryInstance = queryPrimitive.geometryInstances[j];
          let id = queryGeometryInstance.id;
          let attributes = queryPrimitive.getGeometryInstanceAttributes(id);
          let beforeAttr = { color: attributes.color, show: attributes.show };
          let tempQueryData = { queryPrimitive, id, attributes, beforeAttr };
          if (
            queryGeometryInstance.extendAttr[queryField] >= minValue &&
            queryGeometryInstance.extendAttr[queryField] < maxValue
          ) {
            this.tempQueryDataArr.push(tempQueryData);
          } else {
            this.otherQueryDataArr.push(tempQueryData);
          }
        }
      }
      this.setQuery();
    },
    // 通过数字/字符串值查询primitive
    queryPrimitiveByValue(primitivesArr, queryField, value) {
      for (let i = 0; i < primitivesArr.length; i++) {
        let queryPrimitive = primitivesArr[i].primitive;
        for (let j = 0; j < queryPrimitive.geometryInstances.length; j++) {
          let queryGeometryInstance = queryPrimitive.geometryInstances[j];
          if (queryGeometryInstance.extendAttr[queryField] == value) {
            let id = queryGeometryInstance.id;
            let attributes = queryPrimitive.getGeometryInstanceAttributes(id);
            let beforeAttr = { color: attributes.color, show: attributes.show };
            let tempQueryData = { queryPrimitive, id, attributes, beforeAttr };
            this.tempQueryDataArr.push(tempQueryData);
          }
        }
      }
      this.setQuery();
    },
    // 设置查询样式
    setQuery() {
      let queryDataArr = this.tempQueryDataArr;
      // let queryDataArr = this.otherQueryDataArr;
      let { minValue, maxValue, symbol, show } = this.queryInfo;
      if (symbol) {
        let symbolLayers = JSON.parse(JSON.stringify(symbol.symbolLayers));
        this.transformObject(symbolLayers);
        for (let i = 0; i < queryDataArr.length; i++) {
          let { queryPrimitive, id, attributes } = queryDataArr[i];
          attributes.color = new Cesium.ColorGeometryInstanceAttribute.toValue(
            symbolLayers.material.color
          );
        }
      } else {
        for (let i = 0; i < queryDataArr.length; i++) {
          let { queryPrimitive, id, attributes } = queryDataArr[i];
          attributes.show = new Cesium.ShowGeometryInstanceAttribute.toValue(
            show
          );
        }
      }
    },
    // 清除查询样式
    clearQuery() {
      for (let i = 0; i < this.tempQueryDataArr.length; i++) {
        let { queryPrimitive, id, attributes, beforeAttr } =
          this.tempQueryDataArr[i];
        attributes.color = beforeAttr.color;
        attributes.show = beforeAttr.show;
      }
      this.tempQueryDataArr = [];
      this.otherQueryDataArr = [];
    },
    // 改变专题图层可见性
    changeVisible() {
      let { viewer, vueCesium, vueKey, vueIndex, visible } = this;
      // let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      let find = this.findDataSource();
      let primitivesArr = find.source[0]._primitivesArr;
      for (let i = 0; i < primitivesArr.length; i++) {
        let primitive = primitivesArr[i].primitive;
        let outlinePrimitive = primitivesArr[i].outlinePrimitive;
        for (let j = 0; j < primitive.geometryInstances.length; j++) {
          let id = primitive.geometryInstances[j].id;
          let attributes = primitive.getGeometryInstanceAttributes(id);
          attributes.show = new Cesium.ShowGeometryInstanceAttribute.toValue(
            visible
          );
          if (outlinePrimitive) {
            let idOutline = outlinePrimitive.geometryInstances[j].id;
            let attributesOutline =
              outlinePrimitive.getGeometryInstanceAttributes(idOutline);
            attributesOutline.show =
              new Cesium.ShowGeometryInstanceAttribute.toValue(visible);
          }
        }
      }
    },
    // 检查专题要素类型
    checkType() {
      if (JSON.stringify(this.renderer) === "{}") return;
      let symbol = this.renderer.symbol || this.renderer.defaultSymbol;
      if (!symbol) return;
      let symbolLayers = symbol.symbolLayers;
      if (!symbolLayers.resource) {
        this.checkTypeResult = 0;
        return;
      }
      if (symbolLayers.resource.herf) {
        this.checkTypeResult = 1;
      } else if ((symbolLayers.resource.primitive = "billboard")) {
        this.checkTypeResult = 2;
      } else {
        this.checkTypeResult = 0;
      }
    },
    // 鼠标点击高亮
    clickHighlight(payload) {
      this.highlight(payload);
    },
    // 鼠标悬浮高亮
    hoverHighlight(payload) {
      this.highlight(payload);
    },
    // 高亮公共逻辑，若对点击、高亮有其它需求，可以在clickHighlight、hoverHighlight中扩展
    highlight(payload) {
      this.clearHighlight();
      let symbolLayers = JSON.parse(
        JSON.stringify(this.highlightSymbol.symbolLayers)
      );
      this.transformObject(symbolLayers);
      let { entities, iClickFeatures, movement, pickedFeature } = payload;
      let { id, primitive } = pickedFeature;

      if (this.checkTypeResult == 1 || this.checkTypeResult == 2) {
        this.gemotryAttribute = [
          {
            layer: { id: "矢量图层" },
            properties: primitive.extendAttr,
          },
        ];
        let oldPickedFeature = { color: pickedFeature.primitive._color };
        primitive._color = symbolLayers.material.color;
        this.tempHighlightData = { pickedFeature, oldPickedFeature };
        return;
      }
      var geometryInstances = primitive.geometryInstances;
      for (let i = 0; i < geometryInstances.length; i++) {
        if (geometryInstances[i].id === id) {
          let pickExtendAttr = geometryInstances[i].extendAttr;
          this.gemotryAttribute = [
            {
              layer: { id: "矢量图层" },
              properties: pickExtendAttr,
            },
          ];
          let attributes = primitive.getGeometryInstanceAttributes(id);
          let beforeAttr = { color: attributes.color, show: attributes.show };
          this.tempHighlightData = {
            pickedFeature,
            attributes: beforeAttr,
            pickExtendAttr,
          };
          attributes.color = new Cesium.ColorGeometryInstanceAttribute.toValue(
            symbolLayers.material.color
          );
          attributes.show = new Cesium.ShowGeometryInstanceAttribute.toValue(
            true
          );
        }
      }
    },
    // 清除click、hover高亮样式
    clearHighlight() {
      if (!this.tempHighlightData) {
        return;
      }
      switch (this.checkTypeResult) {
        case 0: {
          let { pickedFeature, attributes } = this.tempHighlightData;
          let { id, primitive } = pickedFeature;
          let highlightAttr = primitive.getGeometryInstanceAttributes(id);
          highlightAttr.color = attributes.color;
          highlightAttr.show = attributes.show;
          break;
        }
        case 1: {
          let { pickedFeature, oldPickedFeature } = this.tempHighlightData;
          pickedFeature.primitive._color = oldPickedFeature.color;
          break;
        }
        case 2: {
          let { pickedFeature, oldPickedFeature } = this.tempHighlightData;
          pickedFeature.primitive._color = oldPickedFeature.color;
          break;
        }
      }
      if (
        !this.enableQuery &&
        this.tempQueryDataArr &&
        this.tempQueryDataArr.length == 0
      ) {
        this.clearQuery();
      }
    },
  },
};
