# 多屏联动
> mapgis-3d-link

## 属性

### `enable`
- **类型:** `Boolean`
- **非侦听属性**
- **默认值:** `false`
- **描述:** 
```
这个属性刚开始的时候只能是false,多个场景的生命周期是不同步的。由于无法获取多个场景最后加载完毕的时刻，因此只能后面手动激活为true。
```

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:** 
```
mapgis-web-scene组件的ID，当使用多个mapgis-web-scene组件时，需要指定该值，来唯一标识mapgis-web-scene组件，
同时mapgis-web-scene插槽中的组件也需要传入相同的vueKey，让组件知道应该作用于哪一个mapgis-web-scene。
```

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:** 
```
当mapgis-web-scene插槽中使用了多个相同组件时，例如多个mapgis-3d-igs-doc-layer组件，用来区分组件的标识符。
```
