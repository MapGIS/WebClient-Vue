# 气泡

> mapgis-3d-feature-popup

## 属性

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

### `position`

- **\*类型**: `Object`
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

### `visible`

- ***类型**: `Boolean`
- **v-Model 属性** 双向属性
- **侦听属性** watch 属性
- **默认值** `true`
- - **描述** 是否显示

### `properties`

- ***类型**: `Object`
- **侦听属性** watch 属性
- - **描述** 属性值
``` json
{
 "name": "测试名称",
 "id": "测试id",
}
```

### `popupOptions`

- ***类型**: `Object`
- **描述** popup可选样式
``` json
{
  "title": "name",      //主标题字段名称
  "popupType": "table", // table card rich-text
  "fullHeight": 400,    // rich-text全屏高度
}
```

| 属性表格   (table)       | 卡片   (card)       | 图文关联    (rich-text)      |
| :----------------------- | :------------------ | :-------------------------- |
| ![属性表格](./images/table.png) | ![卡片](./images/card.png) | ![图文关联](./images/rich-text.png) |

## 事件

### `@change`

- **描述** 在 Popup 可见性控制改变后发送该事件
- **Payload**是否可见  true/false

