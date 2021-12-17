<template>
  <div style="position: absolute;left: 0;top: 0">
    <div class="mapgis-3d-graphic-layers-select-container">
      <mapgis-ui-select class="mapgis-3d-graphic-layers-select" @change="$_selectLayer" :value="currenSelectLayer">
        <mapgis-ui-select-option :key="index" v-for="(layer, index) in layerSelect" :value="layer.key">
          {{ layer.value }}
        </mapgis-ui-select-option>
      </mapgis-ui-select>
    </div>
    <mapgis-3d-graphic-layer style="top: 48px;" :dataSource="currenLayer"/>
  </div>
</template>

<script>
export default {
  name: "mapgis-3d-graphic-layers",
  model: {
    prop: "dataSource",
    event: "change"
  },
  props: {
    dataSource: {
      type: Array
    }
  },
  watch: {
    dataSource: {
      handler: function () {
        this.$_init();
      },
      deep: true
    },
    dataSourceCopy: {
      handler: function () {
        this.$emit("change", this.dataSourceCopy);
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
      //当前选中的图层
      currenLayer: undefined,
      //数据源备份
      dataSourceCopy: []
    }
  },
  mounted() {
    this.$_init();
  },
  methods: {
    //选择图层
    $_selectLayer(e) {
      //设置当前选中的图层
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === e) {
          this.currenLayer = this.dataSourceCopy[i].dataSource;
          this.currenSelectLayer = this.dataSourceCopy[i].uuid;
          break;
        }
      }
    },
    //初始化数据
    $_init() {
      //复制数据源
      this.dataSourceCopy = this.dataSource;
      //设置当前图层
      this.currenLayer = this.dataSourceCopy[0].dataSource;
      //初始化graphicLayer图层列表
      this.layerSelect = [];
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        this.layerSelect.push({
          key: this.dataSourceCopy[i].uuid,
          value: this.dataSourceCopy[i].name
        });
      }
      this.currenSelectLayer = this.layerSelect[0].key;
      console.log("this.currenSelectLayer", this.currenSelectLayer)
    }
  }
}
</script>

<style scoped>
.mapgis-3d-graphic-layers-select-container {
  width: 332px;
  height: 48px;
  background: #F1F1F1;
  padding-top: 7px;
}

.mapgis-3d-graphic-layers-select {
  width: 300px;
}
</style>