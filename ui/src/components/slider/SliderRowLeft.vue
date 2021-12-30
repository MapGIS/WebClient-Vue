<template>
  <mapgis-ui-row class="mapgis-ui-slider-row-left">
    <div class="mapgis-ui-slider-row-left-title">{{ title }}</div>
    <div class="mapgis-ui-slider-row-left-container">
      <mapgis-ui-slider
        class="mapgis-ui-slider-row-left-slider"
        v-model="valueCopy"
      />
      <mapgis-ui-input-number
        class="mapgis-ui-slider-row-left-input"
        v-model="valueCopy"
      />
    </div>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-slider-row-left",
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
    },
    valueCopy: {
      handler: function () {
        this.$emit("change", this.valueCopy);
      },
      deep: true
    }
  },
  mounted() {
    this.valueCopy = this.value;
  }
}
</script>

<style scoped>
.mapgis-ui-slider-row-left {
  text-align: left;
  height: 32px;
  line-height: 32px;
  margin: 10px 0;
}

.mapgis-ui-slider-row-left-title, .mapgis-ui-slider-row-left-container {
  display: inline-block;
  height: inherit;
  vertical-align: top;
}

.mapgis-ui-slider-row-left-title {
  width: 70px;
  text-align: left;
  padding-left: 10px;
  font-size: 12px;
  font-weight: bolder;
}

.mapgis-ui-slider-row-left-container {
  padding-right: 10px;
  width: calc(100% - 70px);
}

.mapgis-ui-slider-row-left-slider {
  width: calc(100% - 92px);
  margin-top: 11px;
  display: inline-block;
  vertical-align: middle;
}

.mapgis-ui-slider-row-left-input {
  width: 70px;
  margin-left: 10px;
  display: inline-block;
  vertical-align: middle;
}
</style>