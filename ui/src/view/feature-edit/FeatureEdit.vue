<template>
  <div>
    <mapgis-ui-tabs v-model="activeKey">
      <mapgis-ui-tab-pane key="simpleRenderer" tab="统一专题图">
        <mapgis-ui-feature-edit-form
          ref="simpleRenderer"
          :featureItem.sync="featureItem"
          :featureType="featureType"
          :featureStyle="featureStyle"
          :showSeletion="true"
          :fieldInfo="fieldInfo"
          @get-renderer="getRenderer"
        />
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="uniqueValueRenderer" tab="一值一类专题图">
        <mapgis-ui-feature-edit-unique-value-form
          ref="uniqueValueRenderer"
          :fieldInfo="fieldInfo"
          :featureType="featureType"
          :featureStyle="featureStyle"
          @feature-edit-change="featureEditChange"
          @get-renderer="getRenderer"
        />
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane key="classBreakRenderer" tab="分段专题图">
        <mapgis-ui-feature-edit-class-break-form
          ref="classBreakRenderer"
          :fieldInfo="fieldInfo"
          :featureType="featureType"
          :featureStyle="featureStyle"
          @feature-edit-change="featureEditChange"
          @get-renderer="getRenderer"
        />
      </mapgis-ui-tab-pane>
    </mapgis-ui-tabs>
    <mapgis-ui-button type="primary" @click="handleOk">确认</mapgis-ui-button>
  </div>
</template>

<script>
import MapgisUiFeatureEditForm from "./simpleRenderer/FeatureEditForm.vue";
import MapgisUiFeatureEditClassBreakForm from "./classBreakRenderer/ClassBreakFeatureEditForm.vue";
import MapgisUiFeatureEditUniqueValueForm from "./uniqueValueRenderer/UniqueValueRenderer.vue";

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
    featureStyle: {
      type: String
    }
  },
  components: {
    MapgisUiFeatureEditForm,
    MapgisUiFeatureEditClassBreakForm,
    MapgisUiFeatureEditUniqueValueForm
  },
  data() {
    return {
      // 深拷贝一份然后传下去
      featureItem: {
        // color: "rgba(0, 0, 0, 1)",
        // font: "宋体",
        // xoffset: 0,
        // yoffset: 0,
        // horizontalAlignment: "center",
        // verticalAlignment: "baseline",
        // lineHeight: 1,
        // text: ""
      },
      activeKey: "simpleRenderer"
    };
  },
  methods: {
    handleOk() {
      this.$refs[this.activeKey].formatRender();
    },
    featureEditChange(type, params, callback) {
      this.$emit("feature-edit-change", type, params, callback);
    },
    getRenderer(renderer) {
      this.$emit("get-renderer", renderer);
    }
  }
};
</script>
