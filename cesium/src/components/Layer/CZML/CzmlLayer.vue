<template>
  <div />
</template>

<script>
export default {
  name: "mapgis-3d-czml-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    url: {
      type: String,
      default: null,
    },
    token: {
      type: Object,
    },
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
      handler: function () {
        this.removeCzml();
        if (this.visible === undefined || this.visible) {
          this.appendCzml(this.url, true);
        }
      },
    },
    visible: {
      handler: function () {
        this.removeCzml();
        if (this.visible === undefined || this.visible) {
          this.appendCzml(this.url, false);
        }
      },
    },
  },
  methods: {
    async createCesiumObject() {
      return new Promise(
        (resolve) => {
          resolve();
        },
        (reject) => {}
      );
    },
    mount() {
      const { viewer, vueCesium, vueKey, vueIndex, czmlData } = this;
      const vm = this;
      const promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        vueCesium.CzmlManager.addSource(vueKey, vueIndex, dataSource, {
          czmlData: undefined,
        });
        vm.appendCzml(vm.url, true);
        vm.$emit("loaded", vm);
      });
    },
    /**
     * 加载czml数据
     * @param {String} url 路径
     * @returns {CzmlDataSource} czml数据对象
     */
    appendCzml(url, changeUrl) {
      if (!url || url.length == 0) {
        return;
      }
      const { vueKey, vueIndex, Cesium, viewer, token } = this;
      const find = vueCesium.CzmlManager.findSource(vueKey, vueIndex);
      const { options } = find;
      let { czmlData } = options;
      if (!czmlData || changeUrl) {
        if (token && token.value) {
          url += "?" + token.key + "=" + token.value;
        }
        czmlData = Cesium.CzmlDataSource.load(url, {
          camera: viewer.scene.camera,
          canvas: viewer.scene.canvas,
          clampToGround: true,
        });
        czmlData.then((data) => {
          vueCesium.CzmlManager.changeOptions(
            vueKey,
            vueIndex,
            "czmlData",
            data
          );
        });
      }
      viewer.dataSources.add(czmlData);
      return czmlData;
    },
    removeCzml() {
      const { vueKey, vueIndex, viewer, vueCesium } = this;
      const find = vueCesium.CzmlManager.findSource(vueKey, vueIndex);
      const { options } = find;
      const { czmlData } = options;
      if (czmlData) {
        viewer.dataSources.remove(czmlData);
      }
    },
    unmount() {
      this.removeCzml();
      const { vueKey, vueIndex, vueCesium } = this;
      const find = vueCesium.CzmlManager.findSource(vueKey, vueIndex);
      if (find) {
        vueCesium.CzmlManager.deleteSource(vueKey, vueIndex);
      }
      this.$emit("unload", this);
    },
  },
};
</script>

<style scoped></style>
