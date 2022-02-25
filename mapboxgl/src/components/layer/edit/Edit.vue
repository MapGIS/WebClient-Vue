<template>
  <div class="mapgis-mvt-editor">
    <mapgis-ui-radio-group v-model="action" button-style="solid">
      <mapgis-ui-radio-button class="action-type" value="single">
        单级别配置
      </mapgis-ui-radio-button>
      <mapgis-ui-radio-button disabled class="action-type" value="multi">
        分级别配置
      </mapgis-ui-radio-button>
    </mapgis-ui-radio-group>
    <single-action
      v-if="action === 'single'"
      :layerid="layerid"
      @edit-change="onEditChange"
    />
    <multi-action v-else :layerid="layerid" />
  </div>
</template>

<script>
import EditMixin from "./EditMixin";

import SingleAction from "./action/SingleAction.vue";
import MultiAction from "./action/MultiAction.vue";

export default {
  name: "mapgis-mvt-editor",
  components: { SingleAction, MultiAction },
  inject: ["map", "mapbox"],
  mixins: [EditMixin],
  props: {
    layerid: {
      type: String,
    },
  },
  data() {
    return {
      action: "single",
      show: true,
    };
  },
  methods: {
    onEditChange(event) {
      this.$_emitEvent(event);
    },
  },
};
</script>

<style lang="css">
.mapgis-mvt-editor .action-type {
  width: 120px;
  text-align: center;
}
</style>
