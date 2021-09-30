<template>
  <div>
    <!--    <mapgis-ui-custom-panel-->
    <!--        ref="custom"-->
    <!--        style="width: 50%"-->
    <!--        :options="options"-->
    <!--        @formChanged="$_formChanged"-->
    <!--        class="theme-panel-custom"-->
    <!--        v-if="options"-->
    <!--    />-->
  </div>
</template>

<script>
export default {
  name: "mapgis-igs-theme-panel-custom",
  data() {
    return {}
  },
  props: {
    // options: {
    //   type: Object
    // }
  },
  methods: {
    $_show() {
    },
    $_close() {
    },
    $_setTitle() {
    },
    $_setDataSoure() {
    },
    $_setCheckBoxArr() {
    },
    $_setColors() {
    },
    $_setFields() {
    },
    $_setLabelFields() {
    },
    $_setField() {
    },
    $_setDataType() {
    },
    $_setIcons() {
    },
    $_setDefaultIcon() {
    },
    $_setRadiusArr() {
    },
    $_formChanged(id, value, type, extra, extra2) {
      this.$emit("formChanged", id, value, type, extra, extra2);
    }
  }
}
</script>

<style scoped>
.theme-panel-custom {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>