<template>
  <div class="mapgis-ui-tab-panel">
    <mapgis-ui-space class="mapgis-ui-tab-panel-content">
      <mapgis-ui-tooltip v-for="(t, i) in tabs" :key="i">
        <template slot="title"> {{ t.title }}</template>
        <div
          :class="{
            'mapgis-ui-tab-panel-item': true,
            'mapgis-ui-tab-panel-item-active': active == t.title
          }"
          @click="() => handleMenuClick(t)"
        >
          <mapgis-ui-iconfont :type="t.icon" />
        </div>
      </mapgis-ui-tooltip>
    </mapgis-ui-space>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-tab-panel",
  props: {
    tabs: {
      type: Array,
      required: true
    }
  },
  watch: {},
  /* model: {
    prop: "value",
    event: "change"
  }, */
  data() {
    return {
      active: undefined
    };
  },
  methods: {
    handleMenuClick(tab) {
      const { title, icon } = tab;
      this.active = title;
      this.$emit("change", tab);
    }
  }
};
</script>
