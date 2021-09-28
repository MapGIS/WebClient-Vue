<template>
  <div>
    <mapgis-igs-theme-panel-custom
        ref="themePanel"
        :options="optionsCopy"
        v-show="showPanel"
        @formChanged="$_formChanged"
    />
    <mapgis-inspect
        :showMapPopupOnHover=true
        :showInspectMapPopupOnHover=true
        :fields="popUpFields"
    />
  </div>
</template>

<script>
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-igs-theme-layer-custom",
  mixins: [BaseLayer],
  props: {
    popUpFields: {
      type: Array
    },
    showPanel: {
      type: Boolean,
      default: true
    },
    defaultIcon: {
      type: String,
      default: "useDefault"
    }
  },
  data() {
    return {
      optionsCopy: undefined,
      themePropsCopy: undefined
    }
  },
  created() {
    this.panelType = "custom";
  },
  mounted() {
    this.themePropsCopy = JSON.parse(JSON.stringify(this.themeProps));
  },
  methods: {
    $_formChanged(id, value, type, extra, extra2) {
      if (type === "MapgisUiThemeListCheckBox") {
        this.$_checked(extra, value, extra2);
      }else if (type === "MapgisUiThemeListColor") {
        this.$_colorChanged(value, id);
      }else {
        this["$_" + id + "Changed"](value);
      }
    }
  }
}
</script>

<style scoped>

</style>