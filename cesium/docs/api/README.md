# 地图场景

> mapgis-web-scene

## 属性

| 名称       | 类型                    | 默认值                                                                                       | 描述                                                                                                                                                                                                                          | 是否监听 |
| ---------- | ----------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| libPath    | String                  | `http://develop.smaryun.com:8899/static/libs/cdn/cesium/Cesium.js`                           | cesium 原生 js 实现. 一般是指定为用户代码 public 的`path/to/cesium`的路径。                                                                                                                                                   | 否       |
| pluginPath | String                  | `http://develop.smaryun.com:8899/static/libs/cdn/zondyclient/webclient-cesium-plugin.min.js` | cesium 中地插件增强实现， 一般是指定为用户代码 public 的`path/to/cesium`的路径。                                                                                                                                              | 否       |
| vueKey     | String                  | default                                                                                      | mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件 <br/> 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。 | 否       |
| vueIndex   | Number                  | (Math.random() \* 1000000).toFixed(0)                                                        | 当 该 key 的主要作用是用来记录 Cesium 的 Source,primitive,entity 的内存中的引用数组的下标，从而避免 vue 对 cesium 的内存劫持                                                                                                  | 否       |
| height     | Number                  |                                                                                              | 解决分屏时，cesium 无限拉长的问题，要给一个固定高度                                                                                                                                                                           | 是       |
| container  | String 或者 HTMLElement | cesium-${("" + Math.random()).split(".")[1]}                                                 | Cesium-viewer 绑定的 Dom 元素对象                                                                                                                                                                                             |

其中 `path/to/cesium`的目录下一般是成对存在

```sh
path-to-cesium
   |--- Cesium.js                        # libPath
   |--- webclient-cesium-plugin.html     # Debug 版本说明文件
   |--- webclient-cesium-plugin.js       # Debug pluginPath
   |--- webclient-cesium-plugin.min.html # Release 版本说明文件
   |--- webclient-cesium-plugin.min.js   # Release pluginPath
```

<!-- ### `keyEventEnable`

- **Type**: `Boolean`
- **非侦听属性** 非 watch 属性
- **Default:** `true`
- **Description:** Cesium 键盘事件是否激活，激活后可以使用 W\A\S\D 控制相机的方向和远近 -->

[comment]: <> (### `viewerMode`)

[comment]: <> (- **Type**: `String`)

[comment]: <> (- **非侦听属性** 非 watch 属性)

[comment]: <> (- **Default:** `3D`)

[comment]: <> (- - **Description:** 初始视图模式默认为三维球视图 '2D'表示二维视图 'COLUMBUS_VIEW' 表示三维平面视图)

[comment]: <> (### `showInfo`)

[comment]: <> (- **Type**: `Boolean`)

[comment]: <> (- **非侦听属性** 非 watch 属性)

[comment]: <> (- **Default:** `false`)

[comment]: <> (- - **Description:** 是否显示默认的属性信息框)

::: tip
下面基础属性可以参考 Cesium.Viewer.ConstructorOptions
:::

| 名称             | 类型    | 默认值                                                                                                                                                                                | 描述                 | 是否监听 |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------- |
| animation        | Boolean | false                                                                                                                                                                                 | 默认动画控件不显示   | 否       |
| timeline         | Boolean | false                                                                                                                                                                                 | 默认时间轴控制不显示 | 否       |
| baseLayerPicker  | Boolean | false                                                                                                                                                                                 | 默认图层选择器不实现 | 否       |
| fullscreenButton | Object  | null                                                                                                                                                                                  | 默认全屏控件不显示   | 否       |
| vrButton         | Object  | null                                                                                                                                                                                  | 默认 VR 控件不显示   | 否       |
| contextOptions   | Object  | { webgl:{ preserveDrawingBuffer: true; //默认激活 WebGL 打印输出能力 } }                                                                                                              | 上下文环境           | 否       |
| cameraView       | Object  | { destination:{x: -5087907.392038159,y: 14207074.175879652,z: 3655215.2541255946},orientation:{ heading: 6.1827568973283045,pitch: -1.2409374391413084,roll: 0.0003114284469649675 }} | 默认视图位置         | 否       |

## 事件

事件载荷由以下三部分组成

- `Cesium` Cesium 原生 js 脚本
- `vueCesium` Cesium 对象存储管理器
- `CesiumZondy` CesiumZondy 中地数码的 Cesium 增强插件(持续移除，后期不再使用)
- `component` 发送当前事件的组件

### `@load`

- **Description:** 在地图场景加载完毕后发送该事件
- **Payload** `{ Cesium, CesiumZondy, component }`
- - `Cesium` Cesium 原生 js 脚本
- - `vueCesium` Cesium 对象存储管理器
- - `CesiumZondy` CesiumZondy 中地数码的 Cesium 增强插件(持续移除，后期不再使用)
- - `component` 发送当前事件的组件

请注意 Cesium`原生的`EventHandle 的事件还是由原生的方式来控制，此处只上传`vue框架`层面的事件
