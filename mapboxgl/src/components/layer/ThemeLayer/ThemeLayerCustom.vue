<template>
  <div>
    <mapgis-igs-theme-panel-custom
        ref="themePanel"
        :options="optionsCopy"
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
    }
  },
  data() {
    return {
      optionsCopy: undefined
    }
  },
  created() {
    this.panelType = "custom";
  },
  mounted() {
  },
  methods: {
    $_formChanged(id, value, type, extra, extra2) {
      if (type === "MapgisUiThemeListCheckBox") {
        this.$_checked(extra, value, extra2);
      }else if (type === "MapgisUiThemeListColor") {
        console.log("---id, value",id, value)
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