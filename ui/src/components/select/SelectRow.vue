<template>
  <div>
    <mapgis-ui-row>
      <mapgis-ui-col span="12" class="mapgis-ui-select-row-title">
        {{ title }}
      </mapgis-ui-col>
      <mapgis-ui-col span="12">
        <mapgis-ui-select class="mapgis-ui-select-row-select" @change="$_change" :default-value="defaultValue" style="width: 120px">
          <mapgis-ui-select-option :key="index" v-for="(data,index) in dataSource" :value="data.key">
            {{ data.value }}
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-select-row",
  props: {
    title: {
      type: String
    },
    defaultValue: {
      type: String
    },
    dataSource: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    $_change(e) {
      this.$emit("change", e);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-select-row-title {
  font-weight: bolder;
  line-height: 30px;
}

.mapgis-ui-select-row-select {
  margin-left: 3px;
}
</style>