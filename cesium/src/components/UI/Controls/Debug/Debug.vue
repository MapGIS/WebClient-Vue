<template>
  <span />
</template>

<script>
export default {
  name: "mapgis-3d-debug",
  inject: ["viewer", "Cesium", "vueCesium"],
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    createCesiumObject() {
      return new Promise(
        (resolve) => {
          resolve();
        },
        (reject) => {}
      );
    },
    mount() {
      const { viewer } = this;
      let promise = this.createCesiumObject();
      const vm = this;
      promise.then(() => {
        viewer.scene.debugShowFramesPerSecond = true;
        vm.$emit("load", { component: vm });
      });
    },
    unmount() {
      const { viewer } = this;
      viewer.scene.debugShowFramesPerSecond = false;
    },
  },
};
</script>