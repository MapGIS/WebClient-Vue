<template>
  <div class="plot-panel">
    <mapgis-ui-plot-symbol
      :data="symbolData"
      @click="clickIcon"
      v-if="symbolData"
    ></mapgis-ui-plot-symbol>
    <mapgis-ui-plot-attribute v-if="showAttribute"></mapgis-ui-plot-attribute>
  </div>
</template>

<script>
import { SymbolManager, DrawTool } from "@mapgis/webclient-es6-service";
export default {
  name: "mapgis-3d-plot",
  props: {
    layer: {
      type: Object,
      required: true
    },
    symbolUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showAttribute: false,
      symbolData: undefined,
      drawTool: undefined,
      // 符号管理器
      manager: undefined,
      handler: undefined
    };
  },
  mounted() {
    this.mount();
  },
  methods: {
    mount() {
      // const vm = this;
      this.drawTool = new DrawTool(this.layer);
      this.getSymbol();
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      this.handler.setInputAction((ev)=>{
        // vm.drawTool.stopDraw();
        var primitive = viewer.scene.pick(ev.position);
        console.log('primitive', primitive);
        
      },Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    },
    getSymbol() {
      const vm = this;
      // console.log("symbolUrl", this.symbolUrl);
      this.manager = new SymbolManager(this.symbolUrl);
      this.manager.getSymbols().then(function(symbols) {
        viewer.scene.globe.depthTestAgainstTerrain = false;
        let symbolData = [];
        let symbolCls;
        symbols.children.forEach(item => {
          if (item.children[0].children) {
            symbolCls = {
              title: item.name,
              children: []
            };
            let clsChildren = {};
            item.children.forEach(icon => {
              icon.children.forEach(i => {
                let type = icon.name ? icon.name : i.type;
                clsChildren[type] = clsChildren[type] || [];
                clsChildren[type].push(i);
              });
            });
            Object.keys(clsChildren).forEach(iconT => {
              symbolCls.children.push({
                type: iconT,
                icon: clsChildren[iconT]
              });
            });
          } else {
            symbolCls = {
              children: [
                {
                  type: item.name,
                  icon: item.children
                }
              ]
            };
          }
          symbolData.push(symbolCls);
        });
        vm.symbolData = symbolData;
      });
    },
    clickIcon(data) {
      let leaf = this.manager.getLeafByID(data.icon.id);
      console.log("leaf", data.icon.id);
      this.drawTool.stopDraw();
      this.drawTool.drawPlot(leaf);
    }
  }
};
</script>

<style scoped>
.plot-panel {
  position: absolute;
  left: 0px;
  top: 0px;
  background: #fff;
  /* width: 320px; */
  /* max-height: 400px; */
  /* padding: 0 16px; */
  /* border: 1px solid #fff; */
  /* border-radius: 2px; */
  /* box-shadow: 1px 1px 6px #f0f0f0; */
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
}
</style>
