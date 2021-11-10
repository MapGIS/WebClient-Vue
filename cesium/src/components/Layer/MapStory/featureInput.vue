<template>
  <div class="mapgis-feature-input-container">
    <mapgis-ui-input :style="inputStyle" class="mapgis-feature-input" v-model="value" :placeholder="placeholder"/>
    <div class="mapgis-feature-input-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: "featureInput",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    title: {
      type: String,
      default: "title"
    },
    placeholder: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    inputStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style scoped>
.mapgis-feature-input-container {
  position: relative;
  width: auto;
  height: auto;
}

.mapgis-feature-input {
  width: 344px;
  height: 54px;
  background: rgba(0, 0, 0, 0);
  border-color: rgb(95, 99, 104);
  color: #e8eaed;
  font-size: 18px;
  padding-left: 14px;
}

.mapgis-feature-input-title {
  position: absolute;
  top: -10px;
  left: 40px;
  color: #e8eaed;
  background: rgb(32, 33, 36);
  padding: 0 10px;
}
</style>