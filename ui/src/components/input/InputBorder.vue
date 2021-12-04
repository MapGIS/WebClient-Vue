<template>
  <div>
    <div class="mapgis-ui-input-border-title">
      <mapgis-ui-title-icon/>
      {{ title }}
    </div>
    <div class="mapgis-ui-input-border-container">
      <mapgis-ui-input :title="valueCopy" :id="id" :style="inputStyle" class="mapgis-ui-input-border" v-model="valueCopy" :placeholder="placeholder"/>
<!--      <mapgis-ui-textarea contenteditable="true" :id="id" :style="inputStyle" class="mapgis-ui-input-textarea" v-model="valueCopy" :placeholder="placeholder"/>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-input-border",
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
.mapgis-ui-input-border-title {
  margin-bottom: 4px;
  padding-left: 12px;
}

.mapgis-ui-input-border-container {
  position: relative;
  width: 100%;
  min-height: 54px;
  background: #F1F1F1;
  border-radius: 3px;
  text-align: center;
  padding: 10px;
}

.mapgis-ui-input-textarea {
  height:100%;
  overflow-y:hidden;
  word-break:break-all;
  word-wrap:break-word;
}
</style>