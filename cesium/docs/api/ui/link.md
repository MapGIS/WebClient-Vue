# 多屏联动

> mapgis-3d-link

## 属性

### `enable`

- **类型:** `Boolean`
- **非侦听属性**
- **默认值:** `false`
- **描述:**
  > 这个属性刚开始的时候只能是 false,多个场景的生命周期是不同步的。由于无法获取多个场景最后加载完毕的时刻，因此只能后面手动激活为 true。

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。
