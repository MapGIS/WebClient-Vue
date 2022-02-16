<template>
  <mapgis-ui-row class="mapgis-ui-switch-row-left">
    <div class="mapgis-ui-switch-row-left-title">{{ title }}</div>
    <div class="mapgis-ui-switch-row-left-switch">
      <mapgis-ui-switch @change="$_change" checked-children="是" un-checked-children="否"
                        v-model="valueCopy"/>
    </div>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-switch-row-left",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    title: {
      type: String
    },
    value: {
      type: Boolean
    },
    type: {
      type: String,
      default: "Text"
    }
  },
  data() {
    return {
      valueCopy: undefined
    }
  },
  watch: {
    value: {
      handler: function () {
        this.valueCopy = this.value;
      },
      deep: true
    }
  },
  methods: {
    $_change(e) {
      this.$emit("change", e);
    }
  },
  mounted() {
    this.valueCopy = this.value;
  }
}
</script>

<style scoped>
.mapgis-ui-switch-row-left {
  text-align: left;
  height: 32px;
  line-height: 32px;
}

.mapgis-ui-switch-row-left-title, .mapgis-ui-switch-row-left-switch {
  display: inline-block;
  height: inherit;
  vertical-align: top;
}

.mapgis-ui-switch-row-left-title {
  width: 90px;
  text-align: left;
  padding-left: 10px;
  font-size: 12px;
  font-weight: bolder;
}

.mapgis-ui-switch-row-left-switch {
  padding-right: 10px;
  width: calc(100% - 94px);
  text-align: right;
}
</style>