<script>
import VueOptions from "../../Base/Vue/VueOptions";
export default {
  name: "mapgis-3d-m3d-subsection-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    url: {
      type: String,
      required: true
    },
    themeOptions: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.mount();
  },
  beforeDestroy() {
    this.unmount();
  },
  data() {
    return {
      g3dLayerIndex: undefined // g3d图层再整个viewer中的顺序
    };
  },
  watch: {
    url: {
      handler(value) {
        this.$_unmount();
        this.$_mount();
      },
      deep: true
    },
    themeOptions: {
      handler(value) {
        this.$_unmount();
        this.$_mount();
      },
      deep: true
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
      const vm = this;
      const { vueIndex, vueKey, vueCesium } = this;
      const { viewer, url, themeOptions } = this;
      let promise = this.createCesiumObject();
      promise.then(e => {
        let m3dSubSectionLayer = viewer.scene.layers.appendSceneLayer(url, {
          //设置render参数，渲染专题图
          renderer: themeOptions,
          getDocLayerIndexes: vm.getDocLayerIndexes
        });
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      const { viewer } = this;
      const { g3dLayerIndex } = this;
      if (!(typeof g3dLayerIndex === "number") || g3dLayerIndex < 0) return;
      let g3dLayer = viewer.scene.layers.getLayer(g3dLayerIndex);
      g3dLayer.remove(true);
      this.$emit("unload", { component: this });
      vueCesium.M3DSubSectionManager.deleteSource(vueKey, vueIndex);
    },
    // 图层回调解析
    getDocLayerIndexes(indexes, g3d) {
      const { vueIndex, vueKey, vueCesium, viewer } = this;
      const vm = this;
      // 该回调只触发一次
      vm.g3dLayerIndex = indexes[0];
      vueCesium.G3DManager.addSource(vueKey, vueIndex, g3d, {
        g3dLayerIndex: vm.g3dLayerIndex
      });
    }
  }
};
</script>

<style scoped></style>
