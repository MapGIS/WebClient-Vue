<template>
  <div style="margin: 5px;">
    <div style="display: flex;">
      <mapgis-ui-space style="flex: 1">
        <mapgis-ui-row>
          <label>图层名称</label>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-input
            v-model="name"
            placeholder="图层名称"
          ></mapgis-ui-input>
        </mapgis-ui-row>
      </mapgis-ui-space>
    </div>
    <div class="control-button-container">
      <mapgis-ui-button class="control-button" @click="onAddCancel">
        取消
      </mapgis-ui-button>
      <mapgis-ui-button
        class="control-button"
        :disabled="okButtonDisabled"
        @click="onAddOk"
      >
        确定
      </mapgis-ui-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "edit-layer-name",
  props: {
    visible: Boolean,
    selectOptions: {
      type: Array,
      default: () => []
    },
    editLayerName: {
      type: String,
      default: ""
    }
  },
  computed: {
    okButtonDisabled() {
      return (
        !this.name.length ||
        this.selectOptions.some(option => option.name === this.name)
      );
    }
  },
  watch: {
    editLayerName: {
      handler() {
        this.name = this.editLayerName;
      },
      immediate: true
    }
  },
  data() {
    return {
      name: ""
    };
  },
  methods: {
    onAddCancel() {
      this.$emit("finished");
    },
    onAddOk() {
      this.$emit("edited", this.name);
      this.$emit("finished");
      this.name = "";
    }
  }
};
</script>

<style lang="less">
.control-button-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  padding-top: 5px;
  &:last-child {
    margin-bottom: 0;
  }
  .control-button {
    width: calc(~"50% - 2.5px");
  }
}
</style>
