<template>
  <div>
    <mapgis-ui-row style="width: 100%">
      <mapgis-ui-col span="6" class="mapgis-ui-input-border-title" :style="{paddingLeft: showTitleIcon ? '13px' : '0'}">
        <mapgis-ui-title-icon v-show="showTitleIcon"/>
        {{ title }}
      </mapgis-ui-col>
      <mapgis-ui-col span="18" class="mapgis-ui-input-border-container">
        <mapgis-ui-input v-if="type === 'text'" @change="$_change" :title="valueCopy" :id="id" class="mapgis-ui-input-border"
                         v-model="valueCopy" :placeholder="placeholder"/>
        <mapgis-ui-input-number v-if="type === 'number'" @change="$_change" :title="String(valueCopy)" :id="id" class="mapgis-ui-input-border"
                                v-model="valueCopy" :placeholder="placeholder"/>
        <!--      <mapgis-ui-textarea contenteditable="true" :id="id" :style="inputStyle" class="mapgis-ui-input-textarea" v-model="valueCopy" :placeholder="placeholder"/>-->
      </mapgis-ui-col>
    </mapgis-ui-row>
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
    type: {
      type: String,
      default: "text"
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
.mapgis-ui-input-border {
  /*width: 100%;*/
}
.mapgis-ui-input-border-title {
  font-weight: bolder;
  margin-bottom: 2px;
  padding-left: 16px;
  text-align: left;
  height: 40px;
  line-height: 40px;
}

.mapgis-ui-input-border-container {
  position: relative;
  border-radius: 3px;
  text-align: center;
  padding: 5px;
  padding-left: 0;
  padding-right: 1px;
  width: 178px;
  margin-left: 11px;
}
</style>