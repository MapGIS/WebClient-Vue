<template>
  <div class="mapgis-3d-plot">
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
        class="mapgis-3d-plot-panel"
      ></mapgis-ui-plot-symbol>
    </slot>
    <mapgis-ui-plot-attribute
      :class="['plot-panel-attribute', 'mapgis-3d-plot-panel']"
      v-if="showStylePanel"
      v-model="styleData"
      :baseUrl="baseUrl"
      :symbolType="symbolType"
      :attributeConfig="styleAttributes"
      @changeComponentStyle="changeStyle"
      @changeStyle="changeStyle"
    ></mapgis-ui-plot-attribute>
  </div>
</template>

<script>
import { styleAttributes } from "@mapgis/webclient-vue-ui/src/components/plot/test/attributeConfig";
import plot from "@mapgis/webclient-plot";
const {
  SymbolManager = window.Zondy.Plot.SymbolManager,
  DrawTool = window.Zondy.Plot.DrawTool
} = plot;

export default {
  name: "mapgis-3d-plot",
  inject: ["viewer", "Cesium", "vueCesium"],
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
      type: [String, Object],
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
    },
    isSetPick: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.styleAttributes = styleAttributes;
    // 设置三维标绘的填充类型属性的选项
    this.styleAttributes.fillStyleType.options = {
      0: "无填充",
      1: "实填充"
    };
    // console.log("styleAttributes", styleAttributes);
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
      searchResult: undefined,
      symbolType: undefined,
      styleAttributes: undefined,

      canFill: true
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
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
    initDrawTool() {
      const vm = this;
      let layer = this.getLayer();
      if (!layer) return;
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
            // console.log("addedPlot--getStyle--json: ", json);
          }
        });
        window.vueCesium.DrawToolManager.addSource(
          this.vueKey,
          this.vueIndex,
          drawTool
        );
      }
    },
    /**
     * 设置图元的点击事件
     */
    setPick() {
      if (!this.isSetPick) {
        return;
      }
      const vm = this;
      let layer = this.getLayer();
      if (!layer) return;
      layer.pickPlot = async function(plot) {
        vm.isDraw = true;
        vm.plot = plot;
        vm.symbolType = plot._elem.type;
        vm.canFill = !plot.isMustFill;
        // console.log("canFill", vm.canFill);
        // console.log("plot-3d", plot);
        let json = plot.getStyle();
        // vm.symbol = vm.symbol || plot._elem._symbol;
        // vm.symbol.style = vm.symbol.style || json;
        vm.parseStyleJson(json, plot._elem._symbol._src);
        let drawTool = vm.getDrawTool();
        if (drawTool) {
          drawTool.stopDraw();
        }
      };
      // layer.pickEventType = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
      this.$emit("pick", this);
    },
    /**
     * 解析符号库
     */
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
        viewer.scene.globe.depthTestAgainstTerrain = false;
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
        });
        vm.symbolData = symbols._config;
        vm.$emit("loaded", vm);
      });
    },
    /**
     * 点击符号
     */
    async clickIcon(data) {
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
      // 调用primitive上的getStyleJSON
      this.symbol.getElement().then(function(res) {
        // console.log("symbol", res);
        vm.symbolType = res.type;
        vm.canFill = !res.isMustFill;
        // console.log("canFill", vm.canFill);
        vm.symbol.style = res.getStyleJSON();
        let json = res.getStyleJSON();
        vm.parseStyleJson(json, data.icon.src);
      });

      let drawTool = this.getDrawTool();
      if (drawTool) {
        drawTool.stopDraw();
        drawTool.drawPlot(vm.symbol);
      }
    },
    /**
     * 解析符号或者图元的样式信息
     */
    parseStyleJson(json, svgUrl) {
      for (var node in json.nodeStyles) {
        if (node.indexOf("tspan") === -1) {
          json.nodeStyles[node]["strokeColor"] =
            json.nodeStyles[node].strokeStyle;
          delete json.nodeStyles[node].strokeStyle;
        }
      }
      json["symbolUrl"] = svgUrl;
      json = this.removeInvalidAttributes(json);
      this.showStylePanel = true;
      this.styleData = json;
    },
    removeInvalidAttributes(json) {
      // 移除二维特有的属性
      delete json.compareLine;
      delete json.compareLineWidth;
      delete json.compareLineColor;

      for (var node in json.nodeStyles) {
        if (node.indexOf("tspan") !== -1) {
          delete json.nodeStyles[node].fontStyle;
          delete json.nodeStyles[node].fontVariant;
          delete json.nodeStyles[node].fontWeight;
          delete json.nodeStyles[node].fontSize;
          delete json.nodeStyles[node].strokeStyle;
          delete json.nodeStyles[node].lineWidth;
        }

        delete json.nodeStyles[node].lineCap;
        delete json.nodeStyles[node].lineJoin;
        delete json.nodeStyles[node].miterLimit;
        delete json.nodeStyles[node].fillGradType;
        delete json.nodeStyles[node].fillGradColor;

        // 移除特定面的无法更改的属性
        if (!this.canFill) {
          delete json.nodeStyles[node].lineWidth;
          delete json.nodeStyles[node].fillStyleType;
          delete json.nodeStyles[node].fillStyle;
        }
      }

      if (!this.canFill) {
        delete json.dimModHeight;
        delete json.dimModAttitude;
        delete json.isOpenWall;
        delete json.wallColor;
        delete json.isWallGradColor;
        delete json.wallGradColor;
      }
      // console.log(this.symbolType);
      if (this.symbolType.indexOf("point") == -1) {
        delete json.dimModAttitude;
      }
      return json;
    },
    /**
     * 改变符号或图元的样式
     */
    changeStyle(e) {
      if (e.key == "strokeColor") {
        e.key = "strokeStyle";
      }
      if (e.name && this.isDraw) {
        return this.plot.setStyle(e.key, e.value, e.name);
      } else if (e.name && !this.isDraw) {
        return (this.symbol.style.nodeStyles[e.name][e.key] = e.value);
      }
      if (e.key === "classificationType") {
        return this.plot.setStyle(e.key, Number(e.value));
      }
      return this.plot.setStyle(e.key, e.value);
    },
    /**
     * 搜索符号
     */
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
      let vueCesium = this.vueCesium || window.vueCesium;
      if (!vueCesium) return;
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
      let PlotSymbolManager = window.PlotSymbolManager;
      return PlotSymbolManager;
    }
  }
};
</script>

<style scoped></style>
