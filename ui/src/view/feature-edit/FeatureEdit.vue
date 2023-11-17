<template>
  <div>
    <mapgis-ui-tabs v-model="activeKey" @change="activeKeyChange">
      <mapgis-ui-tab-pane key="simple" tab="统一专题图">
        <mapgis-ui-feature-edit-form
          v-if="activeKey == 'simple'"
          ref="simple"
          :featureItem.sync="featureItem"
          :featureType="featureType"
          :featureStyle.sync="featureStyleCopy"
          :showSeletion="true"
          :fieldInfo="fieldInfo"
          @get-renderer="getRenderer"
        />
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="unique-value" tab="一值一类专题图">
        <mapgis-ui-feature-edit-unique-value-form
          v-if="activeKey == 'unique-value'"
          ref="unique-value"
          :fieldInfo="fieldInfo"
          :featureType="featureType"
          :featureStyle.sync="featureStyleCopy"
          :featureItemArr="featureItem"
          @feature-edit-change="featureEditChange"
          @get-renderer="getRenderer"
        />
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="class-breaks" tab="分段专题图">
        <mapgis-ui-feature-edit-class-break-form
          v-if="activeKey == 'class-breaks'"
          ref="class-breaks"
          :fieldInfo="fieldInfo"
          :featureType="featureType"
          :featureStyle.sync="featureStyleCopy"
          :featureItemArr="featureItem"
          @feature-edit-change="featureEditChange"
          @get-renderer="getRenderer"
        />
      </mapgis-ui-tab-pane>
    </mapgis-ui-tabs>
    <mapgis-ui-row type="flex" justify="end">
      <mapgis-ui-button @click="handleReset">重置</mapgis-ui-button>
      <mapgis-ui-button type="primary" @click="handleOk">确认</mapgis-ui-button>
    </mapgis-ui-row>
  </div>
</template>

<script>
import MapgisUiFeatureEditForm from "./simpleRenderer/FeatureEditForm.vue";
import MapgisUiFeatureEditClassBreakForm from "./classBreakRenderer/ClassBreakFeatureEditForm.vue";
import MapgisUiFeatureEditUniqueValueForm from "./uniqueValueRenderer/UniqueValueRenderer.vue";
import getSymbolMixin from "./mixin/GetSymbol";
import { uuid } from "../../util/common/util";
import {
  defaultSimpleLineStyle,
  defaultSimpleFillStyle
} from "./simpleRenderer/defaultStyle";

export default {
  name: "mapgis-ui-feature-edit",
  props: {
    // 属性表数组
    fieldInfo: {
      type: Array,
      default: () => []
    },
    // 要素类型：点、线、区
    featureType: {
      type: String
    },
    // 专题图symbol类型
    featureStyle: {
      type: String,
      default: ""
    },
    // 专题图类型
    rendererType: {
      type: String,
      default: "simple"
    },
    // 图层要素
    layerFeatureStyle: {
      type: [Object, Array],
      default: () => ({})
    }
  },
  mixins: [getSymbolMixin],
  components: {
    MapgisUiFeatureEditForm,
    MapgisUiFeatureEditClassBreakForm,
    MapgisUiFeatureEditUniqueValueForm
  },
  data() {
    return {
      // 深拷贝一份然后传下去
      featureItem: {},
      activeKey: this.rendererType,
      featureStyleCopy: ""
    };
  },
  watch: {
    layerFeatureStyle: {
      immediate: true,
      handler() {
        if (JSON.stringify(this.layerFeatureStyle) === "{}") {
          if (this.featureType === "Lin") {
            this.featureItem = defaultSimpleLineStyle;
          } else if (this.featureType === "Reg") {
            this.featureItem = defaultSimpleFillStyle;
          } else {
            this.featureItem = this.formatFeature(this.layerFeatureStyle);
          }
        } else {
          this.featureItem = this.formatFeature(this.layerFeatureStyle);
        }
      }
    },
    featureStyle: {
      immediate: true,
      handler() {
        this.featureStyleCopy = this.featureStyle;
      }
    }
  },
  methods: {
    activeKeyChange() {
      if (
        JSON.stringify(this.layerFeatureStyle) !== "{}" &&
        JSON.stringify(this.layerFeatureStyle) !== "[]" &&
        this.activeKey === this.rendererType
      ) {
        this.featureStyleCopy = this.featureStyle;
        this.featureItem = this.formatFeature(this.layerFeatureStyle);
      } else {
        if (this.activeKey == "simple") {
          if (this.featureType === "Lin") {
            this.featureItem = defaultSimpleLineStyle;
          } else if (this.featureType === "Reg") {
            this.featureItem = defaultSimpleFillStyle;
          } else {
            this.featureItem = {};
          }
        } else {
          this.featureItem = [];
        }
        this.featureStyleCopy = "";
      }
    },
    formatFeature(layerFeatureItem) {
      if (
        Object.prototype.toString.call(layerFeatureItem) == "[object Object]"
      ) {
        return this.formatSimpleFeature(layerFeatureItem);
      } else if (
        Object.prototype.toString.call(layerFeatureItem) == "[object Array]"
      ) {
        return this.formatArrayFeature(layerFeatureItem);
      }
    },
    formatArrayFeature(layerFeatureItem) {
      if (layerFeatureItem.length === 0) return [];
      let formatMethod;
      switch (this.featureType) {
        case "Pnt":
          if (this.featureStyle == "simple-marker") {
            formatMethod = this.formatSimpleMarker;
          } else if (this.featureStyle == "text") {
            formatMethod = this.formatText;
          } else if (this.featureStyle == "picture-marker") {
            formatMethod = this.formatPictureMarker;
          }
          break;
        case "Lin": {
          formatMethod = this.formatSimpleLine;
          break;
        }
        case "Reg": {
          formatMethod = this.formatSimpleFill;
          break;
        }
        default:
          break;
      }
      return JSON.parse(
        JSON.stringify(
          layerFeatureItem.map(item => {
            if (this.rendererType == "unique-value") {
              return {
                sample: formatMethod(item.sample),
                class: item.class,
                key: uuid()
              };
            } else if (this.rendererType == "class-breaks") {
              return {
                sample: formatMethod(item.sample),
                min: item.min,
                max: item.max,
                key: uuid()
              };
            }
          })
        )
      );
    },
    formatSimpleFeature(layerFeatureItem) {
      if (Object.keys(layerFeatureItem).length == 0) return {};
      let feature;
      switch (this.featureType) {
        case "Pnt":
          if (this.featureStyle == "simple-marker") {
            feature = this.formatSimpleMarker(layerFeatureItem);
          } else if (this.featureStyle == "text") {
            feature = this.formatText(layerFeatureItem);
          } else if (this.featureStyle == "picture-marker") {
            feature = this.formatPictureMarker(layerFeatureItem);
          }
          break;
        case "Lin": {
          feature = this.formatSimpleLine(layerFeatureItem);
          break;
        }
        case "Reg": {
          feature = this.formatSimpleFill(layerFeatureItem);
          break;
        }
        default:
          break;
      }
      return JSON.parse(JSON.stringify(feature));
    },
    handleOk() {
      this.$refs[this.activeKey].formatRender();
    },
    featureEditChange(type, params, callback) {
      this.$emit("feature-edit-change", type, params, callback);
    },
    handleReset() {
      this.getRenderer({}, "");
    },
    getRenderer(renderer, symbolType) {
      this.$emit("get-renderer", renderer, symbolType);
    }
  }
};
</script>
