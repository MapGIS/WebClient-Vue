# 地图对象

> mapgis-web-map

## 属性

### `mapboxGl`

- **类型**: `Object`
- **Default:** `null`
- **描述:** Mapboxgl-js implementation. Useful for lazy-loading. If omitted, VueMapbox imports Mapbox-gl-js dynamically.

### `crs`

- **类型**: `String`
- **Default**: `EPSG:3857`
- **描述:** mapbox 原生只支持 3857，但 webclient-vue-mapboxgl 基于原生基础上，实现了 4326、4490、4610 的参考系。
- **注意:** 在组件中，由于 github 的授权问题，@mapgis/mapbox 的版本最好是 mapbox1.x 的最后一个版本；而单独使用 mapboxgl，2.x 版本的 mapboxgl 支持 7 类投影方式，参考链接为： [projection](https://docs.mapbox.com/help/glossary/projection/)

### `mapStyle`

- **类型**: `String`, `Object`
- **Default:** `{ version: 8, sources: {}, layers: [{ id: "背景", type: "background", paint: {"background-color": "rgba(0, 0, 0, 1)"} }] }`
- **描述:** The map's Mapbox style. This must be an a JSON object conforming to the schema described in the Mapbox Style Specification , or a URL to such JSON.
- **查看:** `options.style` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `container`

- **类型:** `String`, `HTMLElement`
- **Default:** `#map-{random number}`
- **非侦听属性**
- **描述:** The HTML element in which Mapbox GL JS will render the map
- **查看:** `options.container` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `accessToken`

- **类型:** `String`
- **Default:** `undefined`
- **非侦听属性**
- **描述:** Token for access Mapbox map
- **查看:** [accessToken](https://docs.mapbox.com/mapbox-gl-js/api/#accesstoken)

### `minZoom`

- **类型:** `Number`
- **Default:** `0`
- **侦听属性**
- **描述:** Minimum zoom level of the map (0-24)
- **查看:** `options.minZoom` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `maxZoom`

- **类型:** `Number`
- **Default:** `22`
- **侦听属性**
- **描述:** Maximum zoom level of the map (0-24)
- **查看:** `options.maxZoom` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `hash`

- **类型:** `Boolean`
- **Default:** `false`
- **侦听属性**
- **描述:** If true, the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL
- **查看:** `options.hash` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `interactive`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If false, no mouse, touch, or keyboard listeners will be attached to the map, so it will not respond to interaction
- **查看:** `options.interactive` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `bearingSnap`

- **类型:** `Number`
- **Default:** `7`
- **非侦听属性**
- **描述:** The threshold, measured in degrees, that determines when the map's bearing will snap to north
- **查看:** `options.bearingSnap` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `attributionControl`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, an AttributionControl will be added to the map
- **查看:** `options.attributionControl` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `logoPosition`

- **类型:** `String`, `top-left`, `top-right`, `bottom-right`, `bottom-left`
- **Default:** `bottom-left`
- **非侦听属性**
- **描述:** A string representing the position of the Mapbox wordmark on the map
- **查看:** `options.logoPosition` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `failIfMajorPerformanceCaveat`

- **类型:** `Boolean`
- **Default:** `false`
- **非侦听属性**
- **描述:** If true, map creation will fail if the performance of Mapbox GL JS would be dramatically worse than expected (i.e. a software renderer would be used)
- **查看:** `options.failIfMajorPerformanceCaveat` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `crossSourceCollisions`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, symbols from multiple sources can collide with each other during collision detection. If false , collision detection is run separately for the symbols in each source.
- **查看:** `options.crossSourceCollisions` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `fadeDuration`

- **类型:** `Number`
- **Default:** `300`
- **非侦听属性**
- **描述:** Controls the duration of the fade-in/fade-out animation for label collisions, in milliseconds. This setting affects all symbol layers. This setting does not affect the duration of runtime styling transitions or raster tile cross-fading.
- **查看:** `options.fadeDuration` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `preserveDrawingBuffer`

- **类型:** `Boolean`
- **Default:** `false`
- **非侦听属性**
- **描述:** If true, the map's canvas can be exported to a PNG using map.getCanvas().toDataURL()
- **查看:** `options.preserveDrawingBuffer` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)
- **注意:** 目前可能由于浏览器原因导致该属性不论为 true 还是 false，都可以导出 PNG 图片。

### `refreshExpiredTiles`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, the map won't attempt to re-request tiles once they expire per their HTTP cacheControl / expires headers.
- **查看:** `options.refreshExpiredTiles` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `maxBounds`

- **类型:** `Array`, `LngLatBoundsLike object`
- **Default:** `undefined`
- **侦听属性**
- **描述:** If set, the map will be constrained to the given bounds
- **查看:** `options.maxBounds` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `scrollZoom`

- **类型:** `Boolean`, `Object`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, the "scroll to zoom" interaction is enabled. An Object value is passed as options to ScrollZoomHandler#enable
- **查看:** `options.scrollZoom` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `boxZoom`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, the "box zoom" interaction is enabled
- **查看:** `options.boxZoom` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `dragRotate`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, the "drag to rotate" interaction is enabled
- **查看:** `options.dragRotate` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `keyboard`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, keyboard shortcuts are enabled
- **查看:** `options.keyboard` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `doubleClickZoom`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, the "double click to zoom" interaction is enabled
- **查看:** `options.doubleClickZoom` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `touchZoomRotate`

- **类型:** `Boolean`, `Object`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, the "pinch to rotate and zoom" interaction is enabled. An Object value is passed as options to TouchZoomRotateHandler#enable
- **查看:** `options.touchZoomRotate` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `trackResize`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true, the map will automatically resize when the browser window resizes.
- **查看:** `options.trackResize` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `center`

- **类型:** `Array, LngLatLike Object`
- **Default:** `undefined`
- **侦听属性**
- **描述:** Geographical centerpoint of the map. If center is not specified in the constructor options, Mapbox GL JS will look for it in the map's style object.If it is not specified in the style, either, it will default to `[0, 0]`
- **查看:** `options.center` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `zoom`

- **类型:** `Number`
- **Default:** `undefined`
- **侦听属性**
- **描述:** Zoom level of the map. If zoom is not specified in the constructor options, Mapbox GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`
- **查看:** `options.zoom` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `bearing`

- **类型:** `Number`
- **Default:** `undefined`
- **侦听属性**
- **描述:** Bearing (rotation) of the map, measured in degrees counter-clockwise from north. If bearing is not specified in the constructor options, Mapbox GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`
- **查看:** `options.bearing` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `pitch`

- **类型:** `Number`
- **Default:** `undefined`
- **侦听属性**
- **描述:** Pitch (tilt) of the map, measured in degrees away from the plane of the screen (0-60). If pitch is not specified in the constructor options, Mapbox GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`
- **查看:** `options.pitch` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `renderWorldCopies`

- **类型:** `Boolean`
- **Default:** `true`
- **非侦听属性**
- **描述:** If true , multiple copies of the world will be rendered, when zoomed out
- **查看:** `options.renderWorldCopies` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `light`

- **类型:** `Object`
- **Default:** `undefined`
- **侦听属性**
- **描述:** Light properties. Must conform to the Mapbox Style Specification
- **查看:** See [setLight](https://docs.mapbox.com/mapbox-gl-js/api/#map#setlight) Map method

### `tileBoundaries`

- **类型:** `Boolean`
- **Default:** `false`
- **侦听属性**
- **描述:** A Boolean indicating whether the map will render an outline around each tile. These tile boundaries are useful for debugging
- **查看:** See [showTileBoundaries](https://docs.mapbox.com/mapbox-gl-js/api/#map#showtileboundaries) Map property

### `collisionBoxes`

- **类型:** `Boolean`
- **Default:** `false`
- **侦听属性**
- **描述:** A Boolean indicating whether the map will render boxes around all symbols in the data source, revealing which symbols were rendered or which were hidden due to collisions. This information is useful for debugging
- **查看:** See [showCollisionBoxes](https://docs.mapbox.com/mapbox-gl-js/api/#map#showcollisionboxes) Map property

### `repaint`

- **类型:** `Boolean`
- **Default:** `false`
- **侦听属性**
- **描述:** A Boolean indicating whether the map will continuously repaint. This information is useful for analyzing performance.
- **查看:** See [repaint](https://docs.mapbox.com/mapbox-gl-js/api/#map#repaint) Map property

### `transformRequest`

- **类型:** `Function`
- **Default:** `null`
- **非侦听属性**
- **描述:** A callback run before the Map makes a request for an external URL. The callback can be used to modify the url, set headers, or set the credentials property for cross-origin requests. Expected to return an object with a `url` property and optionally `headers` and `credentials` properties.
- **查看:** `options.transformRequest` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `localIdeographFontFamily`

- **类型:** `String`
- **Default:** `null`
- **非侦听属性**
- **描述:** If specified, defines a CSS font-family for locally overriding generation of glyphs in the 'CJK Unified Ideographs' and 'Hangul Syllables' ranges. In these ranges, font settings from the map's style will be ignored, except for font-weight keywords (light/regular/medium/bold). The purpose of this option is to avoid bandwidth-intensive glyph server requests.
- **查看:** `options.localIdeographFontFamily` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `bounds`

- **类型:** `Array`, `LngLatBoundsLike object`
- **Default:** `undefined`
- **描述:** The initial bounds of the map. If set, it overrides `center` and `zoom` construction options
- **查看:** `options.bounds` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

### `fitBoundsOptions`

- **类型:** `fitBounds object`
- **Default:** `undefined`
- **描述:** A `fitBounds` object to use only when fitting the initial `bounds` provided above
- **查看:** `options.fitBoundsOptions` in [Map](https://docs.mapbox.com/mapbox-gl-js/api/#map)

## 行为

Asynchronous actions exposed via `GlMap.actions`

::: tip
[Map-promisified](https://github.com/soal/map-promisified) is used as wrapper around Mapbox GL JS methods. That library can be used independently from VueMapbox.
:::

### `.stop(eventData?)`

- **参数:**
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Stops all animations on the map
- **Returns:** `{Promise<{ pitch, zoom, bearing, center }>}`
  Promise that resolves object with map parameters on the moment of call `stop()`

### `.panBy(offset, options?, eventData?)`

- **参数:**
  - `offset` `{Point | number[]}` x and y coordinates by which to pan the map
  - `options` `{AnimationOptions object}` animation options. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Pans the map by the specified offest
- **Returns:** `{Promise<{ center }>}`
  Promise that resolves object with new center of the map when animation ends
- **查看:** [panBy](https://docs.mapbox.com/mapbox-gl-js/api/#map#panby) Map method

### `.panTo(coordinates, options?, eventData?)`

- **参数:**
  - `coordinates` `{LngLat | number[][]}` The location to pan the map to. See also: [LngLat](https://docs.mapbox.com/mapbox-gl-js/api/#lnglat)
  - `options` `{AnimationOptions object}` animation options. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Pans the map to the specified location, with an animated transition
- **Returns:** `{Promise<{ center }>}`
  Promise that resolves object with new center of the map when animation ends
- **查看:** [panTo](https://docs.mapbox.com/mapbox-gl-js/api/#map#panto) Map method

### `.zoomTo(zoom, options?, eventData?)`

- **参数:**
  - `zoom` `{number}` The zoom level to transition to
  - `options` `{AnimationOptions object}` animation options. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Zooms the map to the specified zoom level, with an animated transition
- **Returns:** `{Promise<{ zoom }>}`
  Promise that resolves object with new zoom level of the map when animation ends
- **查看:** [zoomTo](https://docs.mapbox.com/mapbox-gl-js/api/#map#zoomto) Map method

### `.zoomIn(options?, eventData?)`

- **参数:**
  - `options` `{AnimationOptions object}` animation options. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Increases the map's zoom level by 1
- **Returns:** `{Promise<{ zoom }>}`
  Promise that resolves object with new zoom level of the map when animation ends
- **查看:** [zoomIn](https://docs.mapbox.com/mapbox-gl-js/api/#map#zoomin) Map method

### `.zoomOut(options?, eventData?)`

- **参数:**
  - `options` `{AnimationOptions object}` animation options. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Decreases the map's zoom level by 1
- **Returns:** `{Promise<{ zoom }>}`
  Promise that resolves object with new zoom level of the map when animation ends
- **查看:** [zoomOut](https://docs.mapbox.com/mapbox-gl-js/api/#map#zoomOut) Map method

### `.rotateTo(bearing, options?, eventData?)`

- **参数:**
  - `bearing` `{number}` The desired bearing
  - `options` `{AnimationOptions object}` animation options. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Rotates the map to the specified bearing, with an animated transition. The bearing is the compass direction that is \"up\"; for example, a bearing of 90° orients the map so that east is up.
- **Returns:** `{Promise<{ bearing }>}`
  Promise that resolves object with new bearing of the map when animation ends
- **查看:** [rotateTo](https://docs.mapbox.com/mapbox-gl-js/api/#map#rotateto) Map method

### `.resetNorth(options?, eventData?)`

- **参数:**
  - `options` `{AnimationOptions object}` animation options. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
- **描述:** Rotates the map so that north is up (0° bearing), with an animated transition
- **Returns:** `{Promise<{ bearing }>}`
  Promise that resolves object with new bearing of the map when animation ends
- **查看:** [resetNorth](https://docs.mapbox.com/mapbox-gl-js/api/#map#resetnorth) Map method

### `.snapToNorth(options?, eventData?)`

- **参数:**
  - `options` `{AnimationOptions object}` animation options. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Snaps the map so that north is up (0° bearing), if the current bearing is close enough to it (i.e. within the `bearingSnap` prop threshold).
- **Returns:** `{Promise<{ bearing }>}`
  Promise that resolves object with new bearing of the map when animation ends
- **查看:** [snapToNorth](https://docs.mapbox.com/mapbox-gl-js/api/#map#snaptonorth) Map method

### `.fitBounds(bounds, options?, eventData?)`

- **参数:**
  - `bounds` `{ number[][] | LngLatBounds }` Center these bounds in the viewport and use the highest zoom level up to and including `maxZoom` that fits them in the viewport
  - `options` `{Object}`
    - `options.padding?` `{number}` The amount of padding in pixels to add to the given bounds
    - `options.linear` `{boolean}` _default_: `false` If true , the map transitions using `Map#easeTo`. If false , the map transitions using `Map#flyTo`. See those functions and AnimationOptions for information about options available.
    - `options.easing?` An easing function for the animated transition. See [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)
    - `options.offset` `{ number[] | Point }` _default:_ `[0, 0]` The center of the given bounds relative to the map's center, measured in pixels
    - `options.maxZoom?` `{number}` The maximum zoom level to allow when the map view transitions to the specified bounds
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Pans and zooms the map to contain its visible area within the specified geographical bounds. This function will also reset the map's bearing to 0 if bearing is nonzero
- **Returns:** `{Promise<{ bounds }>}`
  Promise that resolves object with new bounds of the map when animation ends
- **查看:** [fitBounds](https://docs.mapbox.com/mapbox-gl-js/api/#map#fitbounds) Map method

### `.jumpTo(options, eventData?)`

- **参数:**
  - `options` `{Object}` See [CameraOptions](https://docs.mapbox.com/mapbox-gl-js/api/#cameraoptions)
    - `options.pitch?` `{number}` The desired pitch, in degrees
    - `options.zoom?` `{number}` The desired zoom level
    - `options.center?` `{number[] | LngLat}` The desired center
    - `options.bearing?` `{number}` The desired bearing, in degrees
    - `options.around?` `{number[] | LngLat}` If `zoom` is specified, `around` determines the point around which the zoom is centered.
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Changes any combination of center, zoom, bearing, and pitch, without an animated transition. The map will retain its current values for any details not specified in options
- **Returns:** `{Promise<{ pitch, zoom, center, bearing }>}`
  Promise that resolves object with new pitch, zoom, center and bearing of the map
- **查看:** [jumpTo](https://docs.mapbox.com/mapbox-gl-js/api/#map#jumpto) Map method

### `.easeTo(options, eventData?)`

- **参数:**

  - `options` `{Object}` Combination of [CameraOptions](https://docs.mapbox.com/mapbox-gl-js/api/#cameraoptions) and [AnimationOptions](https://docs.mapbox.com/mapbox-gl-js/api/#animationoptions)

    - `options.pitch?` `{number}` The desired pitch, in degrees
    - `options.zoom?` `{number}` The desired zoom level
    - `options.center?` `{number[] | LngLat}` The desired center
    - `options.bearing?` `{number}` The desired bearing, in degrees
    - `options.around?` `{number[] | LngLat}` If `zoom` is specified, `around` determines the point around which the zoom is centered.
    - `options.duration?` `{number}` The animation's duration, measured in milliseconds.
    - `options.easing?` `{Function}` A function taking a time in the range 0..1 and returning a number where 0 is the initial state and 1 is the final state.
    - `options.offset?` `{number[] | Point}` of the target center relative to real map container center at the end of animation.
    - `options.animate?` `{boolean}`: If `false`, no animation will occur

  - `eventData` `{Object}` Custom data passed to corresponfing event.

- **描述:** Changes any combination of center, zoom, bearing, and pitch, with an animated transition between old and new values. The map will retain its current values for any details not specified in `options`
- **Returns:** `{Promise<{ pitch, zoom, center, bearing }>}`
  Promise that resolves object with new pitch, zoom, center and bearing of the map
- **查看:** [easeTo](https://docs.mapbox.com/mapbox-gl-js/api/#map#easeto) Map method

### `.flyTo(options, eventData?)`

- **参数:**
  - `options` `{Object}`
    - `options.curve?` `{number}` _default_ `1.42` The zooming "curve" that will occur along the flight path. A high value maximizes zooming for an exaggerated animation, while a low value minimizes zooming for an effect closer to Map#easeTo. 1.42 is the average value selected by participants in the user study discussed in van Wijk (2003). A value of Math.pow(6, 0.25) would be equivalent to the root mean squared average velocity. A value of 1 would produce a circular motion
    - `options.minZoom?` `{number}` The zero-based zoom level at the peak of the flight path. If `options.curve` is specified, this option is ignored
    - `options.speed?` `{number}` _default_ `1.2` The average speed of the animation defined in relation to `options.curve`. A speed of 1.2 means that the map appears to move along the flight path by 1.2 times `options.curve` screenfuls every second. A screenful is the map's visible span. It does not correspond to a fixed physical distance, but varies by zoom level
    - `options.screenSpeed?` `{number}` The average speed of the animation measured in screenfuls per second, assuming a linear timing curve. If `options.speed` is specified, this option is ignored
    - `options.maxDuration?` `{number}` The animation's maximum duration, measured in milliseconds. If duration exceeds maximum duration, it resets to 0
  - `eventData` `{Object}` Custom data passed to corresponfing event.
- **描述:** Changes any combination of center, zoom, bearing, and pitch, animating the transition along a curve that evokes flight. The animation seamlessly incorporates zooming and panning to help the user maintain her bearings even after traversing a great distance
- **Returns:** `{Promise<{ pitch, zoom, center, bearing }>}`
  Promise that resolves object with new pitch, zoom, center and bearing of the map
- **查看:** [flyTo](https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto) Map method

## 事件

Payload of events contains object with properties:

- `mapboxEvent` Original Mapbox GL JS event
- `map` Current map object
- `component` Component that emits event

### `@load`

- **描述:** Fires after map fully loaded
- **Payload** `{ map, component }` `map` is Mapbox Gl JS Map object, `component` is instance of GlMap component

GlMap passes all Mapbox GL JS Map events. Full list of map events see [here](https://docs.mapbox.com/mapbox-gl-js/api/#map.event:resize)
