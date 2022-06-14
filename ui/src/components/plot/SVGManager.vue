<template>
  <div>
    <mapgis-ui-plot-symbol
        :data="symbolsConfig"
        :format="true"
        @click="clickIcon"
        @chooseFolder="chooseFolder"
    ></mapgis-ui-plot-symbol>
    <mapgis-ui-svg-setting-panel
        style="position: absolute;right: 20px;top: 66px;"
        :url="svgUrl"
        @importSVG="importSVG"
        @exportConfig="exportConfig"
    ></mapgis-ui-svg-setting-panel>
  </div>
</template>

<script>
import {SymbolManager} from "../../../../../WebClient-JavaScript/src/service";
import symbolsConfig from "./symbols";
import axios from "axios";
import {saveAs} from "file-saver";

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
      svgUrl: undefined,
      symbolsConfig: symbolsConfig,
      currentFolderId: undefined
    }
  },
  methods: {
    exportConfig() {
      let json = JSON.stringify(this.symbolsConfig);
      const blob = new Blob([json], {
        type: "application/json;charset=utf-8"
      });
      saveAs(blob, "标绘符号配置文件" + ".json");
    },
    importSVG(fileContent, name) {
      console.log("fileContent, name", fileContent)
      console.log("fileContent, name", name)
      let {symbols} = symbolsConfig;
      for (let i = 0; i < symbols.length; i++) {
        let {items} = symbols[i];
        for (let j = 0; j < items.length; j++) {
          if (items[j].id === this.currentFolderId) {
            console.log("-------", items[j]);
            items[j].items.push({
              "id": 112211,
              //名称
              "name": "测试",
              //类型
              "type": "simplepoint",
              //相对路径
              "path": this.symbolsConfig.rootPath + symbols[i].path + items[j].path + name
            });
            break;
          }
        }
      }
    },
    chooseFolder(id) {
      console.log("------id", id)
      this.currentFolderId = id;
    },
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
      console.log("symbolData", symbolData)
    });
  }
}
</script>

<style scoped>

</style>