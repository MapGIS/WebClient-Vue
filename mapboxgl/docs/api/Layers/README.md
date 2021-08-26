# 图层基础属性

## 属性

#### 属性 for Mapbox GL source

### `sourceId`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** ID of the source to add. Must not conflict with existing sources.
- **查看:** `.addSource()` [Map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#addsource)

### `source`

- **类型:** `Object | String`
- **非侦听属性** A source for layer or URL to it.
- **描述:**
- **查看:** `sources` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources)

#### 属性 for Mapbox GL layer

### `layerId`

- **类型** `String`
- **描述:** ID of the layer to add. Must not conflict with existing layers.
- **必传**
- **非侦听属性**
- **查看:** `id` in [Mapbox Layer Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-id)

### `layer`

- **类型** `String`
- **描述:** Layer configuration object.
- **必传**
- **非侦听属性**
- **查看:** `layers` in [Mapbox Layer Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers)

::: tip Reactivity
`minzoom`, `maxzoom`, `paint`, `layout` and `filter` fields of `layer` prop are reactive. If you change their value, changes automatically applied to the map.
:::

### `before`

- **类型:** `String`
- **Default:** `undefined`
- **非侦听属性**
- **描述:** The ID of an existing layer to insert the new layer before.
- **查看:** `metadata` in [Mapbox Layer Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layer-metadata)

#### 属性 for Vue-Mapbox component

### `clearSource`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If `true`, component will remove layer source from map on component destruction.

### `replaceSource`

- **类型:** `Boolean`
- **Default:** `false`
- **非侦听属性**
- **描述:** If source passed to `source` prop of layer component already added ot the map, it will be ignored and existed `source` will be used. If `replaceSource` is `true` source will be replaced with new instead.

### `replace`

- **类型:** `Boolean`
- **Default:** `false`
- **非侦听属性**
- **描述:** If `true`, replaces existing layer with same id. Otherwise, error returns.

## 计算属性

### `sourceLoaded`

- **类型** `Boolean`
- **描述** Flag that indicated if layer source already loaded.

### `mapLayer`

- **类型** `Object`
- **描述** Mapbox GL layer object.
- **查看** [`.getLayer()`](https://docs.mapbox.com/mapbox-gl-js/api/#map#getlayer) map method

### `mapSource`

- **类型** `Object`
- **描述** Source for this layer.
- **查看** [`Mapbox GL source`](https://docs.mapbox.com/mapbox-gl-js/api/#sources)

## 方法

### `.move(beforeId?)`

- **参数:**
- `beforeId` `String` The ID of an existing layer to insert the new layer before. If this argument is omitted, the layer will be appended to the end of the layers array.
- **描述** Moves a layer to a different z-position.
- **查看** [`.moveLayer()`](https://docs.mapbox.com/mapbox-gl-js/api/#map#movelayer) map method

### `.remove()`

- **描述** Removes the layer with and source assosiated with it.
- **查看** [`.removeLayer()`](https://docs.mapbox.com/mapbox-gl-js/api/#map#removelayer) map method

## 事件

Payload of events contains object with properties:

- `mapboxEvent` Original Mapbox GL JS event
- `layerId` ID of current layer
- `map` Current map object
- `component` Component that emits event

### `@mousedown`

### `@mouseup`

### `@click`

### `@dblclick`

### `@mousemove`

### `@mouseenter`

### `@mouseleave`

### `@mouseover`

### `@mouseout`

### `@contextmenu`

### `@touchstart`

### `@touchend`

### `@touchcancel`
