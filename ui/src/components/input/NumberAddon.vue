<template>
  <span class="mapgis-ui-input-group-wrapper">
    <span class="mapgis-ui-input-wrapper mapgis-ui-input-group">
      <span class="mapgis-ui-input-group-addon" v-if="showAddonBefore">
        <slot name="addonBefore">{{addonBefore}}</slot>
      </span>
      <span class="mapgis-ui-input-affix-wrapper">
        <span class="mapgis-ui-input-prefix" v-if="showPrefix">
          <slot name="prefix">{{prefix}}</slot>
        </span>
        <mapgis-ui-input-number
          autoWidth
          v-bind="$props"
          v-on="$listeners"
        />
        <span class="mapgis-ui-input-suffix" v-if="showSuffix">
          <slot name="suffix">{{suffix}}</slot>
        </span>
      </span>
      <span class="mapgis-ui-input-group-addon" v-if="showAddonAfter">
        <slot name="addonAfter">{{addonAfter}}</slot>
      </span>
    </span>
  </span>
</template>

<script>
import { InputNumberProps } from 'ant-design-vue/es/input-number';

export default {
  name: "mapgis-ui-input-number-addon",
  inheritAttrs: false,
  props: {
    ...InputNumberProps,
    addonBefore: String,
    addonAfter: String,
    prefix: String,
    suffix: String,
  },
  methods: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {},
  computed: {
    showAddonBefore () {
      return (this.addonBefore != null && this.addonBefore != '') || (this.$slots && this.$slots.addonBefore)
    },
    showAddonAfter () {
      return (this.addonAfter != null && this.addonAfter != '') || (this.$slots && this.$slots.addonAfter)
    },
    showPrefix () {
      return (this.prefix != null && this.prefix != '') || (this.$slots && this.$slots.prefix)
    },
    showSuffix () {
      return (this.suffix != null && this.suffix != '') || (this.$slots && this.$slots.suffix)
    },
  }
};
</script>
<style scoped>
.mapgis-ui-input-affix-wrapper .mapgis-ui-input-suffix {
  right: 34px;
}
</style>>
