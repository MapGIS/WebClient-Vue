<template>
  <colorPicker
    v-model="color"
    :disabled="disabled"
    :defaultColor="defaultColor"
  />
</template>

<script>
export default {
  name: "mapgis-ui-color-picker",
  props: {
    value: {
      type: String,
      default: '#ff0000'
    },
    disabled:{
      type: Boolean,
      default: false
    },
    defaultColor: {
      type: String,
      // default: '#ff0000'
    },
  },
  methods: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    color: {
      get: function () {
        return this.defaultColor || this.value
      },
      set: function (newValue) {
        this.$emit('change', newValue)
      }
    }
  }
};
</script>
