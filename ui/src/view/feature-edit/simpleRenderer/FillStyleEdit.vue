<template>
  <div v-if="featureType === 'Reg'">
    <mapgis-ui-form-item label="填充颜色">
      <mapgis-ui-sketch-color-picker
        :color.sync="simpleFillStyleCopy.color"
        :disableAlpha="false"
      ></mapgis-ui-sketch-color-picker>
    </mapgis-ui-form-item>
    <mapgis-ui-form-item label="填充样式">
      <mapgis-ui-select v-model="simpleFillStyleCopy.style">
        <mapgis-ui-select-option
          v-for="(item, index) in fillStyleList"
          :value="item.value"
          :key="index"
          >{{ item.value }}</mapgis-ui-select-option
        >
      </mapgis-ui-select>
    </mapgis-ui-form-item>
    <mapgis-ui-collapse :bordered="false">
      <mapgis-ui-collapse-panel key="1" header="外边线样式" :showArrow="false">
        <mapgis-ui-line-style-edit
          :show="true"
          :featureItemCopy.sync="simpleFillStyleCopy.simpleLineStyle"
        />
      </mapgis-ui-collapse-panel>
    </mapgis-ui-collapse>
  </div>
</template>

<script>
import MapgisUiLineStyleEdit from "./LineStyleEdit.vue";

export default {
  name: "mapgis-ui-fill-style-edit",
  components: {
    MapgisUiLineStyleEdit
  },
  props: {
    featureStyleCopy: {
      type: String,
      default: ""
    },
    featureItemCopy: {
      type: Object,
      default: () => {}
    },
    featureType: {
      type: String
    }
  },
  data() {
    return {
      fillStyleList: [
        { name: "", value: "backward-diagonal" },
        { name: "", value: "cross" },
        { name: "", value: "diagonal-cross" },
        { name: "", value: "forward-diagonal" },
        { name: "", value: "horizontal" },
        { name: "", value: "none" },
        { name: "", value: "solid" },
        { name: "", value: "vertical" }
      ]
    };
  },
  computed: {
    simpleFillStyleCopy: {
      get() {
        return this.featureItemCopy;
      },
      set(val) {
        this.$emit("update:featureItemCopy", val);
      }
    }
  }
};
</script>

<style scoped>
::v-deep.mapgis-ui-collapse-item.mapgis-ui-collapse-no-arrow {
  border: none !important;
}
</style>
