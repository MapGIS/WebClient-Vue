<template>
  <viewer
    :options="options"
    :images="images"
    @inited="inited"
    class="viewer"
    ref="viewer"
  >
    <template slot-scope="scope">
      <div class="screenshot-body" v-show="showScreenshot">
        <div class="screenshot-content" v-for="src in scope.images" :key="src">
          <img class="screenshot" :src="src" />
        </div>
      </div>
    </template>
  </viewer>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer/src/component.vue";
import options from "./options.js";
export default {
  name: "mapgis-ui-picture-viewer",
  components: {
    Viewer
  },
  props: {
    // 配置信息
    options: {
      type: Object,
      default: () => options
    },
    // 预览图片列表
    images: {
      type: Array,
      defualt: () => []
    },
    // 预览images数组中图片下标，默认第一张
    showIndex: {
      type: Number,
      defualt: 0
    },
    // 是否展示缩略图
    showScreenshot: {
      type: Boolean,
      defualt: false
    },
    // 是否自动开启预览,即images传入值则展示，可与showIndex联合使用
    autoOpenPreview: {
      type: Boolean,
      defualt: false
    }
  },

  data() {
    return {};
  },
  watch: {
    images: {
      deep: true,
      handler(val) {
        if (val && this.autoOpenPreview) {
          setTimeout(() => {
            this.show(this.showIndex);
          }, 500);
        }
      }
    }
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
      this.$emit("previewViewer", viewer);
    },
    show(index = 0) {
      //调用$viewer的show方法，默认显示第一张图片
      // this.$viewer.show()
      //如果需要指定显示某一张图片使用view方法，index是指定的那张图片所在数组的位置索引
      this.$viewer.view(index);
    }
  }
};
</script>

<style lang="scss" scoped>
.screenshot-body {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  .screenshot-content {
    display: flex;
    justify-content: center;
    justify-items: center;
    margin: 4px;
    width: 240px;
    height: 140px;
    .screenshot {
      max-width: 240px;
      max-height: 140px;
    }
  }
}
</style>
