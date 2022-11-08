<template>
  <div>
    <div class="mapgis-ui-svg-manager-file">
      <mapgis-ui-plot-symbol
        style="height: 510px;"
        :data="symbolsConfig"
        :format="true"
        @click="clickIcon"
        @chooseFolder="chooseFolder"
      ></mapgis-ui-plot-symbol>
      <div class="mapgis-ui-svg-manager-file-right">
        <mapgis-ui-row class="mapgis-ui-svg-manager-file-right-row">
          <input
            style="display: none"
            type="file"
            :id="inputId"
            accept=".svg"
          />
          <mapgis-ui-button @click="importSVG">新增</mapgis-ui-button>
        </mapgis-ui-row>
        <mapgis-ui-row class="mapgis-ui-svg-manager-file-right-row">
          <mapgis-ui-button>修改</mapgis-ui-button>
        </mapgis-ui-row>
        <mapgis-ui-row class="mapgis-ui-svg-manager-file-right-row">
          <mapgis-ui-button>删除</mapgis-ui-button>
        </mapgis-ui-row>
        <mapgis-ui-row class="mapgis-ui-svg-manager-file-right-row">
          <mapgis-ui-button @click="exportConfig">导出配置</mapgis-ui-button>
        </mapgis-ui-row>
      </div>
    </div>
    <mapgis-ui-svg-setting-panel
      style="position: absolute;right: 20px;top: 66px;"
      :url="svgUrl"
    ></mapgis-ui-svg-setting-panel>
  </div>
</template>

<script>
import { SymbolManager } from "@mapgis/webclient-es6-service";
import symbolsConfig from "./symbols";
import axios from "axios";
import { saveAs } from "file-saver";

export default {
  name: "mapgis-ui-svg-manager",
  props: {
    symbolUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      symbolData: [],
      svgUrl: undefined,
      symbolsConfig: symbolsConfig,
      currentFolderId: undefined,
      inputId: "mapgisFileImport" + parseInt(String(Math.random() * 10000))
    };
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
      let { symbols } = symbolsConfig,
        inputFile = document.getElementById(this.inputId),
        that = this;
      inputFile.click();
      inputFile.onchange = function() {
        let File = inputFile.files[0];
        let name = inputFile.files[0].name;
        // 使用 FileReader 来读取文件
        let reader = new FileReader();
        // 读取纯文本文件,且编码格式为 utf-8
        reader.readAsText(File, "UTF-8");
        // 读取文件
        reader.onload = function(e) {
          let fileContent = e.target.result;
          for (let i = 0; i < symbols.length; i++) {
            let { items } = symbols[i];
            for (let j = 0; j < items.length; j++) {
              if (items[j].id === that.currentFolderId) {
                items[j].items.push({
                  id: 112211,
                  //名称
                  name: name,
                  //类型
                  type: "simplepoint",
                  //相对路径
                  path:
                    that.symbolsConfig.rootPath +
                    symbols[i].path +
                    items[j].path +
                    name
                });
                break;
              }
            }
          }
          inputFile.value = "";
        };
      };
    },
    chooseFolder(id) {
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
    }
  },
  mounted() {
    let manager = new SymbolManager(this.symbolUrl);
    let vm = this;
    manager.getSymbols().then(function(symbols) {
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
};
</script>

<style scoped>
.mapgis-ui-svg-manager-file {
  position: relative;
  width: 450px;
  height: 510px;
  border: 1px solid red;
}

.mapgis-ui-svg-manager-file-right {
  position: absolute;
  right: 0;
  top: 0;
  width: 130px;
  height: 510px;
  border: 1px solid blue;
}

.mapgis-ui-svg-manager-file-right-row {
  height: 50px;
  text-align: center;
  line-height: 50px;
}
</style>
