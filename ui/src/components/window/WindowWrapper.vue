<template>
  <div class="mapgis-ui-map-panel-virtual">
    <mapgis-ui-window-card
      ref="mapPanelContainer"
      v-show="visible"
      @mousedown.native.capture="onClick"
    >
      <slot :z-index="state === this.activeState ? 2 : 1" />
    </mapgis-ui-window-card>
  </div>
</template>

<script>
import { uuid } from "./utils/uuid";
import PanelManager from "./utils/panel-manager";
import WidgetManager from "./utils/widget-manager";
import WidgetState from "./utils/widget-state";

export default {
  // 组件名称，统一以"Mp"开头
  name: "mapgis-ui-window-wrapper",
  props: {
    visible: { type: Boolean, default: true }
  },
  data() {
    return { id: uuid(), state: "", activeState: WidgetState.ACTIVE };
  },
  watch: {
    visible: {
      handler(newState, oldState) {
        if (newState) {
          WidgetManager.getInstance().activateWidget(this);
        }
      },
      immediate: true
    }
  },
  mounted() {
    PanelManager.getInstance().addPanel({
      id: this.id,
      content: this.$refs.mapPanelContainer.$el
    });
    WidgetManager.getInstance().openWidget(this);
  },
  beforeDestroy() {
    PanelManager.getInstance().removePanel({
      id: this.id,
      content: this.$refs.mapPanelContainer.$el
    });
  },
  methods: {
    onClick() {
      WidgetManager.getInstance().activateWidget(this);
    }
  }
};
</script>
