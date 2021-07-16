<template>
  <div>
    <mapgis-3d-mix-vector
        :active-circle="activeCircle"
        :active-legend="activelegend"
        :options="options"
        :radius="radius"
        :rule-json="ruleJson"
        :vector-url="geoJson"
        :vue-index="vueIndex">
    </mapgis-3d-mix-vector>
    <mapgis-3d-component-legend
        :geo-json="geoJson"
        :rule-json="ruleJson"
        :vue-index="vueIndex"
        class="legend"
        v-on:colorChange="tabChange">
    </mapgis-3d-component-legend>
  </div>
</template>

<script>
import Mapgis3dMixVector from './GeojsonCom';
import Mapgis3dComponentLegend from './Legend';

export default {
  name: "mapgis-3d-mix-component",
  components: {
    Mapgis3dMixVector, Mapgis3dComponentLegend
  },
  props: {
    ruleJson: {type: Object},
    geoJson: {type: Object},
    vueKey: {type: String, default: "default"},
    vueIndex: {
      type: String | Number,
      default: (Math.random() * 10000).toFixed(0)
    },
    options: {type: Object},
    activeCircle: {type: Boolean, default: true},
    radius: {type: Number, default: 1}
  },
  data() {
    return {
      activelegend: []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    tabChange(data) {
      this.activelegend = data;
    },
  }
}
</script>

<style scoped>
.legend {
  position: absolute;
  left: 10px;
  top: 10px;
  width: calc(40vw);
  height: calc(65vh);
}
</style>