<template>
  <div>
    <mapgis-marker
      v-for="(f,i) in features"
      :key="i"
      :coordinates="f.coordinates"
    />
  </div>
</template>

<script>
import MapgisMarker from '../../UI/Marker';
import { OGC } from "@mapgis/webclient-es6-service";

export default {
  name: "mapgis-ogc-wfs-layer",
  mixins: [],
  components: { MapgisMarker },
  props: {
    url: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: '1.1.0'
    },
    typename: {
      type: String,
      default: ''
    },
    outputFormat: {
      type: String,
      // default: 'geojson'
    },
    srsname: {
      type: String,
      default: 'EPSG:4326'
    },
    bbox: {
      type: String,
    },
    maxFeatures: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      features: []
    }
  },
  watch: {},
  mounted () {
    this.$_init();
  },
  methods: {
    async $_init () {
      const wfs = new OGC.WFS(this.$props);
      let json = await wfs.getCapabilities();
      let result = await wfs.getFeature();
      this.features = result;
    },
  },
};
</script>