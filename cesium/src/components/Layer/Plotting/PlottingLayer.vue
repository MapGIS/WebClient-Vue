<template>
  <div>
    <panel-one
        @chooseTool="$_chooseTool"
    />
    <edit-panel
        :show="showEditPanel"
        :editOptions="toolOptions"
    />
  </div>
</template>

<script>
import PanelOne from "./PanelOne"
import EditPanel from "./EditPanel"
import editOptions from "./panelOptions";

export default {
  name: "mapgis-3d-plotting-layer",
  components: {
    "panel-one": PanelOne,
    "edit-panel": EditPanel,
  },
  data() {
    return {
      editOptions: editOptions,
      toolOptions: undefined,
      showEditPanel: false
    }
  },
  mounted() {},
  methods: {
    $_chooseTool(tool) {
      this.showEditPanel = true;
      this.toolOptions = this.editOptions[tool];
    }
  }
}
</script>

<style scoped>

</style>