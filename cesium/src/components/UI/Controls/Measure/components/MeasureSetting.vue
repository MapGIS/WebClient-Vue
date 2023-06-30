<template>
  <div class="measure-3d-setting">
    <mapgis-ui-group-tab title="设置">
      <mapgis-ui-toolbar-command
        slot="handle"
        title="重置"
        icon="mapgis-redo"
        @click="onReset"
      />
    </mapgis-ui-group-tab>
    <mapgis-ui-setting-form layout="vertical">
      <mapgis-ui-form-item label="线颜色">
        <mapgis-ui-sketch-color-picker
          @input="onColorChange($event, 'lineColor')"
          :color="measureConfig.lineColor"
          :disable-alpha="false"
        />
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
  </div>
</template>
<script>
const initStyle = {
  lineColor: "#1890ff"
};

export default {
  name: "measure-3d-setting",
  props: {
    measureConfig: {
      type: Object,
      defualt: () => {}
    }
  },
  data: vm => ({
    // measureStyle: { ...initStyle }
  }),
  // watch: {
  //   measureStyle: {
  //     handler(nStyle) {
  //       this.emitStyle(nStyle);
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    measureStyle: {
      get() {
        return this.measureConfig;
      },
      set(nStyle) {
        this.$emit("measure-style-change", nStyle);
      }
    }
  },
  methods: {
    /**
     * 抛出事件
     */
    emitStyle(nStyle) {
      this.$emit("measure-style-change", nStyle);
    },
    /**
     * 重置样式
     */
    onReset() {
      this.$emit("measure-style-resize");
      // this.measureStyle = { ...initStyle };
    },
    /**
     * 颜色选择变化
     */
    onColorChange({ hex }, type) {
      // this.$set(this.measureStyle, type, hex);
      const measureStyle = JSON.parse(JSON.stringify(this.measureStyle));
      measureStyle[type] = hex;
      this.measureStyle = measureStyle;
    }
  }
};
</script>
<style lang="less" scoped></style>
