<template>
  <div class="mapgis-2d-plot">
    <slot
      name="symbol"
      :data="symbolData"
      :format="true"
      :click="clickIcon"
      :search="searchIcon"
      :baseUrl="baseUrl"
    >
      <mapgis-ui-plot-symbol
        :data="symbolData"
        :format="true"
        :baseUrl="baseUrl"
        @click="clickIcon"
        @search="searchIcon"
        v-if="symbolData"
        class="mapgis-2d-plot-panel"
      ></mapgis-ui-plot-symbol>
    </slot>
    <mapgis-ui-plot-attribute
      :class="['plot-panel-attribute', 'mapgis-2d-plot-panel']"
      v-if="showStylePanel"
      v-model="styleData"
      :baseUrl="baseUrl"
      :symbolType="symbolType"
      @changeComponentStyle="changeStyle"
      @changeStyle="changeStyle"
    ></mapgis-ui-plot-attribute>
  </div>
</template>

<script>
import plot from "@mapgis/webclient-plot";
const {
  SymbolManager = window.Zondy.Plot.SymbolManager,
  DrawTool = window.Zondy.Plot.DrawTool
} = plot;
export default {
  name: "mapgis-2d-plot",
  inject: ["map"],
  props: {
    /**
     * 标绘图层的vueKey
     */
    vueKey: {
      type: String
    },
    /**
     * 标绘图层的vueIndex
     */
    vueIndex: {
      type: [Number, String]
    },
    /**
     * 符号库url
     */
    symbolUrl: {
      type: String,
      required: true
    },
    /**
     * 字体基地址
     */
    fontUrl: {
      type: String,
      default: ""
    },
    /**
     * 标绘符号基地址
     */
    baseUrl: {
      type: String,
      default: ""
    }
  },
  watch: {
    vueIndex(val) {
      let layer = this.getLayer();
      if (layer) {
        this.initDrawTool();
        this.setPick();
      }
    }
  },
  data() {
    return {
      symbolData: undefined,
      showStylePanel: false,
      styleData: undefined,
      // 符号
      symbol: undefined,
      symbols: undefined,
      // 图元
      plot: undefined,
      // 记录是否完成绘制
      isDraw: false,
      searchResult: undefined,
      symbolType: undefined
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    deletePlot() {
      let layer = this.getLayer();
      if (layer && this.plot) {
        layer.removePlot(this.plot);
        this.showStylePanel = false;
      }
    },
    mount() {
      this.getSymbol();
    },
    unmount() {
      if (window.vueCesium) {
        window.vueCesium.DrawToolManager.deleteSource(
          this.vueKey,
          this.vueIndex
        );
      }
    },
    setPick() {
      const vm = this;
      let layer = this.getLayer();
      if (!layer) return;
      layer.editable = true;
      layer.pickPlot = async function(plot) {
        vm.isDraw = true;
        vm.plot = plot;
        vm.symbolType = plot._elem.type;
        // console.log("plot", plot);
        let json = plot.getStyle();
        // vm.symbol = vm.symbol || plot._elem._symbol;
        // vm.symbol.style = vm.symbol.style || json;
        vm.parseStyleJson(json, plot._elem._symbol._src);
        let drawTool = vm.getDrawTool();
        if (drawTool) {
          drawTool.stopDraw();
        }
      };
      this.$emit("pick", this);
    },
    initDrawTool() {
      const vm = this;
      let layer = this.getLayer();
      if (layer) {
        let drawTool = this.getDrawTool();
        if (!drawTool) {
          drawTool = new DrawTool(layer, {
            addedPlot: function(plot) {
              vm.isDraw = true;
              vm.plot = plot;
              let json = plot.getStyle();
              vm.parseStyleJson(json, plot._elem._symbol._src);
              let drawTool = vm.getDrawTool();
              if (drawTool) {
                drawTool.stopDraw();
                drawTool.drawPlot(vm.symbol);
              }
            }
          });
          window.vueMap.DrawToolManager.addSource(
            this.vueKey,
            this.vueIndex,
            drawTool
          );
        }
      }
    },
    getSymbol() {
      const vm = this;
      // console.log("symbolUrl", this.symbolUrl);
      let manager = this.getSymbolManager();
      if (!manager) {
        manager = new SymbolManager(this.symbolUrl, {
          fontURL: vm.fontUrl,
          baseUrl: vm.baseUrl
        });
        window.PlotSymbolManager = manager;
      }
      manager.getSymbols().then(function(symbols) {
        // console.log("symbols", symbols);
        vm.symbols = [];
        // let symbolData = [];
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
          // symbolData.push(symbolCls);
        });
        vm.symbolData = symbols._config;
        vm.$emit("loaded", vm);
        // vm.symbolData = symbolData;
        // console.log("vm.symbolData", vm.symbolData);
      });
    },
    clickIcon(data) {
      const vm = this;
      let layer = this.getLayer();
      if (!layer) {
        this.$message.warning("请勾选标绘图层后进行操作！");
        return;
      }
      this.isDraw = false;
      let manager = this.getSymbolManager();
      if (!manager) return;
      this.symbol = manager.getLeafByID(data.icon.id);
      this.symbol.getElement().then(function(res) {
        vm.symbol.style = res.getStyleJSON();
        let json = res.getStyleJSON();
        // console.log('styleJson', json);

        vm.parseStyleJson(json, data.icon.src);
      });
      let drawTool = this.getDrawTool();
      if (drawTool) {
        drawTool.stopDraw();
        drawTool.drawPlot(vm.symbol);
      }
    },
    parseStyleJson(json, svgUrl) {
      for (var node in json.nodeStyles) {
        if (node.indexOf("tspan") === -1) {
          json.nodeStyles[node]["strokeColor"] =
            json.nodeStyles[node].strokeStyle;
          delete json.nodeStyles[node].strokeStyle;
        }
      }
      json["symbolUrl"] = svgUrl;
      json = this.remove3dAttributes(json);
      this.showStylePanel = true;
      this.styleData = json;
    },
    remove3dAttributes(json) {
      delete json.dimModHeight;
      delete json.dimModAttitude;
      delete json.isOpenWall;
      delete json.wallColor;

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
        this.symbolData.symbols.shift();
      }

      let result = [];
      for (let i = 0; i < this.symbols.length; i++) {
        if (this.symbols[i].name.indexOf(e) > -1) {
          result.push(this.symbols[i]);
        }
      }
      if (result.length > 0) {
        this.searchResult = {
          path: "搜索结果/",
          name: "搜索结果",
          id: "5bde21fe-f932-11e1-9052-ac74b1ee4018",
          type: "folder",
          items: [
            {
              path: "符号库/",
              name: "符号库",
              id: "51240178-f12e-11ec-9bce-ac74b1ee4018",
              type: "folder",
              items: []
            }
          ]
        };
        for (let i = 0; i < result.length; i++) {
          this.searchResult.items[0].items.push({
            id: result[i].id,
            name: result[i].name,
            type: result[i].type,
            path: result[i].src
          });
        }
        this.symbolData.symbols.unshift(this.searchResult);
      } else {
        this.$message.warning("没有搜素到图标！");
      }
    },
    getLayer() {
      let vueMap = this.vueMap || window.vueMap;
      if (!vueMap) return;
      let layerManager = vueMap.PlotLayerManager.findSource(
        this.vueKey,
        this.vueIndex
      );
      return layerManager && layerManager.source;
    },
    getLayers() {
      let PlotLayerGroupManager = window.vueMap.PlotLayerGroupManager.findSource(
        this.vueKey,
        this.vueIndex
      );
      return PlotLayerGroupManager && PlotLayerGroupManager.source;
    },
    getDrawTool() {
      let DrawToolManager = window.vueMap.DrawToolManager.findSource(
        this.vueKey,
        this.vueIndex
      );
      return DrawToolManager && DrawToolManager.source;
    },
    getSymbolManager() {
      let PlotSymbolManager = window.PlotSymbolManager;
      return PlotSymbolManager;
    }
  }
};
</script>

<style scoped></style>
