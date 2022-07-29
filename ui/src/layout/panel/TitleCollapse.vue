<template>
  <div class="mapgis-ui-title-collapse">
    <mapgis-ui-group-tab
      :title="title"
      :isTitleBold="isTitleBold"
      :hasTopMargin="hasTopMargin"
      :hasBottomMargin="hasBottomMargin"
      @click.native="changeCollapse"
    >
      <mapgis-ui-iconfont
        v-if="!innerCollapse"
        slot="front"
        type="mapgis-chevrons-up"
        class="front"
      />
      <mapgis-ui-iconfont
        v-else
        slot="front"
        type="mapgis-chevrons-down"
        class="front"
      />
    </mapgis-ui-group-tab>
    <div
      :class="{
        'mapgis-ui-title-collapse-parameter': true,
        'mapgis-ui-title-collapse-parameter-transparent': transparent
      }"
      :style="{ maxHeight: maxHeight }"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-title-collapse",
  props: {
    title: {
      type: String,
      default: "标题"
    },
    // 控制图标折叠面板默认是折叠还是展开，该参数为true时折叠
    collapse: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: "fit-content"
    },
    transparent: {
      type: Boolean,
      default: false
    },
    isTitleBold: {
      type: Boolean,
      default: true
    },
    hasTopMargin: {
      type: Boolean,
      default: true
    },
    hasBottomMargin: {
      type: Boolean,
      default: false
    },
  },
  model: {
    prop: "collapse",
    event: "change"
  },
  data() {
    return {
      maxHeight: "0px",
      innerCollapse: this.collapse
    };
  },
  watch: {
    collapse(next) {
      this.innerCollapse = next;
      const { height = "fit-content" } = this;

      if (!this.innerCollapse) {
        this.maxHeight = height;
      } else {
        this.maxHeight = "0px";
      }
    }
  },
  mounted() {
    const { height = "fit-content" } = this;
    if (!this.collapse) {
      this.maxHeight = height;
    }
  },
  methods: {
    changeCollapse() {
      const vm = this;
      this.innerCollapse = !this.innerCollapse;
      const { height = "fit-content" } = this;

      if (!vm.innerCollapse) {
        this.maxHeight = height;
      } else {
        this.maxHeight = "0px";
      }

      this.$emit("change", vm.innerCollapse);
    }
  }
};
</script>
