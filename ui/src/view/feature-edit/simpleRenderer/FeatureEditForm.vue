<template>
  <mapgis-ui-setting-form
    layout="vertical"
    size="default"
    style="max-height:400px;overflow-y:auto"
  >
    <mapgis-ui-form-item
      label="要素样式"
      v-if="featureType == 'Pnt' && showSeletion"
    >
      <mapgis-ui-select v-model="featureStyleCopy" @change="handleChange">
        <mapgis-ui-select-option
          :value="item.value"
          v-for="(item, index) in pointFeatureStyleList"
          :key="index"
          >{{ item.name }}</mapgis-ui-select-option
        >
      </mapgis-ui-select>
    </mapgis-ui-form-item>
    <mapgis-ui-point-style-edit
      :featureStyleCopy="featureStyleCopy"
      :featureItemCopy.sync="featureItemCopy"
      :fieldInfo="fieldInfo"
      :parentClass="parentClass"
      v-if="featureType == 'Pnt'"
    />
    <mapgis-ui-line-style-edit
      :featureStyleCopy="featureStyleCopy"
      :featureItemCopy.sync="featureItemCopy"
      :featureType="featureType"
      v-if="featureType == 'Lin'"
    />
    <mapgis-ui-fill-style-edit
      :featureStyleCopy="featureStyleCopy"
      :featureItemCopy.sync="featureItemCopy"
      :featureType="featureType"
      v-if="featureType == 'Reg'"
    />
  </mapgis-ui-setting-form>
</template>

<script>
import { SimpleRenderer } from "@mapgis/webclient-common";
import MapgisUiPointStyleEdit from "./PointStyleEdit";
import MapgisUiLineStyleEdit from "./LineStyleEdit.vue";
import MapgisUiFillStyleEdit from "./FillStyleEdit.vue";
import {
  defaultSimpleMarkerStyle,
  defaultTextStyle,
  defaultPictureMarkerStyle,
  defaultSimpleLineStyle,
  defaultSimpleFillStyle
} from "./defaultStyle";
import getSymbolMixin from "../mixin/GetSymbol.js";

export default {
  name: "mapgis-ui-feature-edit-form",
  mixins: [getSymbolMixin],
  props: {
    featureItem: {
      type: Object
    },
    featureType: {
      type: String
    },
    featureStyle: {
      type: String
    },
    showSeletion: {
      type: Boolean
    },
    fieldInfo: {
      type: Array
    },
    parentClass: {
      type: String
    }
  },
  components: {
    MapgisUiPointStyleEdit,
    MapgisUiLineStyleEdit,
    MapgisUiFillStyleEdit
  },
  data() {
    return {
      featureCopy: undefined,
      pointFeatureStyleList: [
        { name: "常规点图形", value: "simple-marker" },
        { name: "简单图文标注", value: "text" },
        { name: "简单图片标签", value: "picture-marker" }
      ]
    };
  },
  computed: {
    featureItemCopy: {
      get() {
        return this.featureItem;
      },
      set(val) {
        this.$emit("update:featureItem", val);
      }
    },

    featureStyleCopy: {
      get() {
        return this.featureStyle;
      },
      set(val) {
        this.$emit("update:featureStyle", val);
      }
    }
  },
  methods: {
    handleChange(activeKey) {
      switch (activeKey) {
        case "simple-marker":
          this.$emit("update:featureItem", defaultSimpleMarkerStyle);
          break;
        case "text":
          this.$emit("update:featureItem", defaultTextStyle);
          break;
        case "picture-marker":
          this.$emit("update:featureItem", defaultPictureMarkerStyle);
          break;
        default:
          break;
      }
    },
    formatRender() {
      let symbol;
      switch (this.featureType) {
        case "Pnt":
          if (this.featureStyleCopy == "simple-marker") {
            symbol = this.getSimpleMarkerSymbol(this.featureItemCopy);
          } else if (this.featureStyleCopy == "text") {
            symbol = this.getTextSymbol(this.featureItemCopy);
          } else if (this.featureStyleCopy == "picture-marker") {
            symbol = this.getPictureMarkerSymbol(this.featureItemCopy);
          }
          break;
        case "Lin": {
          symbol = this.getSimpleLineSymbol(this.featureItemCopy);
          this.featureStyleCopy = "simple-line";
          break;
        }
        case "Reg": {
          symbol = this.getSimpleFillSymbol(this.featureItemCopy);
          this.featureStyleCopy = "simple-fill";
          break;
        }
        default:
          break;
      }
      if (!symbol) return;
      const simpleRenderer = new SimpleRenderer({
        symbol
      });
      const simpleRendererJson = simpleRenderer.toJSON();
      this.$emit("get-renderer", simpleRendererJson, this.featureStyleCopy);
    }
  }
};
</script>
