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
  },
  methods: {
    // 查询primitive
    queryPrimitive() {
      let {queryInfo, renderer} = this;
      let {field, type} = queryInfo;
      let queryField = field ? field : renderer.field;
      switch (type) {
        case 'class-breaks':
          this.queryPrimitiveByRange(queryField);
          break;
        case 'unique-value':
          this.queryPrimitiveByValue(queryField);
          break;
        default:
          this.queryPrimitiveByValue(queryField);
          break;
      }
    },
    // 通过数字范围查询primitive
    queryPrimitiveByRange(queryField) {
      let {viewer, vueCesium, vueKey, vueIndex, queryInfo} = this;
      let find = vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      let {minValue, maxValue, symbol} = queryInfo;
      let symbolLayers = JSON.parse(JSON.stringify(symbol.symbolLayers));
      this.transformObject(symbolLayers);
      let primitivesArr = find.source[0]._primitivesArr;
      for (let i = 0; i < primitivesArr.length; i++) {
        let queryPrimitive = primitivesArr[i].primitive;
        for (let j = 0; j < queryPrimitive.geometryInstances.length; j++) {
            let queryGeometryInstance = queryPrimitive.geometryInstances[j];
            if (queryGeometryInstance.extendAttr[queryField] > minValue && queryGeometryInstance.extendAttr[queryField] <= maxValue) {
                let id = queryGeometryInstance.id;
                let attributes = queryPrimitive.getGeometryInstanceAttributes(id);
                attributes.color = new Cesium.ColorGeometryInstanceAttribute.toValue(symbolLayers.material.color);
                attributes.show = new Cesium.ShowGeometryInstanceAttribute.toValue(true);
            }
        }
      }
    },
  }
};
