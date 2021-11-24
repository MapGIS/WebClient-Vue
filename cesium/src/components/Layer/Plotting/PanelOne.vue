<template>
  <div>
    <div class="mapgis-plotting-tool-panel" :class="{plottingLayOff: layOffTool, plottingLayOut: layOutTool}">
      <div v-show="showTool" class="mapgis-plotting-toolbar">
        <div class="mapgis-plotting-tool" v-for="(tool, index) in tools" :key="index">
          <img @click="$_chooseTool(tool)"
               class="mapgis-plotting-tool-icon"
               :class="{mapgisPlottingActive: activeTool === tool}"
               :src="imgs[tool + 'Image']"
               :title="toolTips[index]">
          <img class="mapgis-plotting-tool-split" :src="imgs.splitImg">
        </div>
      </div>
      <div v-show="!showTool" class="mapgis-plotting-tool">
        <img @click="$_chooseTool('point')"
             class="mapgis-plotting-tool-icon"
             :src="layOffImg">
      </div>
    </div>
    <div class="mapgis-plotting-tool-lay" :class="{plottingLayOff: layOffTool, plottingLayOut: layOutTool}">
      <img v-show="switchIcon" @click="$_layOff" class="mapgis-plotting-tool-lay-off" :src="imgs.layOff">
      <img v-show="!switchIcon" @click="$_layOut" class="mapgis-plotting-tool-lay-off" :src="imgs.layOut">
    </div>
  </div>
</template>

<script>
import * as imgs from "./base64Source"

export default {
  name: "panelOne",
  data() {
    return {
      imgs: imgs,
      layOffTool: false,
      layOutTool: false,
      showTool: true,
      switchIcon: true,
      layOffImg: imgs.pointImage,
      activeTool: undefined,
      tools: ["point", "marker", "text", "line", "curve", "polygon", "rectangle", "circle",
        "cube", "polygonCube", "cuboid", "cylinder", "cone", "ellipsoid", "model"],
      toolTips: ["点", "标签", "文字", "直线", "曲线", "多边形", "矩形", "圆",
        "正方体", "立体多边形", "长方体", "圆柱体", "圆锥体", "球体", "模型"]
    }
  },
  methods: {
    $_layOff() {
      this.layOffTool = true;
      this.layOutTool = false;
      let vm = this;
      setTimeout(function () {
        vm.switchIcon = false;
        vm.showTool = false;
      }, 1500);
    },
    $_layOut() {
      this.layOffTool = false;
      this.layOutTool = true;
      this.showTool = true;
      let vm = this;
      setTimeout(function () {
        vm.switchIcon = true;
      }, 1500);
    },
    $_chooseTool(tool) {
      this.activeTool = tool;
      this.layOffImg = this.imgs[tool + "Image"];
      this.$emit("chooseTool", tool);
    }
  }
}
</script>

<style scoped>
.mapgis-plotting-tool-lay {
  position: absolute;
  z-index: 1;
  left: 11px;
  top: 10px;
  width: 795px;
}

.mapgis-plotting-tool-panel {
  position: absolute;
  z-index: 1;
  left: 11px;
  top: 10px;
  width: 795px;
  height: 48px;
  background: white;
  border-radius: 10px;
  -webkit-box-shadow: #666 0 0 10px;
  -moz-box-shadow: #666 0 0 10px;
  box-shadow: #666 0 0 10px;
  padding: 8px 0;
  overflow: hidden;
}

.mapgis-plotting-tool-panel > div {
  height: 32px;
  line-height: 30px;
  position: absolute;
}

.mapgis-plotting-toolbar {
  left: 0;
  width: 797px;
}

.mapgis-plotting-toolbar > div {
  display: inline-block;
}

.mapgis-plotting-tool {
  width: 53px;
  height: 100%;
  cursor: pointer;
}

.mapgis-plotting-tool-icon {
  padding: 3px;
}

.mapgis-plotting-tool-icon:hover {
  box-shadow: .05em .1em .2em rgba(0, 0, 0, .6) inset;
  border-color: rgba(0, 0, 0, .3);
  background: #ecebeb;
  border-radius: 2px;
}

.mapgisPlottingActive {
  box-shadow: .05em .1em .2em rgba(0, 0, 0, .6) inset;
  border-color: rgba(0, 0, 0, .3);
  background: #ecebeb;
  border-radius: 2px;
}

.mapgis-plotting-tool-split {
  float: right;
}

.mapgis-plotting-tool-lay-off {
  position: absolute;
  right: -24px;
  top: 12px;
  cursor: pointer;
}

.plottingLayOff {
  animation: layOff 1.5s;
  -webkit-animation: layOff 1.5s;
  animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
}

@keyframes layOff {
  from {
    width: 795px;
  }
  to {
    width: 50px;
  }
}

@-webkit-keyframes layOff {
  from {
    width: 795px;
  }
  to {
    width: 50px;
  }
}

.plottingLayOut {
  animation: layOut 1.5s;
  -webkit-animation: layOut 1.5s;
  animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
}

@keyframes layOut {
  from {
    width: 50px;
  }
  to {
    width: 795px;
  }
}

@-webkit-keyframes layOut {
  from {
    width: 50px;
  }
  to {
    width: 795px;
  }
}
</style>