<template>
  <span />
</template>

<script>
import BaseDatasource from '../BaseDatasource'

export default {
  name: 'mapgis-3d-geojson-datasource',
  mixins: [BaseDatasource],
  props: {
    material: Object,
    hightligt: String,
  },
  watch: {
    heightlight (news) {
      
    }
  },
  methods: {
    async createCesiumObject () {
      const { url, options } = this
      return new Cesium.GeoJsonDataSource.load(url)
    },
    /* async */ mount () {
      const { webGlobe, datasource } = this;
      const { viewer } = webGlobe;
      const { dataSources } = viewer;
      const vm = this;
      datasource.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        vm.datasourceEntity = dataSource;
        /*         let entities = dataSource.entities.values;
                for (let i = 0; i < entities.length; i++) {
                  let entity = entities[i];
                  let name = entity.name;
                  entity.polygon.material = new Cesium.PolylineGlowMaterialProperty({
                     "color": new Cesium.Color(0, 170 / 255, 238 / 255, 1.0),
                     "glowPower": 0.1
                   });
                } */
      })
    },
    /* async */ unmount () {
      let { webGlobe, datasourceEntity } = this;
      const { viewer } = webGlobe;
      const { dataSources } = viewer;
      if (dataSources) {
        dataSources.remove(datasourceEntity, true);
      }
    }
  }
}
</script>
