<template>

</template>

<script>
import plot from "@mapgis/webclient-plot";
const {LinkTool = window.Zondy.Plot.LinkTool} = plot;

export default {
  name: "mapgis-3D-plot-link",
  props: {
    containers: {type: Array, default: () => []},
    layers: {type: Array, default: () => []}
  },
  data() {
    return {
      containersCopy: undefined
    }
  },
  mounted() {
    let that = this, currentLength = 0, containers = [];
    this.containersCopy = JSON.parse(JSON.stringify(this.containers));
    let interval = setInterval(function () {
      let linkLength = that.containersCopy.length;
      for (let i = 0; i < linkLength; i++) {
        let type = that.containersCopy[i].type;
        switch (type) {
          case "cesium":
            if(!that.containersCopy[i].isAdded) {
              let ViewerManager = window.vueCesium.ViewerManager.findSource(that.containersCopy[i].vueKey, that.containersCopy[i].vueIndex);
              if (ViewerManager && ViewerManager.source) {
                containers.push(ViewerManager.source);
                currentLength++;
                that.containersCopy[i].isAdded = true;
              }
            }
            break;
          case "mapbox":
            if(!that.containersCopy[i].isAdded) {
              let mapManager = window.vueMap.MapManager.findSource(that.containersCopy[i].vueKey, that.containersCopy[i].vueIndex);
              if (mapManager && mapManager.source
                  && mapManager.options
                  && typeof mapManager.options === "object"
                  && mapManager.options.canvas) {
                containers.push(mapManager.options.canvas);
                currentLength++;
                that.containersCopy[i].isAdded = true;
              }
            }
            break;
        }
        if (currentLength === linkLength) {
          let loadedLayer = 0
          let layerT = setInterval(function () {
            let layerLength = that.layers.length;
            for (let k = 0; k < layerLength; k++) {
              let layerManager = window.vueCesium.PlotLayerManager.findSource(
                  that.layers[k].vueKey,
                  that.layers[k].vueIndex
              );
              if (layerManager && layerManager.source && layerManager.source.loaded) {
                loadedLayer++;
              }
            }
            if(layerLength === loadedLayer){
              for (let k = 0; k < layerLength; k++) {
                let layerManager = window.vueCesium.PlotLayerManager.findSource(
                    that.layers[k].vueKey,
                    that.layers[k].vueIndex
                );
                let linkTool = new LinkTool(layerManager.source, containers);
              }
              clearInterval(layerT);
            }
          }, 50);
          clearInterval(interval);
        }
      }
    }, 100);
  }
}
</script>

<style scoped>

</style>