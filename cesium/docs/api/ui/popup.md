# 气泡

> mapgis-3d-popup

## 属性

| 名称              | 类型    | 默认值                                                                                                                                                                                                                 | 描述                                                                                                                                                                                                                          | 是否监听 |
| ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| vueKey            | String  | default                                                                                                                                                                                                                | mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。 | 否       |
| vueIndex          | Number  | (Math.random() \* 1000000).toFixed(0)                                                                                                                                                                                  | 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。                                                                                                                 | 否       |
| position **必传** | Object  | { <br/>entity: Cesium.Entity,<br/>cartesian: Cesium.Cartesian3,<br/>longitude: 110,<br/>latitude: 30,<br/>height: 0 <br/>}                                                                                             | 显示位置，3 种不同的传参使用方式: 1. Cesium.Entity 绑定到 Cesium.Entity 上鼠标点击/移入弹出，鼠标移出消失 2.Cesium.Cartesian3 绑定到 Cesium.Cartesian3 笛卡尔坐标上 3.Cesium.long lat height 绑定到经纬度和高度上             | 是       |
| options           | Object  | { <br/>postRender: true, // 实时渲染 <br/> popupId: 'xxx-xx', // 本次 popup 对应的唯一 id,不传随机生成 <br/>popupContentId: 'xxx-xx', // 本次 popup 对应的唯一内容 id <br/>showClose: true, // 是否显示关闭按钮 <br/>} | 额外参数                                                                                                                                                                                                                      | 否       |
| container         | String  | `<div>空</div>`                                                                                                                                                                                                        | 外部传入的 div 的字符串描述方式，一般是文字或者 echarts 的 div;                                                                                                                                                               | 否       |
| visible           | Boolean | true                                                                                                                                                                                                                   | 是否显示                                                                                                                                                                                                                      | 是       |
| destroyOnClose    | Boolean | false                                                                                                                                                                                                                  | 关闭 popup 的时候销毁 Dom 元素                                                                                                                                                                                                | 否       |
| forceRender       | Boolean | false                                                                                                                                                                                                                  | 强制渲染 poup 显示的 Dom 元素。该参数的使用场景是外部动态改变 slot 的前提下需要 Popup 更新内部的 UI，一旦该参数设置为 true，任何触发 vue-updated 生命周期的函数都会强制刷新该参数                                             | 否       |

## 槽

### `default`

- **描述** Popup 的自定义槽的实现，可以自定义各类视图

## 事件

### `@load`

- **描述** 在 Popup 加载完毕后发送该事件
- **Payload** `{ popup }`
- `popup` Popup 对象
