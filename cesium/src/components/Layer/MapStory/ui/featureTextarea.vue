<template>
  <div>
    <div v-if="hasToolBar" class="mapgis-feature-textarea-head">
      <feature-icon :containerStyle="containerStyle" type="fontSize"/>
      <feature-icon :containerStyle="containerStyle" type="fontWeight"/>
      <feature-icon :containerStyle="containerStyle" type="italic"/>
      <feature-icon :containerStyle="containerStyle" type="link"/>
      <feature-icon :containerStyle="containerStyle" type="textAlign"/>
      <feature-icon :containerStyle="containerStyle" type="removeStyle"/>
      <feature-icon :containerStyle="containerStyle" type="more"/>
    </div>
    <mapgis-ui-textarea :style="textareaStyle" :class="{mapgisInputNoTool: !hasToolBar}" :placeholder="placeholder"
                        class="mapgis-feature-textarea" v-model="valueCopy"/>
  </div>
</template>

<script>
import featureIcon from "../img/svgIcon";

export default {
  name: "featureTextarea",
  components: {
    "feature-icon": featureIcon,
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      valueCopy: undefined,
      containerStyle: {
        height: "40px",
        lineHeight: "60px",
        width: "46px",
        paddingLeft: "6px"
      }
    }
  },
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String
    },
    hasToolBar: {
      type: Boolean,
      default: true
    },
    textareaStyle: {
      type: Object,
      default() {
        return {}
      }
    }
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
    }
  },
  created() {
    this.valueCopy = this.value;
  }
}
</script>

<style scoped>
.mapgis-feature-textarea {
  width: 340px;
  height: 92px;
  margin: 0 auto;
  background: rgb(32, 33, 36);
  border: 1px solid rgb(95, 99, 104);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  color: #e8eaed;
}

.mapgis-feature-textarea-head {
  width: 340px;
  height: 48px;
  text-align: left;
  background: rgb(40, 41, 44);
  border: 1px solid rgb(95, 99, 104);
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin: 0 auto;
  padding-left: 10px;
}

.mapgisInputNoTool {
  border-radius: 4px;
}
</style>