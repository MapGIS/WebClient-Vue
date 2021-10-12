# 地图控件

## 属性组件

> mapgis-attribution

属性组件可以显示地图属性信息

### 属性

### `position`

- **类型:** `String`
- **Default:** `top-right`
- **非侦听属性**
- **描述:** 地图属性信息所在位置

### `compact`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true force a compact attribution
- **查看:** `options.compact` in [AttributionControl](https://docs.mapbox.com/mapbox-gl-js/api/#attributioncontrol)

### `customAttribution`

- **类型:** `string, Array<string>?`
- **Default:** `undefined`
- **非侦听属性**
- **描述:** String or strings to show in addition to any other attributions.
- **查看:** `options.customAttribution` in [AttributionControl](https://docs.mapbox.com/mapbox-gl-js/api/#attributioncontrol)

## 全屏组件

> mapgis-fullscreen

全屏组件会在地图上创建一个按钮来触发全屏模式。

### 属性

### `container`

- **类型:** `HTMLElement`
- **非侦听属性**
- **描述:** DOM element which should be made full screen. By default, the map container element will be made full screen.
- **查看:** `options.container` in [FullscreenControl](https://docs.mapbox.com/mapbox-gl-js/api/#fullscreencontrol)

## 地址组件

> mapgis-geolocate

地址组件提供一个使用浏览器定位 API 的按钮来为用户在地图上定位。

### 属性

### `positionOptions`

- **类型:** `Object`
- **Default:** `{ enableHighAccuracy: false, timeout: 6000}`
- **非侦听属性**
- **描述:** A Geolocation API PositionOptions object.
- **查看:** `options.positionOptions` in [GeolocateControl](https://docs.mapbox.com/mapbox-gl-js/api/#geolocatecontrol)

### `fitBoundsOptions`

- **类型:** `Object`
- **Default:** `{ maxZoom:15 }`
- **非侦听属性**
- **描述:** A fitBounds options object to use when the map is panned and zoomed to the user's location.
- **查看:** `options.fitBoundsOptions` in [GeolocateControl](https://docs.mapbox.com/mapbox-gl-js/api/#geolocatecontrol)

### `trackUserLocation`

- **类型:** `Boolean`
- **Default:** `false`
- **非侦听属性**
- **描述:** If true the Geolocate Control becomes a toggle button and when active the map will receive updates to the user's location as it changes.to the user's location.
- **查看:** `options.trackUserLocation` in [GeolocateControl](https://docs.mapbox.com/mapbox-gl-js/api/#geolocatecontrol)

### `showUserLocation`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** By default a dot will be shown on the map at the user's location. Set to false to disable.
- **查看:** `options.showUserLocation` in [GeolocateControl](https://docs.mapbox.com/mapbox-gl-js/api/#geolocatecontrol)

### 方法

### `.trigger()`

- **描述:** Trigger a geolocation
- **Returns:** `boolean`
- **查看:** [trigger](https://docs.mapbox.com/mapbox-gl-js/api/#geolocatecontrol#trigger) GeolocateControl method

## 导航组件

> mapgis-navigation

### 属性

### `showCompass`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true the compass button is included.
- **查看:** `options.showCompass` in [NavigationControl](https://docs.mapbox.com/mapbox-gl-js/api/#navigationcontrol)

### `showZoom`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true the zoom-in and zoom-out buttons are included.
- **查看:** `options.showZoom` in [NavigationControl](https://docs.mapbox.com/mapbox-gl-js/api/#navigationcontrol)

## 比例尺组件

> mapgis-scale

### 属性

### `maxWidth`

- **类型:** `Number`
- **Default:** `100`
- **非侦听属性**
- **描述:** The maximum length of the scale control in pixels.
- **查看:** `options.maxWidth` in [ScaleControl](https://docs.mapbox.com/mapbox-gl-js/api/#scalecontrol)

### `unit`

- **类型:** `String, "imperial" | "metric" | "nautical"`
- **Default:** `metric`
- **非侦听属性**
- **描述:** Unit of the distance
- **查看:** `options.unit` in [ScaleControl](https://docs.mapbox.com/mapbox-gl-js/api/#scalecontrol)
