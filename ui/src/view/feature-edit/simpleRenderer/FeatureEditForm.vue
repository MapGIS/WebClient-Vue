<template>
  <mapgis-ui-setting-form layout="vertical" size="default">
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
      featureStyleCopy: undefined,
      featureCopy: undefined,
      pointFeatureStyleList: [
        { name: "常规点图形", value: "simpleMarkerSymbol" },
        { name: "简单图文标注", value: "textSymbol" },
        { name: "简单图片标签", value: "pictureMarkerSymbol" }
      ]
    };
  },
  watch: {
    featureStyle() {
      if (this.featureStyle) {
        this.featureStyleCopy = this.featureStyle;
      }
    }
  },
  computed: {
    featureItemCopy: {
      get() {
        return this.featureItem;
      },
      set(val) {
        this.$emit("update:featureItem", val);
      }
    }
  },
  methods: {
    handleChange() {
      switch (this.featureStyleCopy) {
        case "simpleMarkerSymbol":
          this.$emit("update:featureItem", defaultSimpleMarkerStyle);
          break;
        case "textSymbol":
          this.$emit("update:featureItem", defaultTextStyle);
          break;
        case "pictureMarkerSymbol":
          this.$emit("update:featureItem", defaultPictureMarkerStyle);
          break;
        default:
          break;
      }
    },
    formatRender() {
      let symbol;
      switch (this.featureStyleCopy) {
        case "simpleMarkerSymbol": {
          symbol = this.getSimpleMarkerSymbol(this.featureItemCopy);

          break;
        }
        case "textSymbol": {
          symbol = this.getTextSymbol(this.featureItemCopy);
          break;
        }
        case "pictureMarkerSymbol": {
          symbol = this.getPictureMarkerSymbol(this.featureItemCopy);
          break;
        }
        case "simpleLineSymbol": {
          const simpleLineSymbol = this.getSimpleLineSymbol(
            this.featureItemCopy
          );
          break;
        }
        case "simpleFillSymbol": {
          const simpleFillSymbol = this.getSimpleFillSymbol(
            this.featureItemCopy
          );
          break;
        }
        default:
          break;
      }
      const simpleRenderer = new SimpleRenderer({
        symbol
      });
      const simpleRendererJson = simpleRenderer.toJSON();
      this.$emit("get-renderer", simpleRendererJson);
    }
  }
};
</script>
