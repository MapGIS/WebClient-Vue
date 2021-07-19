<template>
  <div>
  </div>
</template>
<script>

import { getFilesByOrganization, getFileByRecycle } from "../../axios/files";


export default {
  name: "mapgis-ui-clouddisk-transform",
  data() {
    return {
      data: ReadFromCloudDisk
    };
  },
  props: {
    mode: {
      type: String,
      default: "read" // read save
    },
    isMulti: {
      type: Boolean,
      default: false
    },
    tiffListsObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {},
  watch: {
  },
  methods: {
  }
};
</script>

<style scoped>
</style>
