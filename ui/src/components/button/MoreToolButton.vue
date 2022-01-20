<template>
  <div class="mapgis-ui-more-tool-button-container">
    <mapgis-ui-base64-icon
      @click="$_click"
      class="mapgis-ui-more-tool-button-icon" height="20px"
      type="more"/>
    <div v-show="showTool"
         class="mapgis-ui-more-tool-button"
         :class="{'mapgis-ui-more-tool-button-top:': top,'mapgis-ui-more-tool-button-bottom': !top}"
         @mouseleave="$_hideTool"
    >
      <div @click="$_clickTool(tool.event)" :key="index" v-for="(tool, index) in dataSource"
           :style="{width: width}"
           class="mapgis-ui-more-tool-button-row">
        <mapgis-ui-svg-icon class="mapgis-ui-more-tool-button-row-icon" :iconStyle="editStyle" :type="tool.icon"/>
        <span style="padding-right: 10px;">{{ tool.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-more-tool-button",
  props: {
    dataSource: {
      type: Array
    },
    top: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: "110px"
    },
  },
  data() {
    return {
      showTool: false,
      editStyle: {
        color: "#7A8DA0",
        width: "20px",
        height: "20px"
      }
    }
  },
  methods: {
    $_click() {
      this.showTool = !this.showTool;
    },
    $_clickTool(type) {
      this.$emit("click", type);
    },
    $_hideTool() {
      this.showTool = false;
    }
  }
}
</script>

<style scoped>
.mapgis-ui-more-tool-button-container {
  position: relative;
}

.mapgis-ui-more-tool-button-icon {

}

.mapgis-ui-more-tool-button-row {
  width: 100%;
  height: 40px;
  line-height: 24px;
  font-size: 14px;
  padding-left: 40px;
  position: relative;
  padding-top: 10px;
}

.mapgis-ui-more-tool-button-row:hover {
  color: #0081E2;
}

.mapgis-ui-more-tool-button-row-icon {
  position: absolute;
  top: 0;
  left: 10px;
}

.mapgis-ui-more-tool-button {
  position: absolute;
  right: 7px;
  z-index: 100000;
  width: auto;
  height: auto;
  border-radius: 3px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.mapgis-ui-more-tool-button-top {
  top: 40px;
}

.mapgis-ui-more-tool-button-bottom {
  bottom: 0;
}
</style>