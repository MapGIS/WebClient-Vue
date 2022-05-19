<template>
  <div class="mapgis-ui-title-collapse">
    <mapgis-ui-group-tab :title="title" :isTitleBold="isTitleBold" :hasTopMargin="hasTopMargin" :hasBottomMargin="hasBottomMargin">
      <mapgis-ui-iconfont
        v-if="!innerCollapse"
        slot="front"
        type="mapgis-chevrons-up"
        @click="changeCollapse"
        class="front"
      />
      <mapgis-ui-iconfont
        v-else
        slot="front"
        type="mapgis-chevrons-down"
        @click="changeCollapse"
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
      maxHeight: 40,
      innerCollapse: this.collapse
    };
  },
  watch: {
    collapse(next) {
      this.innerCollapse = next;
    }
  },
  mounted() {
    const { height = "fit-content" } = this;
    if (!this.collapse) {
      this.maxHeight = height;
    }
  },
  methods: {
    changeCollapse () {
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