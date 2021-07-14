<template>
  <mapgis-ui-card
    v-show="visible"
    :style="outStyle"
    title="设置显示样式"
    class="mapgis-mvt-editor-card"
  >
    <a slot="extra" @click="handleClose">x</a>
    <mapgis-ui-radio-group v-model="action" button-style="solid">
      <mapgis-ui-radio-button class="action-type" value="single">
        单级别配置
      </mapgis-ui-radio-button>
      <mapgis-ui-radio-button class="action-type" value="multi">
        分级别配置
      </mapgis-ui-radio-button>
    </mapgis-ui-radio-group>
    <single-action
      v-if="action === 'single'"
      :layerid="layerid"
      @edit-change="onEditChange"
    />
    <multi-action v-else :layerid="layerid" />
  </mapgis-ui-card>
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
    outStyle: {
      type: Object,
      default: () => {
        return {
          left: "10px",
          top: "10px"
        };
      }
    },
    layerid: {
      type: String
    },
    visible: {
      type: Boolean
    }
  },
  model: {
    prop: "visible",
    event: "change"
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
    },
    handleClose() {
      // this.show = false;
      this.$emit("change", false);
    }
  }
};
</script>

<style lang="css">
.mapgis-mvt-editor-card {
  width: 200px;
  position: absolute;
  z-index: 1000;
  height: calc(100vh - 200px);
  overflow-y: scroll;
}
.mapgis-mvt-editor-card .action-type {
  width: 120px;
  text-align: center;
}
</style>
