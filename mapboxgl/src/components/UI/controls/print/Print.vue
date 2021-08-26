<template>
  <mapgis-ui-spin :spinning="loading">
    <mapgis-ui-row class="mapgis-print-row">
      <mapgis-ui-col span="6">
        <span class="mapgis-print-title"> 主标题 </span>
      </mapgis-ui-col>
      <mapgis-ui-col span="18">
        <mapgis-ui-input v-model="info.baseinfo.title" />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row class="mapgis-print-row">
      <mapgis-ui-col span="6">
        <span class="mapgis-print-title"> 作者 </span>
      </mapgis-ui-col>
      <mapgis-ui-col span="18">
        <mapgis-ui-input v-model="info.baseinfo.author" />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row class="mapgis-print-row">
      <mapgis-ui-col span="6">
        <span class="mapgis-print-title"> 时间 </span>
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
</template>

<script>
import printCanvas from "../../../util/print/printCanvasLayout.js";

export default {
  name: "mapgis-print",
  inject: ["mapbox", "map"],
  props: {
    delay: {
      type: Boolean,
      default: false
    },
    delayTime: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      loading: false,
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
    handlePrintEnd() {
      this.loading = false;
    },
    print() {
      const vm = this;
      const { map, info, delay, delayTime } = this;
      this.loading = true;
      if (delay) {
        this.$emit("before-print", {});
        window.setTimeout(() => {
          printCanvas(map, this.handlePrintEnd, info);
        }, delayTime);
      } else {
        printCanvas(map, this.handlePrintEnd, info);
      }
    }
  }
};
</script>

<style>
.mapgis-brower-print-button {
  width: 100%;
}
.mapgis-print-row {
  padding: 4px;
}
.mapgis-print-title {
  line-height: 32px;
}
</style>
