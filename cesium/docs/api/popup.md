# 地图场景 mapgis-3d-popup

## 属性

### `vueKey`

- **Type**: `String`
- **non-synced** 非 watch 属性
- **Default:** `default`
- - **Description:** 该 key 的主要作用市用来记录 Cesium 的 Source,primitive,entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

### `vueIndex`

- **Type**: `[String, Number]`
- **non-synced** 非 watch 属性
- **Default:** `cesium-${("" + Math.random()).split(".")[1]}`
- - **Description:** 该 key 的主要作用市用来记录 Cesium 的 Source,primitive,entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

### `position`

- **Type**: `Object`
- **Required**
- **synced** watch 属性
- **Default:**
  ```js
  {
   entity: Cesium.Entity,
   cartesian: Cesium.Cartesian3,
   longitude: 110,
   latitude: 30,
   height: 0
  }
  ```
- - **Description:** 显示位置，3 种不同的传参使用方式
    1. Cesium.Entity 绑定到 Cesium.Entity 上鼠标点击/移入弹出，鼠标移出消失
    2. Cesium.Cartesian3 绑定到 Cesium.Cartesian3 笛卡尔坐标上
    3. Cesium.long lat height 绑定到经纬度和高度上

### `options`

- **Type**: `Object`
- **non-synced** 非 watch 属性
- **Default:**
  ```js
  {
   postRender: true, // 实时渲染
   popupId: 'xxx-xx', // 本次popup对应的唯一id,不传随机生成
   popupContentId: 'xxx-xx', // 本次popup对应的唯一内容id
   showClose: true,  // 是否显示关闭按钮
  }
  ```
- - **Description:** 额外参数

### `container`

- **Type**: `String`
- **non-synced** 非 watch 属性
- **Default:** `<div>空</div>`
- - **Description:** 外部传入的 div 的字符串描述方式，一般是文字或者 echarts 的 div;

### `showed`

- **Type**: `Boolean`
- **non-synced** watch 属性
- **Default:** `true`
- - **Description:** 是否显示

## 槽

### `default`

- **Description:** Popup 的自定义槽的实现，可以自定义各类视图

## 事件

### `@load`

- **Description:** 在 Popup 加载完毕后发送该事件
- **Payload** `{ popup }`
- - `popup` Popup 对象
