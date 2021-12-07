<template>
  <div>
    <div class="mapgis-ui-slider-title-title" :style="{paddingLeft: showTitleIcon ? '13px' : '0'}">
      {{ title }}
      <mapgis-ui-title-icon v-show="showTitleIcon"/>
    </div>
    <mapgis-ui-row>
      <mapgis-ui-col :span="16">
        <mapgis-ui-slider
            v-model="valueCopy"
            :min="0"
            :max="1"
            :step="0.01"
            class="mapgis-ui-slider-title-slider"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="8">
        <mapgis-ui-input-number
            v-model="valueCopy"
            :min="0"
            :max="1"
            :step="0.01"
            class="mapgis-ui-slider-title-input"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-slider-title",
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      valueCopy: 0
    }
  },
  props: {
    showTitleIcon: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "title"
    },
    value: {
      type: Number,
    },
  },
  watch: {
    value: {
      handler: function () {
        this.valueCopy = this.value;
      }
    },
    valueCopy: {
      handler: function () {
        this.$emit("change", this.valueCopy);
      }
    },
  },
  created() {
    this.valueCopy = this.value;
  }
}
</script>

<style scoped>
.mapgis-ui-slider-title-input {
  margin-left: -11px;
  margin-top: 4px;
}

.mapgis-ui-slider-title-slider {
  width: 140px;
  margin-left: 8px;
}

.mapgis-ui-slider-title-title {
  font-weight: bolder;
  position: relative;
  padding-left: 13px;
  margin-top: 6px;
}
</style>