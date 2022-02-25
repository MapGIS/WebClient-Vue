# 状态栏

> mapgis-3d-statebar

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件， <br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-statebar 组件，用来区分组件的标识符。

### `frame`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **默认值:** `10`
- **描述:** 每隔`frame`帧刷新显示参数

### `bottomMap`

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:** `false`
- **描述:** 是否强制显示在地图底部

### ~~`showHpr`~~ 暂不生效

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:** `false`
- **描述:** 是否展示海拔高度

### ~~`showSelectTileInfo`~~ 暂不生效

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:** `false`
- **描述:** 是否显示瓦片信息

### ~~`showViewLevelInfo`~~ 暂不生效

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:** `false`
- **描述:** 是否显示当前级别
