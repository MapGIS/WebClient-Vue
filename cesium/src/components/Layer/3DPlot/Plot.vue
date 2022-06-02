<template>
  <div class="plot-panel">
    <mapgis-ui-plot-symbol
      :data="symbolData"
      @click="clickIcon"
      @search="searchIcon"
      v-if="symbolData"
    ></mapgis-ui-plot-symbol>
    <mapgis-ui-plot-attribute
      class="attribute-panel"
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
      symbolData: undefined,
      showStylePanel: false,
      styleData: undefined,
      // 图元绘制工具
      drawTool: undefined,
      // 符号管理器
      manager: undefined,
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
    mount() {
      const vm = this;
      this.drawTool = new DrawTool(this.layer, {
        addedPlot: function(plot) {
          vm.isDraw = true;
          vm.plot = plot;
        }
      });
      this.getSymbol();

      this.layer.pickPlot = async function(plot) {
        vm.isDraw = true;
        vm.plot = plot;
        // console.log('plot',plot);
        vm.symbol = vm.symbol || plot._elem._symbol;
        let json = plot.getStyle();
        vm.symbol.style = vm.symbol.style || json;
        vm.parseStyleJson(json, plot._elem._symbol._src);
      };
      this.layer.pickEventType = Cesium.ScreenSpaceEventType.RIGHT_CLICK;
    },
    getSymbol() {
      const vm = this;
      // console.log("symbolUrl", this.symbolUrl);
      this.manager = new SymbolManager(this.symbolUrl);
      this.manager.getSymbols().then(function(symbols) {
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
      this.symbol = this.manager.getLeafByID(data.icon.id);
      this.symbol.getElement().then(function(res) {
        vm.symbol.style = res.getStyleJSON();
        let json = res.getStyleJSON();
        vm.parseStyleJson(json, data.icon.src);
      });
      this.drawTool.stopDraw();
      this.drawTool.drawPlot(vm.symbol);
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

<style scoped>
.plot-panel {
  position: absolute;
  left: 0px;
  top: 0px;
  background: #fff;
}

.attribute-panel {
  position: fixed;
  top: 0px;
  right: 0px;
  background: #fff;
}
</style>
