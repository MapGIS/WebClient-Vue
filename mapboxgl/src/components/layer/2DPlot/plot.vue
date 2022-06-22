<template>
  <div class="mapgis-2d-plot">
    <slot
      name="symbol"
      :data="symbolData"
      :format="true"
      :click="clickIcon"
      :search="searchIcon"
      :baseUrl="baseUrl"
      v-if="symbolData"
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
      @changeComponentStyle="changeStyle"
      @changeStyle="changeStyle"
    ></mapgis-ui-plot-attribute>
  </div>
</template>

<script>
import { SymbolManager, DrawTool } from "@mapgis/webclient-es6-service";

export default {
  name: "mapgis-2d-plot",
  inject: ["map", "vueMap"],
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
  // watch: {
  //   layer: {
  //     handler: function(lyr) {
  //       console.log('layer---',lyr);
  //     },
  //     immediate: true,
  //   }
  // },
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
      searchResult: undefined
    };
  },
  mounted() {
    // if (this.layer) {
    this.mount();
    // }
  },
  methods: {
    mount() {
      const vm = this;
      let layer = this.getLayer();
      if(layer){
        let drawTool = this.getDrawTool();
        if(!drawTool){
          drawTool = new DrawTool(layer, {
            addedPlot: function(plot) {
              vm.isDraw = true;
              vm.plot = plot;
            }
          });
          window.vueMap.DrawToolManager.addSource(this.vueKey, this.vueIndex, drawTool);
        }
      }
      this.getSymbol();

      layer.editable = true;
      layer.pickPlot = function(plot) {
        vm.isDraw = true;
        vm.plot = plot;
        // console.log('plot',plot);
        vm.symbol = vm.symbol || plot._elem._symbol;
        let json = plot.getStyle();
        vm.symbol.style = vm.symbol.style || json;
        vm.parseStyleJson(json, plot._elem._symbol._src);
      };
      this.$emit("loaded", this);
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
    },
    getLayer() {
      let vueMap = this.vueMap || window.vueMap;
      if(!vueMap)return;
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
      let PlotSymbolManager = window.vueMap.PlotSymbolManager.findSource(
          this.vueKey,
          this.vueIndex
      );
      return PlotSymbolManager && PlotSymbolManager.source;
    },
    toJSON() {
      let layer = this.getLayer();
      return layer && layer.toJSON();
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
        window.vueMap.PlotSymbolManager.addSource(this.vueKey, this.vueIndex, manager);
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
        // vm.symbolData = symbolData;
        // console.log("vm.symbolData", vm.symbolData);
      });
    },
    clickIcon(data) {
      const vm = this;
      this.isDraw = false;
      let manager = this.getSymbolManager();
      if(!manager) return;
      this.symbol = manager.getLeafByID(data.icon.id);
      this.symbol.getElement().then(function(res) {
        vm.symbol.style = res.getStyleJSON();
        let json = res.getStyleJSON();
        // console.log('styleJson', json);

        vm.parseStyleJson(json, data.icon.src);
      });
      let drawTool = this.getDrawTool();
      if(drawTool){
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
      json = this.remove3dAttributes(json);
      this.showStylePanel = true;
      this.styleData = json;
      // console.log("json", json);
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
