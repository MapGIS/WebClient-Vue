<template>
  <div />
</template>

<script>
export default {
  name: "mapgis-3d-kml-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    url: {
      type: String,
      default: null
    }
  },
  computed: {
    name() {
      let tempUrl = null;
      if (this.url && this.url.length > 0) {
        const strs = this.url.split("/");
        tempUrl = strs[strs.length - 1];
      }
      return tempUrl;
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    url: {
      handler: function() {
        this.unmount();
        this.mount();
      }
    }
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const { viewer, vueCesium, vueKey, vueIndex, kmlData } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vueCesium.KmlManager.addSource(vueKey, vueIndex, dataSource, {
          kmlData: undefined
        });
        vm.appendKml(vm.url);
        vm.$emit("loaded", vm);
      });
    },
    /**
     * 加载Kml、kmz数据
     * @param {String} url 路径
     * @returns {KmlDataSource} kml数据对象
     */
    appendKml(url) {
      if (!url || url.length == 0) {
        return;
      }
      let { vueKey, vueIndex, Cesium, viewer } = this;
      const kmlData = Cesium.KmlDataSource.load(url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
      });
      viewer.dataSources.add(kmlData);
      vueCesium.KmlManager.changeOptions(vueKey, vueIndex, "kmlData", kmlData);
      return kmlData;
    },
    unmount() {
      let { vueKey, vueIndex, viewer, vueCesium } = this;
      let find = vueCesium.KmlManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { kmlData } = options;
      if (kmlData) {
        vueCesium.KmlManager.changeOptions(vueKey, vueIndex, "kmlData", null);
        const dataSource = viewer.dataSources.getByName(this.name)[0];
        viewer.dataSources.remove(dataSource);
      }
      this.$emit("unload", this);
    }
  }
};
</script>

<style scoped></style>
