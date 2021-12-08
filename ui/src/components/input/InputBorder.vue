<template>
  <div>
    <div class="mapgis-ui-input-border-title" :style="{paddingLeft: showTitleIcon ? '13px' : '0'}">
      <mapgis-ui-title-icon v-show="showTitleIcon"/>
      {{ title }}
    </div>
    <div class="mapgis-ui-input-border-container">
      <mapgis-ui-input @change="$_change" :title="valueCopy" :id="id" :style="inputStyle" class="mapgis-ui-input-border"
                       v-model="valueCopy" :placeholder="placeholder"/>
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
    showTitleIcon: {
      type: Boolean,
      default: true
    },
    enableWatchValue: {
      type: Boolean,
      default: true
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
        if (this.enableWatchValue) {
          this.$emit("change", this.valueCopy);
        }
      },
      deep: true
    }
  },
  created() {
    this.valueCopy = this.value;
  },
  mounted() {
    this.valueCopy = this.value;
  },
  methods: {
    $_change(e) {
      if (this.enableWatchValue) {
        if (!(e instanceof Object)) {
          this.$emit("change", e);
        }
      } else {
        this.$emit("change", e.target.value);
      }
    },
    setValue(value) {
      this.valueCopy = value;
    },
  }
}
</script>

<style scoped>
.mapgis-ui-input-border-title {
  font-weight: bolder;
  margin-bottom: 2px;
  padding-left: 12px;
}

.mapgis-ui-input-border-container {
  position: relative;
  width: 98%;
  min-height: 54px;
  border-radius: 3px;
  text-align: center;
  padding: 10px;
  padding-left: 0;
  padding-right: 1px;
}
</style>