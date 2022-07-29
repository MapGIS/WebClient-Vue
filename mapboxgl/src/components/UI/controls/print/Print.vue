<template>
  <mapgis-ui-spin :spinning="loading">
    <mapgis-ui-form :layout="layout">
      <mapgis-ui-form-item label="主标题" >
        <mapgis-ui-input v-model="info.baseinfo.title" />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="作者" >
        <mapgis-ui-input v-model="info.baseinfo.author" />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="时间" >
        <mapgis-ui-input v-model="info.baseinfo.date" />
      </mapgis-ui-form-item>
    </mapgis-ui-form>
    <mapgis-ui-setting-footer>
      <div class="mapgis-brower-print-button">
      <mapgis-ui-button type="primary" @click="print" class="mapgis-brower-print-button">
        <mapgis-ui-iconfont
          class="mapgis-ui-modal-print-toolbar"
          type="mapgis-dayinP"
        />打印出图
      </mapgis-ui-button>
      </div>
		</mapgis-ui-setting-footer>
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
      default: false,
    },
    delayTime: {
      type: Number,
      default: 1000,
    },
		layout: {
			type: String,
			default: "vertical" // 'horizontal' 'vertical' 'inline'
		},
  },
  data() {
    return {
      loading: false,
      info: {
        baseinfo: {
          title: "地图标题",
          author: "中地数码有限公司",
          date: new Date().toISOString(),
        },
        scale: {
          domid: "mapgis-legend-rule",
        },
        legend: {
          domid: "mapgis-legend-standard",
        },
      },
    };
  },
  watch: {},
  mounted() {},
  methods: {
    handlePrintEnd() {
      debugger;
      this.$emit("after-print", {});
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
    },
  },
};
</script>

<style scoped>
.mapgis-ui-form-item{
  margin-bottom: 0;
}
.mapgis-ui-setting-footer .mapgis-ui-btn {
  margin-right: 0;
}

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
