<template>
  <div>
    <mapgis-3d-ogc-wms-layer
        v-if="optionsCopy.type === 'WMS'"
        :baseUrl="optionsCopy.baseUrl"
        :layers="optionsCopy.layers"
        :vueKey="optionsCopy.vueKey"
        :vueIndex="optionsCopy.vueIndex"
    />
    <mapgis-3d-igs-tile-layer
        v-if="optionsCopy.type === 'TILE'"
        :baseUrl="optionsCopy.baseUrl"
        :tilingScheme="optionsCopy.tilingScheme"
        :vueKey="optionsCopy.vueKey"
        :vueIndex="optionsCopy.vueIndex"
    />
    <mapgis-3d-igs-dynamic-layer
        v-if="optionsCopy.type === 'DYNAMIC'"
        :baseUrl="optionsCopy.baseUrl"
        :gdbps="optionsCopy.gdbps"
        :vueKey="optionsCopy.vueKey"
        :vueIndex="optionsCopy.vueIndex"
    />
    <mapgis-3d-igs-doc-layer
        v-if="optionsCopy.type === 'DOC'"
        :baseUrl="optionsCopy.baseUrl"
        :layers="optionsCopy.layers"
        :vueKey="optionsCopy.vueKey"
        :vueIndex="optionsCopy.vueIndex"
    />
    <mapgis-3d-ogc-wmts-layer
        v-if="optionsCopy.type === 'WMTS'"
        :baseUrl="optionsCopy.baseUrl"
        :wmtsLayer="optionsCopy.layer"
        :tileMatrixSet="optionsCopy.tileMatrixSet"
        :tilingScheme="optionsCopy.tilingScheme"
        :format="optionsCopy.format"
        :vueKey="optionsCopy.vueKey"
        :vueIndex="optionsCopy.vueIndex"
    />
  </div>
</template>

<script>
export default {
  name: "mapCollection",
  data() {
    return {
      optionsCopy: undefined
    }
  },
  props: {
    options: {
      type: Object,
      default() {
        return {
          baseUrl: undefined,
          layers: undefined,
          gdbps: undefined,
          tilingScheme: undefined,
          type: undefined,
        }
      }
    }
  },
  watch: {
    options: {
      handler() {
        this.optionsCopy = this.options;
      },
      deep: true
    }
  },
  created() {
    this.optionsCopy = this.options;
  }
}
</script>

<style scoped>

</style>