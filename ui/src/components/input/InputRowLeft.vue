<template>
  <mapgis-ui-row class="mapgis-ui-input-row-left">
    <div class="mapgis-ui-input-row-left-title"
         :style="{paddingLeft: paddingLeft, fontSize: fontSize}"
    >
      {{ title }}
    </div>
    <div class="mapgis-ui-input-row-left-input"
         :style="{paddingRight: paddingRight, marginLeft: marginLeft, width: enableButton ? 'calc(100% - 156px)' : 'calc(100% - 85px)'}"
    >
      <mapgis-ui-input style="width: 100%" @change="$_change" v-model="valueCopy" v-if="type === 'Text'"/>
      <mapgis-ui-input-number style="width: 100%" @change="$_change" v-model="valueCopy" v-if="type === 'Number'"/>
    </div>
    <mapgis-ui-button v-if="enableButton" type="primary" @click="$_finish">完成</mapgis-ui-button>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-input-row-left",
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
    },
    fontSize: {
      type: String,
      default: "12px"
    },
    paddingLeft: {
      type: String,
      default: "10px"
    },
    paddingRight: {
      type: String,
      default: "0"
    },
    inputWidth: {
      type: String,
      default: "10px"
    },
    enableButton: {
      type: Boolean,
      default: false
    },
    marginLeft: {
      type: String,
      default: "0"
    },
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
  methods: {
    $_change(e) {
      let value;
      if(!e){
        value = 0;
        this.valueCopy = 0;
      }else if (typeof e === "object") {
        value = e.target.value;
      } else {
        value = Number(e);
      }
      this.$emit("change", value);
    },
    $_finish() {
      this.$emit("finish");
    }
  },
  mounted() {
    this.valueCopy = this.value;
  }
}
</script>

<style scoped>
.mapgis-ui-input-row-left {
  text-align: left;
  height: 32px;
  line-height: 32px;
  margin: 10px 0;
}

.mapgis-ui-input-row-left-title, .mapgis-ui-input-row-left-input {
  display: inline-block;
  height: inherit;
  vertical-align: top;
}

.mapgis-ui-input-row-left-title {
  width: 70px;
  text-align: left;
  font-size: 12px;
  font-weight: bolder;
}

.mapgis-ui-input-row-left-input {
}
</style>