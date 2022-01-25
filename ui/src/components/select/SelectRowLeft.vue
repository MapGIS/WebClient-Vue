<template>
  <mapgis-ui-row class="mapgis-ui-select-row-left">
    <div class="mapgis-ui-select-row-left-title" :style="titleStyle">{{ title }}</div>
    <div class="mapgis-ui-select-row-left-select" :style="selectStyle">
      <mapgis-ui-select style="width: 100%;" @change="$_change" :default-value="value">
        <mapgis-ui-select-option :key="index" v-for="(data,index) in dataSource" :value="data.key">
          {{ data.value }}
        </mapgis-ui-select-option>
      </mapgis-ui-select>
    </div>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-select-row-left",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    title: {
      type: String
    },
    value: {
      type: String
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
.mapgis-ui-select-row-left {
  text-align: left;
  height: 32px;
  line-height: 32px;
  margin: 10px 0;
}

.mapgis-ui-select-row-left-title, .mapgis-ui-select-row-left-select {
  display: inline-block;
  height: inherit;
  vertical-align: top;
}

.mapgis-ui-select-row-left-title {
  width: 70px;
  text-align: left;
  padding-left: 10px;
  font-size: 12px;
}

.mapgis-ui-select-row-left-select {
  padding-right: 10px;
  width: calc(100% - 74px);
}
</style>