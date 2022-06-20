<template>
  <div class="mapgis-3d-plot">
    <slot
      name="symbol"
      :data="symbolData"
      :click="clickIcon"
      :search="searchIcon"
      :baseUrl="baseUrl"
      :format="true"
      v-if="symbolData"
    >
      <mapgis-ui-plot-symbol
        :data="symbolData"
        @click="clickIcon"
        @search="searchIcon"
        v-if="symbolData"
        class="mapgis-3d-plot-panel"
      ></mapgis-ui-plot-symbol>
    </slot>
    <mapgis-ui-plot-attribute
      :class="['plot-panel-attribute', 'mapgis-3d-plot-panel']"
      v-if="showStylePanel"
      v-model="styleData"
      @changeComponentStyle="changeStyle"
      @changeStyle="changeStyle"
    ></mapgis-ui-plot-attribute>
  </div>
</template>

<script>
import { SymbolManager, DrawTool } from "@mapgis/webclient-es6-service";

export default {
  name: "mapgis-3d-plot",
  inject: ["viewer", "Cesium", "vueCesium"],
  props: {
    vueKey: {
      type: String
    },
    vueIndex: {
      type: [Number, String]
    },
    symbolUrl: {
      type: String,
      required: true
    },
    fontUrl: {
      type: String,
      default: ''
    },
    baseUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      symbolData: undefined,
      showStylePanel: false,
      styleData: undefined,
      handler: undefined,
      // 符号
      symbol: undefined,
      symbols: undefined,
      // 图元
      plot: undefined,
      // 记录是否完成绘制
      isDraw: false,
      searchResult: undefined
    };
  },
  mounted() {
    this.mount();
  },
  methods: {
    getLayer() {
      let vueCesium = this.vueCesium || window.vueCesium;
      if(!vueCesium)return;
      let layerManager = vueCesium.PlotLayerManager.findSource(
          this.vueKey,
          this.vueIndex
      );
      return layerManager && layerManager.source;
    },
    getLayers() {
      let PlotLayerGroupManager = window.vueCesium.PlotLayerGroupManager.findSource(
          this.vueKey,
          this.vueIndex
      );
      return PlotLayerGroupManager && PlotLayerGroupManager.source;
    },
    getDrawTool() {
      let DrawToolManager = window.vueCesium.DrawToolManager.findSource(
          this.vueKey,
          this.vueIndex
      );
      return DrawToolManager && DrawToolManager.source;
    },
    getSymbolManager() {
      let PlotSymbolManager = window.vueCesium.PlotSymbolManager.findSource(
          this.vueKey,
          this.vueIndex
      );
      return PlotSymbolManager && PlotSymbolManager.source;
    },
    toJSON() {
      let layer = this.getLayer();
      return layer && layer.toJSON();
    },
    setPick() {
      const vm = this;
      let layer = this.getLayer();
       layer.pickPlot = async function(plot) {
          vm.isDraw = true;
          vm.plot = plot;
          // console.log('plot',plot);
          vm.symbol = vm.symbol || plot._elem._symbol;
          let json = plot.getStyle();
          vm.symbol.style = vm.symbol.style || json;
          vm.parseStyleJson(json, plot._elem._symbol._src);
        };
        layer.pickEventType = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
    },
    mount() {
      const vm = this;
      let layer = this.getLayer();
      if(layer) {
        let drawTool = this.getDrawTool();
        if(!drawTool) {
          drawTool = new DrawTool(layer, {
            addedPlot: function(plot) {
              vm.isDraw = true;
              vm.plot = plot;
            }
          });
          window.vueCesium.DrawToolManager.addSource(this.vueKey, this.vueIndex, drawTool);
        }
        this.getSymbol();

        layer.pickPlot = function(plot) {
          vm.isDraw = true;
          vm.plot = plot;
          // console.log('plot',plot);
          vm.symbol = vm.symbol || plot._elem._symbol;
          let json = plot.getStyle();
          vm.symbol.style = vm.symbol.style || json;
          vm.parseStyleJson(json, plot._elem._symbol._src);
        };
        layer.pickEventType = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
      }
      this.$emit("loaded", this);
    },
    getSymbol() {
      const vm = this;
      // console.log("symbolUrl", this.symbolUrl);
      let manager = this.getSymbolManager();
      if(!manager) {
        manager = new SymbolManager(this.symbolUrl,{
          fontURL: vm.fontUrl,
          baseUrl: vm.baseUrl
        });
        window.vueCesium.PlotSymbolManager.addSource(this.vueKey, this.vueIndex, manager);
      }

      manager.getSymbols().then(function(symbols) {
        // console.log("symbols", symbols);
        vm.symbols = [];
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
              vm.symbols = [...vm.symbols, ...clsChildren[iconT]];
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
            vm.symbols = [...vm.symbols, ...item.children];
          }
          symbolData.push(symbolCls);
        });
        vm.symbolData = symbolData;
      });
    },
    async clickIcon(data) {
      const vm = this;
      this.isDraw = false;
      let manager = this.getSymbolManager();
      if(!manager) return;
      this.symbol = manager.getLeafByID(data.icon.id);
      this.symbol.getElement().then(function(res) {
        vm.symbol.style = res.getStyleJSON();
        let json = res.getStyleJSON();
        vm.parseStyleJson(json, data.icon.src);
      });

      let drawTool = this.getDrawTool();
      if(drawTool) {
        drawTool.stopDraw();
        drawTool.drawPlot(vm.symbol);
      }
    },
    parseStyleJson(json, svgUrl) {
      // console.log("json", json);
      for (var node in json.nodeStyles) {
        if (node.indexOf("tspan") === -1) {
          json.nodeStyles[node]["strokeColor"] =
            json.nodeStyles[node].strokeStyle;
          delete json.nodeStyles[node].strokeStyle;
        }
      }
      json["symbolUrl"] = svgUrl;
      json = this.remove2dAttributes(json);
      this.showStylePanel = true;
      this.styleData = json;
      // console.log("json", json);
    },
    remove2dAttributes(json) {
      delete json.compareLine;
      delete json.compareLineWidth;
      delete json.compareLineColor;

      for (var node in json.nodeStyles) {
        if (node.indexOf("tspan") !== -1) {
          delete json.nodeStyles[node].fontStyle;
          delete json.nodeStyles[node].fontVariant;
          delete json.nodeStyles[node].fontWeight;
          delete json.nodeStyles[node].strokeStyle;
          delete json.nodeStyles[node].lineWidth;
        }

        delete json.nodeStyles[node].lineCap;
        delete json.nodeStyles[node].lineJoin;
        delete json.nodeStyles[node].miterLimit;
      }
      return json;
    },
    changeStyle(e) {
      if (e.key == "strokeColor") {
        e.key = "strokeStyle";
      }
      if (e.name && this.isDraw) {
        return this.plot.setStyle(e.key, e.value, e.name);
      } else if (e.name && !this.isDraw) {
        return (this.symbol.style.nodeStyles[e.name][e.key] = e.value);
      }
      return this.plot.setStyle(e.key, e.value);
    },
    searchIcon(e) {
      //删除上次存储的查询结果
      if (this.searchResult) {
        this.symbolData.shift();
      }

      let result = this.symbols.filter(s => {
        if (`${s.id}`.indexOf(e) > -1 || s.name.indexOf(e) > 1) return true;
      });

      if (result.length > 0) {
        this.searchResult = {
          children: [
            {
              type: "查询结果",
              icon: result,
              collapse: false
            }
          ]
        };
      } else {
        this.searchResult = {
          title: "没有查询到相应的图标！"
        };
      }
      this.symbolData.unshift(this.searchResult);
    }
  }
};
</script>

<style scoped></style>
