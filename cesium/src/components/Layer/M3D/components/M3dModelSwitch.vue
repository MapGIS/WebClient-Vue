<template>
  <div class="ysc-dynamic-layer">
    <span
      style="position: relative; left: 0px; top: -12px; border-bottom: 1px solid rgba

(165,165,165, 0.3); font-size: 14px; color: #a5a5a5"
      >请选择多模态数据</span
    >
    <mapgis-ui-col class="axis">
      <mapgis-ui-radio-group v-model="typeValue" size="small">
        <mapgis-ui-radio
          v-for="(type, index) in modelTypeList"
          :key="index"
          :value="index"
          @click="handleChange(index)"
        >
          {{ modelTypeData[type] }}
        </mapgis-ui-radio>
      </mapgis-ui-radio-group>
    </mapgis-ui-col>
  </div>
</template>
<script>
export default {
  name: "mapgis-3d-popupDyn",
  props: {
    tile: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    // this.getModelType();
  },
  components: {},
  watch: {
    /* 在模态切换后立即监听 */
    tile: {
      immediate: true,
      handler(e) {
        if (this.tile) {
          this.getModelType();
        }
      }
    }
  },
  data() {
    return {
      modelTypeList: [],
      typeValue: "",
      modelTypeData: {
        TiltPhotography: "倾斜摄影",
        PointCloud: "点云数据",
        Model: "模型数据"
      }
    };
  },
  methods: {
    getModelType() {
      /* 异步加载模态数据 */
      this.$nextTick(() => {
        if (this.tile && this.tile.tileDataInfoList) {
          this.modelTypeList = [];
          const modelList = this.tile.tileDataInfoList;
          modelList.forEach(element => {
            this.modelTypeList.push(element.dataType);
          });
        }
      });
    },
    handleChange(index) {
      /* 传递模态切换的index下标 */
      // this.callback(index);
      this.$emit("handleModel", index);
    }
  },
  destroyed() {
    this.modelTypeList = [];
  }
};
</script>
<style lang="css" scoped>
.ysc-dynamic-layer {
  position: relative;
  width: 129px;
}
</style>
