# 气泡
> mapgis-3d-popup

## 属性
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

### `position`

- ***类型**: `Object`
- **必传**
- **侦听属性** watch 属性
- **默认值**
  ```js
  {
   entity: Cesium.Entity,
   cartesian: Cesium.Cartesian3,
   longitude: 110,
   latitude: 30,
   height: 0
  }
  ```
- - **描述** 显示位置，3 种不同的传参使用方式
    1. Cesium.Entity 绑定到 Cesium.Entity 上鼠标点击/移入弹出，鼠标移出消失
    2. Cesium.Cartesian3 绑定到 Cesium.Cartesian3 笛卡尔坐标上
    3. Cesium.long lat height 绑定到经纬度和高度上

### `options`

- ***类型**: `Object`
- **非侦听属性** 非 watch 属性
- **默认值**
  ```js
  {
   postRender: true, // 实时渲染
   popupId: 'xxx-xx', // 本次popup对应的唯一id,不传随机生成
   popupContentId: 'xxx-xx', // 本次popup对应的唯一内容id
   showClose: true,  // 是否显示关闭按钮
  }
  ```
- - **描述** 额外参数

### `container`

- ***类型**: `String`
- **非侦听属性** 非 watch 属性
- **默认值** `<div>空</div>`
- - **描述** 外部传入的 div 的字符串描述方式，一般是文字或者 echarts 的 div;

### `visible`

- ***类型**: `Boolean`
- **v-Model属性** 双向属性
- **侦听属性** watch 属性
- **默认值** `true`
- - **描述** 是否显示
  
### `destroyOnClose`

- ***类型**: `Boolean`
- **非侦听属性**
- **默认值** `false`
- - **描述** 关闭popup的时候销毁Dom元素

### `forceRender`

- ***类型**: `Boolean`
- **非侦听属性**
- **默认值** `false`
- - **描述** 强制渲染poup显示的Dom元素
> 该参数的使用场景是外部动态改变slot的前提下需要Popup更新内部的UI
> 一旦该参数设置为true,任何触发vue-updated生命周期的函数都会强制刷新该参数

## 槽

### `default`

- **描述** Popup 的自定义槽的实现，可以自定义各类视图

## 事件

### `@load`

- **描述** 在 Popup 加载完毕后发送该事件
- **Payload** `{ popup }`
- - `popup` Popup 对象
