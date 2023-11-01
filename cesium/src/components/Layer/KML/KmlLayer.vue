<template>
  <div />
</template>

<script>
export default {
  name: "mapgis-3d-kml-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    visible: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: null
    },
    token: {
      type: Object
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
        this.removeKML();
        if (this.visible === undefined || this.visible) {
          this.appendKml(this.url, true);
        }
      }
    },
    visible: {
      handler: function() {
        debugger;
        this.removeKML();
        if (this.visible === undefined || this.visible) {
          this.appendKml(this.url, false);
        }
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
        vm.appendKml(vm.url, true);
        vm.$emit("loaded", vm);
      });
    },
    /**
     * 加载Kml、kmz数据
     * @param {String} url 路径
     * @returns {KmlDataSource} kml数据对象
     */
    appendKml(url, changeUrl) {
      if (!url || url.length == 0) {
        return;
      }
      let { vueKey, vueIndex, Cesium, viewer, token } = this;
      let find = vueCesium.KmlManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { kmlData } = options;
      if (!kmlData || changeUrl) {
        if (token && token.value) {
          url += "?" + token.key + "=" + token.value;
        }
        kmlData = Cesium.KmlDataSource.load(url, {
          camera: viewer.scene.camera,
          canvas: viewer.scene.canvas,
          clampToGround: true
        });
        vueCesium.KmlManager.changeOptions(
          vueKey,
          vueIndex,
          "kmlData",
          kmlData
        );
      }
      viewer.dataSources.add(kmlData);
      return kmlData;
    },
    removeKML() {
      let { viewer } = this;
      const dataSource = viewer.dataSources.getByName(this.name)[0];
      if (dataSource) {
        viewer.dataSources.remove(dataSource);
      }
    },
    unmount() {
      this.removeKML();
      let { vueKey, vueIndex, viewer, vueCesium } = this;
      let find = vueCesium.KmlManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { kmlData } = options;
      if (kmlData) {
        vueCesium.KmlManager.changeOptions(vueKey, vueIndex, "kmlData", null);
      }
      this.$emit("unload", this);
    }
  }
};
</script>

<style scoped></style>
