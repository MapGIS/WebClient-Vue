<template>
  <mapgis-ui-modal
    title="打印设置"
    :maskClosable="maskClosable"
    v-model="visible"
    :footer="null"
    @cancel="handleClose"
  >
    <mapgis-ui-spin :spinning="loading">
      <mapgis-ui-row>
        <mapgis-ui-col span="6">
          <span> 主标题 </span>
        </mapgis-ui-col>
        <mapgis-ui-col span="18">
          <mapgis-ui-input v-model="info.baseinfo.title" />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col span="6">
          <span> 作者 </span>
        </mapgis-ui-col>
        <mapgis-ui-col span="18">
          <mapgis-ui-input v-model="info.baseinfo.author" />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col span="6">
          <span> 时间 </span>
        </mapgis-ui-col>
        <mapgis-ui-col span="18">
          <mapgis-ui-input v-model="info.baseinfo.date" />
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-divider />
      <mapgis-ui-button
        @click="print"
        class="mapgis-brower-print-button"
        type="primary"
      >
        <mapgis-ui-iconfont
          class="mapgis-ui-modal-print-toolbar"
          type="mapgis-dayinP"
        />打印出图
      </mapgis-ui-button>
    </mapgis-ui-spin>
  </mapgis-ui-modal>
</template>

<script>
import printCanvas from "../../../util/print/printCanvasLayout.js";

export default {
  name: "mapgis-print",
  inject: ["mapbox", "map"],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return {
          left: "10px",
          top: "10px"
        };
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: "visible",
    event: "change-visible"
  },
  data() {
    return {
      loading: false,
      maskClosable: false,
      info: {
        baseinfo: {
          title: "地图标题",
          author: "中地数码有限公司",
          date: new Date().toISOString()
        },
        scale: {
          domid: "mapgis-legend-rule"
        },
        legend: {
          domid: "mapgis-legend-standard"
        }
      }
    };
  },
  watch: {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("change-visible", false);
    },
    handlePrintEnd() {
      this.loading = false;
    },
    print() {
      const { map, info } = this;
      this.loading = true;
      printCanvas(map, this.handlePrintEnd, info);
    }
  }
};
</script>

<style>
.mapgis-brower-print-button {
  width: 100%;
}
</style>
