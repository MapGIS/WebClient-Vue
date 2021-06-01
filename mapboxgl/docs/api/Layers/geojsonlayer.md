# GeojsonLayer

## 属性

公共属性 [layers props](/api/Layers/README.md#props)

### `source`

- **类型:** `Object | String`
- **非侦听属性**
- **描述:** A source containing GeoJSON or URL to it.
- **查看:** `GeoJSONSource` in [Mapbox API Docs](https://docs.mapbox.com/mapbox-gl-js/api/#geojsonsource)

## 计算属性/方法

### `getSourceFeatures(filter?)`

- **参数**
  - `filter` `Array` A filter to limit query results.
- **描述:** Returns an array of GeoJSON Feature objects from assosiated source filtered by `filter`.
- **查看** `.querySourceFeatures()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#querysourcefeatures)

### `getRenderedFeatures(geometry, filter)`

- **参数**
  - `filter` `Array` A filter to limit query results.
  - `geometry` `Array | Object` The geometry of the query region.
- **描述:** Returns an array of visible GeoJSON Feature objects from assosiated source filtered by `filter`.
- **查看** `.queryRenderedFeatures()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures)

### `getClusterExpansionZoom(clusterId)`

- **参数**
  - `clusterId` `Number` The value of the cluster's cluster_id property.
- **描述:** For clustered sources, fetches the zoom at which the given cluster expands and returns `Promise` with zoom level as payload.
- **查看** `.getClusterExpansionZoom()` [GeoJSONSource method](https://docs.mapbox.com/mapbox-gl-js/api/#geojsonsource#getclusterexpansionzoom)

### `getClusterChildren(clusterId)`

- **参数**
  - `clusterId` `Number` The value of the cluster's cluster_id property.
  - `limit` `Number` The maximum number of features to return.
  - `offset` `Number` The number of features to skip (e.g. for pagination).
- **描述:** For clustered sources, fetches the original points that belong to the cluster and returns `Promise` with an `Array` of GeoJSON features as payload.
- **查看** `.getClusterChildren()` [GeoJSONSource method](https://docs.mapbox.com/mapbox-gl-js/api/#geojsonsource#getclusterchildren)

### `getClusterLeaves(clusterId, limit, offset)`

- **参数**
  - `filter` `Array` A filter to limit query results.
  - `geometry` `Array | Object` The geometry of the query region.
- **描述:** Returns `Promise` with an array of visible GeoJSON Feature objects from assosiated source filtered by `filter` in the payload.
- **查看** `.getClusterLeaves()` [GeoJSONSource method](https://docs.mapbox.com/mapbox-gl-js/api/#geojsonsource#getclusterleaves)

## 方法

### `setFeatureState(featureId, state)`

- **参数**
  - `featureId` `String | Number` Feature identifier.
  - `state` `Object` A set of key-value pairs. The values should be valid JSON types.
- **描述:** Sets the state of a feature. The state object is merged in with the existing state of the feature.
- **查看** `.setFeatureState()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#setfeaturestate)

### `getFeatureState(featureId)`

- **参数**
  - `featureId` `String | Number` Feature identifier.
- **描述:** Gets the state of a feature.
- **查看** `.getFeatureState()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#getfeaturestate)

### `removeFeatureState(featureId?, sourceLayer?, key?)`

- **参数**
  - `featureId` `String | Number` Feature identifier.
  - `sourceLayer` `string` Source layer id.
  - `key` `string` The key in the feature state to reset.
- **描述:** Removes feature state, setting it back to the default behavior. If no featureId or key is specified, removes all states of that source. If featureId is also specified, removes all keys for that feature's state. If key is also specified, removes that key from that feature's state.
- **查看** `.removeFeatureState()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#removefeaturestate)

## 事件

公共图层事件 [events](/api/Layers/#events)
