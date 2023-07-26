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
      default: null
    },
    token: {
      type: Object
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
      const { viewer, vueCesium, vueKey, vueIndex, czmlData } = this;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        vueCesium.CzmlManager.addSource(vueKey, vueIndex, dataSource, {
          czmlData: undefined
        });
        vm.appendCzml(vm.url);
        vm.$emit("loaded", vm);
      });
    },
    /**
     * 加载czml数据
     * @param {String} url 路径
     * @returns {CzmlDataSource} czml数据对象
     */
    appendCzml(url) {
      if (!url || url.length == 0) {
        return;
      }
      let { vueKey, vueIndex, Cesium, viewer, token } = this;
      if (token && token.value) {
        url += "?" + token.key + "=" + token.value;
      }
      const czmlData = Cesium.CzmlDataSource.load(url, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
      });
      viewer.dataSources.add(czmlData);
      vueCesium.CzmlManager.changeOptions(
        vueKey,
        vueIndex,
        "czmlData",
        czmlData
      );
      return czmlData;
    },
    unmount() {
      let { vueKey, vueIndex, viewer, vueCesium } = this;
      let find = vueCesium.CzmlManager.findSource(vueKey, vueIndex);
      let { options } = find;
      let { czmlData } = options;
      if (czmlData) {
        vueCesium.CzmlManager.changeOptions(vueKey, vueIndex, "czmlData", null);
        const dataSource = viewer.dataSources.getByName(this.name)[0];
        viewer.dataSources.remove(dataSource);
      }
      this.$emit("unload", this);
    }
  }
};
</script>

<style scoped></style>
