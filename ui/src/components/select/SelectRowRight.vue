<template>
  <mapgis-ui-row class="mapgis-ui-select-row-right">
    <div class="mapgis-ui-select-row-right-title" :style="titleStyle">
      {{ title }}
    </div>
    <div class="mapgis-ui-select-row-right-select" :style="selectStyle">
      <mapgis-ui-select style="width: 100%;" @change="$_change" :value="value">
        <mapgis-ui-select-option
          :key="index"
          v-for="(data, index) in dataSource"
          :value="data.key"
        >
          {{ data.value }}
        </mapgis-ui-select-option>
      </mapgis-ui-select>
    </div>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-select-row-right",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    title: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    dataSource: {
      type: Array
    },
    titleStyle: {
      type: Object
    },
    selectStyle: {
      type: Object
    }
  },
  data() {
    return {};
  },
  watch: {
    value: {
      handler: function() {},
      deep: true
    }
  },
  methods: {
    $_change(e) {
      this.$emit("change", e);
    }
  },
  mounted() {}
};
</script>

<style scoped>
.mapgis-ui-select-row-right {
  text-align: right;
  height: 32px;
  line-height: 32px;
  margin: 8px 0;
}

.mapgis-ui-select-row-right-title,
.mapgis-ui-select-row-right-select {
  display: inline-block;
  height: inherit;
  vertical-align: top;
}

.mapgis-ui-select-row-right-title {
  width: 140px;
  text-align: left;
  padding-left: 10px;
  font-size: 14px;
  color: var(--heading-color);
}

.mapgis-ui-select-row-right-select {
  text-align: right;
  margin-right: 0;
  padding-right: 15px;
  width: calc(100% - 140px);
}
</style>
