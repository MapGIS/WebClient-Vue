<template>
  <div class="mapgis-ui-select-panel">
    <mapgis-ui-row>
      <mapgis-ui-col v-bind="labelCol" class="left">
        <div class="label-sm">
          {{ label }}
        </div>
      </mapgis-ui-col>
      <mapgis-ui-col v-bind="wrapperCol" class="right-panel">
        <mapgis-ui-select
            v-model="selected"
        >
          <mapgis-ui-select-option
              v-for="item in selectOptions"
              :key="item"
          >
            {{ item }}
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
name: "mapgis-ui-select-panel",
  props:{
    label: {
      type: String,
      default: "标题"
    },
    value:{
      type: String,
      default: ""
    },
    selectOptions:{
      type:Array,
      default: () => {
        return [];
      }
    },
    labelCol: {
      type: Object,
      default: () => {
        return { span: 8 };
      }
    },
    wrapperCol: {
      type: Object,
      default: () => {
        return { span: 16 };
      }
    }
  },
  watch: {
    value(next) {
      this.selected = next;
    },
    selected(next) {
      this.$emit("change", next);
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      selected: this.value
    };
  },
  methods:{
  }
}
</script>

<style scoped>

</style>