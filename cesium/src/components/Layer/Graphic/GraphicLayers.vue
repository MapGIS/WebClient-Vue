<template>
  <div style="position: absolute;left: 0;top: 0">
    <div class="mapgis-3d-graphic-layers-select-container">
      <mapgis-ui-select class="mapgis-3d-graphic-layers-select" @change="$_selectLayer" :value="currenSelectLayer">
        <mapgis-ui-select-option :key="index" v-for="(layer, index) in layerSelect" :value="layer.key">
          {{ layer.value }}
        </mapgis-ui-select-option>
      </mapgis-ui-select>
      <input style="display: none" type="file" :id="inputId"
             accept=".json">
      <mapgis-ui-button type="primary" class="mapgis-3d-graphic-layers-export" @click="$_export">导出</mapgis-ui-button>
      <mapgis-ui-button class="mapgis-3d-graphic-layers-import" @click="$_import">导入</mapgis-ui-button>
    </div>
    <mapgis-3d-graphic-layer ref="graphicLayer" style="top: 48px;" :dataSource="currenLayer"/>
  </div>
</template>

<script>
import {saveAs} from "file-saver";

export default {
  name: "mapgis-3d-graphic-layers",
  props: {
    dataSource: {
      type: Array
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init(this.currenSelectIndex);
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        // this.$emit("change", this.dataSourceCopy);
      },
      deep: true
    }
  },
  data() {
    return {
      //graphicLayer图层列表
      layerSelect: [],
      //当前下拉框中选中的图层
      currenSelectLayer: undefined,
      //当前选中的图层的index
      currenSelectIndex: 0,
      //当前选中的图层
      currenLayer: undefined,
      //数据源备份
      dataSourceCopy: [],
      //导入文件按钮id
      inputId: "mapgisPlottingImport" + parseInt(String(Math.random() * 10000)),
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    $_import() {
      let inputFile = document.getElementById(this.inputId), vm = this;
      inputFile.click();
      inputFile.onchange = function () {
        let File = inputFile.files[0];
        // 使用 FileReader 来读取文件
        let reader = new FileReader();
        // 读取纯文本文件,且编码格式为 utf-8
        reader.readAsText(File, 'UTF-8');
        // 读取文件
        reader.onload = function (e) {
          let fileContent = e.target.result;
          vm.$_updateData(JSON.parse(fileContent));
          inputFile.value = '';
        }
      }
    },
    $_export() {
      let json = this.dataSourceCopy[this.currenSelectIndex];
      let exportJSON = {
        name: json.name,
        uuid: json.uuid,
        dataSource: {
          "type": "FeatureCollection",
          "features": json.dataSource
        }
      }
      const blob = new Blob([JSON.stringify(exportJSON)], {
        type: "application/json;charset=utf-8",
      });
      let title = json.name || "无标题";
      saveAs(blob, title + ".json");
    },
    //更新数据
    $_updateData(data) {
      console.log("data",data)
      this.$refs.graphicLayer.$_fromJson(data.dataSource);
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        //uuid相同，更新数据
        if (this.dataSourceCopy[i].uuid === data.uuid) {
          this.$refs.graphicLayer.$_updateStyleByLayer(data);
          this.dataSourceCopy[i].dataSource = data.dataSource.features;
          console.log("this.dataSourceCopy",this.dataSourceCopy)
          break;
        } else {
          //uuid不相同，新增数据
          let {dataSource} = data;
          this.$refs.graphicLayer.$_fromJson(dataSource);
          this.dataSourceCopy.push(data);
          break;
        }
      }
    },
    //选择图层
    $_selectLayer(e) {
      //设置当前选中的图层
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === e) {
          this.currenLayer = this.dataSourceCopy[i].dataSource;
          this.currenSelectLayer = this.dataSourceCopy[i].uuid;
          this.currenSelectIndex = i;
          break;
        }
      }
    },
    //设置下拉框
    $_layerSelect(layerIndex) {
      this.layerSelect = [];
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        this.layerSelect.push({
          key: this.dataSourceCopy[i].uuid,
          value: this.dataSourceCopy[i].name
        });
      }
      if (this.layerSelect.length > 0) {
        this.currenSelectLayer = this.layerSelect[layerIndex].key;
      }
    },
    //初始化数据
    $_init(layerIndex) {
      layerIndex = layerIndex || 0;
      //复制数据源
      this.dataSourceCopy = this.dataSource;
      //设置当前图层
      if (this.dataSourceCopy.length > 0) {
        this.currenLayer = this.dataSourceCopy[layerIndex].dataSource;
      } else {
        this.currenLayer = [];
      }
      //初始化graphicLayer图层列表
      this.$_layerSelect(layerIndex);
    }
  }
}
</script>

<style scoped>
.mapgis-3d-graphic-layers-select-container {
  width: 332px;
  height: 48px;
  background: #F1F1F1;
  padding: 7px 15px;
}

.mapgis-3d-graphic-layers-select {
  width: 160px;
  float: left;
}

.mapgis-3d-graphic-layers-export {
  float: right;
}

.mapgis-3d-graphic-layers-import {
  float: right;
  margin-right: 6px;
}
</style>