<template>
  <span />
</template>

<script>
import BaseDatasource from '../BaseDatasource'
import CzmlOptions from './CzmlOptions'

export default {
  name: 'mapgis-3d-czml-datasource',
  mixins: [BaseDatasource],
  props: {
    ...CzmlOptions,
  },
  methods: {
    async createCesiumObject () {
      const { $props, url } = this
      return new Cesium.CzmlDataSource.load(url)
    }
  }
}
</script>
