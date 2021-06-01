# CanvasLayer

## Props

All common [layers props](/api/Layers/README.md#props)

### `source`

- **类型:** `Object | String`
- **非侦听属性**
- **描述:** 包含 video 的数据源
- **参考:** `Video source` in [Mapbox API Docs](https://docs.mapbox.com/mapbox-gl-js/api/#videosource)

::: 提示
`coordinates` field of the `source` prop is reactive.
如果更改其值，更改将自动应用于地图。
:::

## Computed getters 计算属性

### `video`

- **描述** 返回 HTML video 元素.
- **参考** `.getVideo()` [method](https://docs.mapbox.com/mapbox-gl-js/api/#videosource#getvideo)
