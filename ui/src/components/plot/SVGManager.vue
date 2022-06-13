<template>
  <div>
    <mapgis-ui-plot-symbol
        :data="symbolData"
        @click="clickIcon"
    ></mapgis-ui-plot-symbol>
    <mapgis-ui-svg-setting-panel
      :url="svgUrl"
    ></mapgis-ui-svg-setting-panel>
  </div>
</template>

<script>
import {SymbolManager} from "../../../../../WebClient-JavaScript/src/service";
import axios from "axios";

export default {
  name: "mapgis-ui-svg-manager",
  props: {
    symbolUrl: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      symbolData: [],
      svgUrl: undefined
    }
  },
  methods: {
    clickIcon(data) {
      this.svgUrl = data.icon.src;
    },
    async getSvg(url) {
      const res = await axios({
        method: "get",
        url: url,
        dataType: "text",
        timeout: 1000
      });

      const xml = await new DOMParser().parseFromString(
          res.data,
          "image/svg+xml"
      );
      return xml.documentElement;
    },
  },
  mounted() {
    let manager = new SymbolManager(this.symbolUrl);
    let vm = this;
    manager.getSymbols().then(function (symbols) {
      vm.symbols = [];
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
  }
}
</script>

<style scoped>

</style>