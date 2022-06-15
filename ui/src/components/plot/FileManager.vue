<template>
  <div class="mapgis-ui-file-manager-container" v-if="symbols">
    <div class="mapgis-ui-file-manager-container-left">
      <div @dblclick="chooseFolder(symbol)"
           class="mapgis-ui-file-manager-container-left-row"
           :key="index" v-for="(symbol, index) in symbols"
      >
        <img title="双击打开文件夹" class="mapgis-ui-file-manager-container-left-folder" v-if="symbol.type === 'folder'" :src="folderImg" alt="">
        <img class="mapgis-ui-file-manager-container-left-folder" v-if="symbol.type !== 'folder'" :src="svgImg" alt="">
        <span v-if="symbol.type === 'folder'" title="双击打开文件夹"  class="mapgis-ui-file-manager-container-left-title">{{ symbol.name }}</span>
        <span v-if="symbol.type !== 'folder'" class="mapgis-ui-file-manager-container-left-title">{{ symbol.name }}</span>
      </div>
    </div>
    <div class="mapgis-ui-file-manager-container-right">
      <div class="mapgis-ui-file-manager-container-right-button">
        <input style="display: none" type="file" :id="inputId" accept=".svg" />
        <mapgis-ui-button @click="importSVG">导入</mapgis-ui-button>
      </div>
      <div class="mapgis-ui-file-manager-container-right-button">
        <mapgis-ui-button @click="exportConfig">导出配置</mapgis-ui-button>
      </div>
      <div class="mapgis-ui-file-manager-container-right-button">
        <mapgis-ui-button>下载</mapgis-ui-button>
      </div>
    </div>
  </div>
</template>

<script>
import symbolsConfig from "./symbols";
import {saveAs} from "file-saver";

export default {
  name: "mapgis-ui-file-manager",
  data() {
    return {
      symbols: undefined,
      currentSymbol: undefined,
      inputId: "mapgisFileImport" + parseInt(String(Math.random() * 10000)),
      rootPath: undefined,
      folderImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAN1JREFUWEftl7ENwkAMRV86JmEBBgBWoGAOSjrIBAxBiegYAFHDADTMgizlpETkcj5i6VLYUjr7+923pdxVFI6qcH/aACtgOQD0Ac7WwAFgATwV4hdgq8hTpwSAA3BsvljxHpg1AAJiEn0AdUR5B5yAR2JUWWA5ACL8BuYJpzQAN+AlibkAG+Cq6aDIWQP3XADRlX0ZG2Hf6n8AxjZvL/w0AcaeUFMfHYGm2CpHIHpHYNVgSMeX0B1wB9wBd8AdmLYDRf6G2oeJJVznUirCqaeZZfOfa7mleJZW8dfxF7g7YyHcX520AAAAAElFTkSuQmCC",
      svgImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAjNJREFUWEfN10+oTVEUBvDfM2JAzAwoyUAMKIVSeBkIM2KkGIqJPzMTpMyQgYiBUlJERp4B+RPJv1KipCSGijAV+l7n6HQ795zrXde1Zufsb+/17bX3+tbaI9ptAXZgHea1w8cRD3Ecl9vwIy2AA9iLaW0LdRk/iENNc5sIrMHNyuTs5mUPRDZjYQWXSGQTtdZE4Ghl4iju9OA8kBW434G9h1V185sIXMHGwnEI9GpT8bUG/ARLO/83EbiN1Wg9xxpnP7uwvVus+Xv4XxOI4xtFRo2TGAaB+L2KTcMkEN/rMTaoCJxEBKxqMzEHk4ufF7B1UASaMuYDZpXZNQwCZXZFV0b/KwLR/apFA0od6FWESlxk+1WXSbUROIftf+qlBb8cj2owtQTKn534nNNcvK0o2Dc8q3y/wCTM7qia3epHzwTSA3zClCKlFmMtbuEBFhU1/yNW4ghmVHbQF4GU3W14Wiz4GntwHaexDCewASm/ddYXgSx4FudxuAh3yuwY0ieksiWDUnRSrHLpIj65tKX1TaBcKGH9jFP4gh/YHxUrorIEW7DzbxLI5XtTnGnSs+yEomDpkubjIs5gFy4NgkDO+3vRFcVxLMSqYU7jcayQ1jSsEz6CoetAdjdUJaxLo35asiaR/H+LUSfroUdgom15U/jTsr/H9LIvHMTDpInA7qJ+BJP03TeIp1k3AmV/kfEUuTx2Hw/6cVpH5l0h4dcy2EYgmIk8z+scPy+UNFU0JMbtFyfSqiErzk+aAAAAAElFTkSuQmCC"
    }
  },
  mounted() {
    this.symbolsConfig = symbolsConfig;
    this.symbols = symbolsConfig.symbols;
    this.rootPath = symbolsConfig.rootPath;
  },
  methods: {
    chooseFolder(symbol) {
      this.symbols = symbol.items;
      this.currentSymbol = symbol;
      if(this.currentSymbol.type === "folder"){
        this.rootPath += this.currentSymbol.path;
      }
    },
    exportConfig() {
      let json = JSON.stringify(this.symbolsConfig);
      const blob = new Blob([json], {
        type: "application/json;charset=utf-8"
      });
      saveAs(blob, "标绘符号配置文件" + ".json");
    },
    importSVG() {
      let inputFile = document.getElementById(this.inputId), that = this;
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
          if(that.currentSymbol && that.currentSymbol.type === "folder"){
            that.currentSymbol.items.push({
              //图片id
              "id": 1,
              //名称
              "name": name,
              //类型
              "type": "point",
              //相对路径
              "path": that.rootPath + name
            });
          }
          inputFile.value = "";
        };
      };
    }
  }
}
</script>

<style scoped>
.mapgis-ui-file-manager-container {
  width: 600px;
  height: 600px;
  border: 1px solid rgb(217, 217, 217);
}

.mapgis-ui-file-manager-container-left {
  width: 398px;
  height: 600px;
  border-right: 1px solid rgb(217, 217, 217);
  float: left;
}

.mapgis-ui-file-manager-container-right {
  width: 198px;
  height: 600px;
  float: left;
}

.mapgis-ui-file-manager-container-left-row {
  width: 100%;
  height: 60px;
}

.mapgis-ui-file-manager-container-left-row:hover{
  background: #cccccc;
  cursor: pointer;
}

.mapgis-ui-file-manager-container-right-button {
  width: 100%;
  height: 40px;
  line-height: 34px;
  text-align: center;
}

.mapgis-ui-file-manager-container-right-button > button{
  width: 100px;
  margin: 10px 0;
}

.mapgis-ui-file-manager-container-left-check {
  line-height: 60px;
  margin-left: 10px;
}

.mapgis-ui-file-manager-container-left-folder {
  width: 16px;
  height: 16px;
  margin-left: 10px;
  margin-top: -3px;
}

.mapgis-ui-file-manager-container-left-title {
  font-weight: bolder;
  margin-left: 10px;
  line-height: 60px;
}
</style>