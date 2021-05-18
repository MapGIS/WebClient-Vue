<template>
  <div>
    <feature-table ref="table" v-bind:MapUrl="MapUrl"></feature-table>
  </div>
</template>

<script>
// import FeatureTable from "../../mapboxgl/src/components/UI/FeatureTable";
import MapgisWebMap from "../../mapboxgl/src/components/map/GlMap.vue";
export default {
  name: "FeatureTableExample",
  components:{/* FeatureTable, */MapgisWebMap},
  data(){
    return {
      MapUrl:"http://localhost:6163/igs/rest/mrms/docs/wuhan_WFS_4326"
    }
  },
  mounted() {
    console.log("this.$refs",this.$refs)
  }
}
</script>

<style scoped>

</style>