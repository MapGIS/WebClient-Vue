<template>
  <autonomous-roaming
    v-if="isWidgetOpen"
    class="mapgis-3d-autonomous-roaming"
    :isRunning="isRunning"
    @load="load"
    @unload="unload"
  >
    <div slot class="footer">
      <mapgis-ui-collapse expand-icon-position="right">
        <mapgis-ui-collapse-panel key="1" header="查看操作说明">
          <img :src="imgSrc" style="width: 100%" />
        </mapgis-ui-collapse-panel>
      </mapgis-ui-collapse>

      <div class="footer-operate">
        <mapgis-ui-button
          type="primary"
          size="small"
          @click="fullScreenRoaming(true)"
          >全屏漫游</mapgis-ui-button
        >
        <mapgis-ui-button
          type="primary"
          size="small"
          @click="fullScreenRoaming(false)"
          >非全屏漫游</mapgis-ui-button
        >
        <mapgis-ui-button type="primary" size="small" @click="stopRoaming"
          >停止漫游</mapgis-ui-button
        >
      </div>
    </div>
  </autonomous-roaming>
</template>

<script>
import AutonomousRoaming from "./components/AutonomousRoaming.vue";
export default {
  name: "AutonomousRoamingSetting",
  components: {
    AutonomousRoaming
  },
  props: {
    publicPath: {
      type: String
    },
    isWidgetOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isRunning: false
    };
  },
  computed: {
    imgSrc() {
      return `${this.publicPath}autonomousRoaming/autonomous-roaming-keyboard-demo.png`;
    }
  },
  mounted() {},

  methods: {
    load(roamingTool) {
      this.roamingTool = roamingTool;
    },
    fullScreenRoaming(isFullScreen) {
      this.isRunning = true;
      this.roamingTool.enableMouseLook = isFullScreen;
      this.roamingTool.start();
    },
    stopRoaming() {
      this.isRunning = false;
      this.roamingTool.stop();
    },
    unload(roamingTool) {
      this.stopRoaming();
      this.roamingTool = roamingTool;
    }
  }
};
</script>

<style lang="scss" scoped>
.mapgis-3d-autonomous-roaming {
  .footer {
    .footer-operate {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
<style lang="scss">
.mapgis-3d-autonomous-roaming {
  .footer {
    .mapgis-ui-collapse {
      border: none;
      .mapgis-ui-collapse-item {
        border-bottom: none;
      }
    }
    .mapgis-ui-collapse-header {
      text-align: right;
    }
    .mapgis-ui-collapse-content-box {
      padding: 5px;
    }
    .mapgis-ui-collapse-content {
      border-top: none;
    }
  }
}
</style>
