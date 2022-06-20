import PopupMixin from "../../Layer/Mixin/PopupVirtual";

export default {
  mixins: [PopupMixin],
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    layerId: {
      type: String,
      default: "theme"
    },
    autoReset: {
      type: Boolean,
      default: true,
    },
    enableClick: {
      type: Boolean,
      default: false
    },
    enableHover: {
      type: Boolean,
      default: false
    },
    enableQuery: {
      type: Boolean,
      default: false
    },
    highlightSymbol: {
      type: Object,
      default: () => {
        return {}
      }
    },
    queryInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    enableQuery: {
      handler: function (value) {
        if (value) {
          this.queryPrimitive();
        } else {
          this.clearQuery();
        }
      },
    },
    visible: {
      handler: function(value) {
        this.changeVisible();
      }
    }
  },
  methods: {
    // 查询primitive
    queryPrimitive() {
      let {viewer, vueCesium, vueKey, vueIndex, queryInfo, renderer} = this;
      let {field, type, minValue, maxValue, value} = queryInfo;
      let queryField = field ? field : renderer.field;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      let primitivesArr = find.source[0]._primitivesArr;
      switch (type) {
        case 'range':
          this.queryPrimitiveByRange(primitivesArr, queryField, minValue, maxValue);
          break;
        case 'value':
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
          if (queryGeometryInstance.extendAttr[queryField] > minValue && queryGeometryInstance.extendAttr[queryField] <= maxValue) {
            let id = queryGeometryInstance.id;
            let attributes = queryPrimitive.getGeometryInstanceAttributes(id);
            let beforeAttr = {color: attributes.color, show: attributes.show};
            let tempQueryData = {queryPrimitive, id, attributes, beforeAttr};
            this.tempQueryDataArr.push(tempQueryData);
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
            let beforeAttr = {color: attributes.color, show: attributes.show};
            let tempQueryData = {queryPrimitive, id, attributes, beforeAttr};
            this.tempQueryDataArr.push(tempQueryData);
          }
        }
      }
      this.setQuery();
    },
    // 设置查询样式
    setQuery() {
      let {minValue, maxValue, symbol} = this.queryInfo;
      let symbolLayers = JSON.parse(JSON.stringify(symbol.symbolLayers));
      this.transformObject(symbolLayers);
      for (let i = 0; i < this.tempQueryDataArr.length; i++) {
        let {queryPrimitive, id, attributes} = this.tempQueryDataArr[i];
        attributes.color = new Cesium.ColorGeometryInstanceAttribute.toValue(symbolLayers.material.color);
        attributes.show = new Cesium.ShowGeometryInstanceAttribute.toValue(true);
      }
    },
    // 清除查询样式
    clearQuery() {
      for (let i = 0; i < this.tempQueryDataArr.length; i++) {
        let {queryPrimitive, id, attributes, beforeAttr} = this.tempQueryDataArr[i];
        attributes.color = beforeAttr.color;
        attributes.show = beforeAttr.show;
      }
      this.tempQueryDataArr = [];
    },
    // 改变专题图层可见性
    changeVisible() {
      let {viewer, vueCesium, vueKey, vueIndex, visible} = this;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      let primitivesArr = find.source[0]._primitivesArr;
      for (let i = 0; i < primitivesArr.length; i++) {
        let primitive = primitivesArr[i].primitive;
        let outlinePrimitive = primitivesArr[i].outlinePrimitive;
        for (let j = 0; j < primitive.geometryInstances.length; j++) {
            let id = primitive.geometryInstances[j].id;
            let attributes = primitive.getGeometryInstanceAttributes(id);
            attributes.show = new Cesium.ShowGeometryInstanceAttribute.toValue(visible);
            if (outlinePrimitive) {
              let idOutline = outlinePrimitive.geometryInstances[j].id;
              let attributesOutline = outlinePrimitive.getGeometryInstanceAttributes(idOutline);
              attributesOutline.show = new Cesium.ShowGeometryInstanceAttribute.toValue(visible);
            }
        }
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
      let symbolLayers = JSON.parse(JSON.stringify(this.highlightSymbol.symbolLayers));
      this.transformObject(symbolLayers);
      let {entities, iClickFeatures, movement, pickedFeature} = payload;
      let {id, primitive} = pickedFeature;
      var geometryInstances = primitive.geometryInstances;
      for (let i = 0; i < geometryInstances.length; i++) {
        if (geometryInstances[i].id === id) {
          let pickExtendAttr = geometryInstances[i].extendAttr;
          let attributes = primitive.getGeometryInstanceAttributes(id);
          let beforeAttr = {color: attributes.color, show: attributes.show};
          this.tempHighlightData = {pickedFeature, attributes: beforeAttr, pickExtendAttr};
          attributes.color = new Cesium.ColorGeometryInstanceAttribute.toValue(symbolLayers.material.color);
          attributes.show = new Cesium.ShowGeometryInstanceAttribute.toValue(true);
        };
      };
    },
    // 清除click、hover高亮样式
    clearHighlight() {
      if (this.tempHighlightData) {
        let {pickedFeature, attributes} = this.tempHighlightData;
        let {id, primitive} = pickedFeature;
        let highlightAttr = primitive.getGeometryInstanceAttributes(id);
        highlightAttr.color = attributes.color;
        highlightAttr.show = attributes.show;
      }
      if (!this.enableQuery && this.tempQueryDataArr.length == 0) {
        this.clearQuery();
      }
    },
  }
};
