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
        :useIGS="useIGS"
      ></mapgis-ui-plot-symbol>
    </slot>
    <mapgis-ui-plot-attribute
      :class="['plot-panel-attribute', 'mapgis-3d-plot-panel']"
      v-if="showStylePanel"
      v-model="styleData"
      :baseUrl="baseUrl"
      :symbolType="symbolType"
      :attributeConfig="styleAttributesUIConfig"
      @changeComponentStyle="changeStyle"
      @changeStyle="changeStyle"
    ></mapgis-ui-plot-attribute>
  </div>
</template>

<script>
import { styleAttributesUIConfig } from "@mapgis/webclient-vue-ui";
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
    },
    /**
     * 是否使用IGS作文文件服务，默认true
     */
    useIGS: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.styleAttributesUIConfig = styleAttributesUIConfig;
    // 设置三维标绘的填充类型属性的选项
    this.styleAttributesUIConfig.fillStyleType.options = {
      0: "无填充",
      1: "实填充"
    };
    // console.log("styleAttributesUIConfig", styleAttributesUIConfig);
  },
  data() {
    return {
      symbolData: undefined,
      showStylePanel: false,
      styleData: undefined,
      handler: undefined,
      // 符号
      symbols: undefined,
      // 记录是否完成绘制
      isDraw: false,
      searchResult: undefined,
      symbolType: undefined,
      styleAttributesUIConfig: undefined,

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
      let plot = this.getPlot();
      if (layer && plot) {
        layer.removePlot(plot);
        this.showStylePanel = false;
      }
    },
    mount() {
      this.getSymbolLib();
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
            let exist = vm.getPlot();
            if (exist) {
              window.vueCesium.PlotManager.changeSource(
                vm.vueKey,
                vm.vueIndex,
                plot
              );
            } else {
              window.vueCesium.PlotManager.addSource(
                vm.vueKey,
                vm.vueIndex,
                plot
              );
            }
            let json = plot.getStyle();
            vm.parseStyleJson(json, plot._elem._symbol._src);
            let drawTool = vm.getDrawTool();
            let symbol = vm.getSymbol();
            if (drawTool) {
              drawTool.stopDraw();
              drawTool.drawPlot(JSON.parse(JSON.stringify(symbol)));
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
        if (!plot) return;
        vm.isDraw = true;
        let exist = vm.getPlot();
        if (exist !== undefined) {
          window.vueCesium.PlotManager.changeSource(
            vm.vueKey,
            vm.vueIndex,
            plot
          );
        } else {
          window.vueCesium.PlotManager.addSource(vm.vueKey, vm.vueIndex, plot);
        }
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
    formatData(list) {
      let symbols = list.symbols || [];
      for (let i = 0; i < symbols.length; i++) {
        if (symbols[i].type === "folder") {
          symbols[i].id = symbols[i].symbolId;
          symbols[i].path = symbols[i].symbolId;
          let items = symbols[i].items || [];
          for (let j = 0; j < items.length; j++) {
            if (items[j].type === "folder") {
              items[j].id = items[j].symbolId;
              items[j].path = items[j].symbolId;
              let icons = items[j].items || [];
              for (let k = 0; k < icons.length; k++) {
                icons[k].id = icons[k].symbolId;
                icons[k].path = icons[k].symbolId;
              }
            }
          }
        }
      }
    },
    /**
     * 解析符号库
     */
    getSymbolLib() {
      const vm = this;
      // console.log("symbolUrl-3d", this.symbolUrl);
      this.formatData(this.symbolUrl);
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
      let exist = this.getSymbol();
      let symbol;
      //当使用IGS作为文件服务时，使用ID
      if(vm.useIGS) {
        symbol = manager.getLeafByID(data.icon.id);
      }else {
        //当不使用IGS作为文件服务时，使用symbolId
        symbol = manager.getLeafByID(data.icon.symbolId);
      }
      if (exist) {
        window.vueCesium.OneSymbolManager.changeSource(
          vm.vueKey,
          vm.vueIndex,
          symbol
        );
      } else {
        window.vueCesium.OneSymbolManager.addSource(
          vm.vueKey,
          vm.vueIndex,
          symbol
        );
      }
      // 调用primitive上的getStyleJSON
      symbol.getElement().then(function(res) {
        // console.log("symbol", res);
        vm.symbolType = res.type;
        vm.canFill = !res.isMustFill;
        // console.log("canFill", vm.canFill);
        symbol.style = res.getStyleJSON();
        let json = res.getStyleJSON();
        vm.parseStyleJson(json, data.icon.src);
      });

      let drawTool = this.getDrawTool();
      if (drawTool) {
        drawTool.stopDraw();
        drawTool.drawPlot(symbol);
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
      this.styleData = JSON.parse(JSON.stringify(json));
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
      let plot = this.getPlot();
      let symbol = this.getSymbol();
      if (e.name && this.isDraw) {
        return plot.setStyle(e.key, e.value, e.name);
      } else if (e.name && !this.isDraw) {
        return (symbol.style.nodeStyles[e.name][e.key] = e.value);
      }
      if (e.key === "classificationType") {
        return plot.setStyle(e.key, Number(e.value));
      }
      return plot.setStyle(e.key, e.value);
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
          path: "搜索结果",
          name: "搜索结果",
          symbolId: "5bde21fe-f932-11e1-9052-ac74b1ee4018",
          type: "folder",
          items: [
            {
              path: "符号库",
              name: "符号库",
              symbolId: "51240178-f12e-11ec-9bce-ac74b1ee4018",
              type: "folder",
              items: []
            }
          ]
        };
        for (let i = 0; i < result.length; i++) {
          this.searchResult.items[0].items.push({
            symbolId: result[i].id,
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
    // 获取图元
    getPlot() {
      let PlotManager = window.vueCesium.PlotManager.findSource(
        this.vueKey,
        this.vueIndex
      );
      return PlotManager && PlotManager.source;
    },
    // 获取符号
    getSymbol() {
      let OneSymbolManager = window.vueCesium.OneSymbolManager.findSource(
        this.vueKey,
        this.vueIndex
      );
      return OneSymbolManager && OneSymbolManager.source;
    },
    getSymbolManager() {
      let PlotSymbolManager = window.PlotSymbolManager;
      return PlotSymbolManager;
    }
  }
};
</script>

<style scoped></style>
