<template>
  <div class="mapgis-mvt-editor">
    <!-- <mapgis-ui-radio-group v-model="action" button-style="solid">
      <mapgis-ui-radio-button class="action-type" value="single">
        单级别配置
      </mapgis-ui-radio-button>
      <mapgis-ui-radio-button disabled class="action-type" value="multi">
        分级别配置
      </mapgis-ui-radio-button>
    </mapgis-ui-radio-group> -->
    <!-- <mapgis-ui-tabs v-model="action">
      <mapgis-ui-tab-pane key="single" tab="单级别配置">
        <single-action :layerid="layerid" @edit-change="onEditChange" />
      </mapgis-ui-tab-pane>
      <mapgis-ui-tab-pane disabled key="multi" tab="分级别配置">
        <multi-action :layerid="layerid" />
      </mapgis-ui-tab-pane>
    </mapgis-ui-tabs> -->
    <!-- 暂时不支持分级别配置 -->
    <single-action :layerid="layerid" @edit-change="onEditChange" />
  </div>
</template>

<script>
import EditMixin from "./EditMixin";

import SingleAction from "./action/SingleAction.vue";
// import MultiAction from "./action/MultiAction.vue";

export default {
  name: "mapgis-mvt-editor",
  // components: { SingleAction, MultiAction },
  components: { SingleAction },
  inject: ["map", "mapbox"],
  mixins: [EditMixin],
  props: {
    layerid: {
      type: String
    }
  },
  data() {
    return {
      action: "single",
      show: true
    };
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    }
  }
};
</script>

<style lang="css">
.mapgis-mvt-editor .action-type {
  width: 120px;
  text-align: center;
}
</style>
