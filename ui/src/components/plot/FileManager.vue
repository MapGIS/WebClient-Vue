<template>
  <div class="mapgis-ui-file-manager-container" v-if="symbols">
    <div class="mapgis-ui-file-manager-container-left">
      <div @dblclick="chooseFolder(symbol)"
           class="mapgis-ui-file-manager-container-left-row"
           :style="{'background': symbol.type === 'folder' ? '#cccccc' : '#d9c1c1'}"
           :key="index" v-for="(symbol, index) in symbols">
        {{ symbol.name }}
      </div>
    </div>
    <div class="mapgis-ui-file-manager-container-right"></div>
  </div>
</template>

<script>
import symbolsConfig from "./symbols";

export default {
  name: "mapgis-ui-file-manager",
  data() {
    return {
      symbols: undefined,
    }
  },
  mounted() {
    this.symbols = symbolsConfig.symbols;
  },
  methods: {
    chooseFolder(symbol) {
      console.log("------------")
      this.symbols = symbol.items;
    }
  }
}
</script>

<style scoped>
.mapgis-ui-file-manager-container {
  width: 600px;
  height: 600px;
  border: 1px solid red;
}

.mapgis-ui-file-manager-container-left {
  width: 398px;
  height: 600px;
  border: 1px solid red;
  float: left;
}

.mapgis-ui-file-manager-container-right {
  width: 198px;
  height: 600px;
  border: 1px solid red;
  float: left;
}

.mapgis-ui-file-manager-container-left-row {
  width: 100%;
  height: 60px;
}
</style>