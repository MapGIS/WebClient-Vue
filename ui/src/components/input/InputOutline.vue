<template>
  <div class="mapgis-ui-input-outline-container">
    <mapgis-ui-input :id="id" :style="inputStyle" class="mapgis-ui-input-outline" v-model="valueCopy" :placeholder="placeholder"/>
    <div class="mapgis-ui-input-outline-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-input-outline",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    title: {
      type: String,
      default: "title"
    },
    id: {
      type: String
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
  created() {
    this.valueCopy = this.value;
  }
}
</script>

<style scoped>
.mapgis-ui-input-outline-container {
  position: relative;
  width: 100%;
  height: auto;
  text-align: center;
}

.mapgis-ui-input-outline {
  width: 100%;
  height: 54px;
  border-color: rgb(95, 99, 104);
  font-size: 18px;
  padding-left: 14px;
}

.mapgis-ui-input-outline-title {
  position: absolute;
  top: -10px;
  left: 40px;
  padding: 0 10px;
}
</style>