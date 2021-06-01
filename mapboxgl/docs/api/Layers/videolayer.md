# CanvasLayer

## 属性

All common [layers props](/api/Layers/README.md#props)

### `source`

- **类型:** `Object | String`
- **非侦听属性**
- **描述:** A data source containing video.
- **查看:** `Video source` in [Mapbox API Docs](https://docs.mapbox.com/mapbox-gl-js/api/#videosource)

::: tip Reactivity
`coordinates` field of the `source` prop is reactive.
If you change it's value, changes automatically applied to the map.
:::

## 计算属性

### `video`

- **描述** Returns the HTML video element.
- **查看** `.getVideo()` [method](https://docs.mapbox.com/mapbox-gl-js/api/#videosource#getvideo)
