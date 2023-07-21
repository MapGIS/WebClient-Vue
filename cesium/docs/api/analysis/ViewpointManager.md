> mapgis-3d-viewpoint-manager

## 属性

### `viewpointConfig`

- **类型:** `Array`
- **可选**
- **侦听属性**
- **描述:** 视点管理组件的视点列表配置信息。其中单个视点结构如下表：

| 属性        | 类型   | 描述                                                                   |
| :---------- | :----- | :--------------------------------------------------------------------- |
| name        | String | 视点名称                                                               |
| image       | String | 视点缩略图的路径。                                                     |
| destination | Object | 视点位置，如：{ x: 104, y: 28.011763478186143, z: 10071759.273162084 } |
| orientation | Object | 视点朝向，如：{ heading: 360, pitch: -90, roll: 0 }                    |
| duration    | Number | 视点跳转所需的时间（秒）                                               |

- **示例:**
  ```
      [
          {
              name: "中国",
              image: require("./ViewpointManager/upload/china.jpg"),
              destination: {
                  x: 108.91,
                  y: 32.52,
                  z: 5000000.0,
              },
              orientation: {
                  heading: 360,
                  pitch: -90,
                  roll: 0,
              },
              duration: 0.5,
          },
          {
              name: "武汉",
              image: require("./ViewpointManager/upload/wuhan.jpg"),
              destination: {
                  x: 114.21,
                  y: 30.42,
                  z: 150000.0,
              },
              orientation: {
                  heading: 360,
                  pitch: -90,
                  roll: 0,
              },
              duration: 0.5,
          }
      ]
  ```

## 事件

### `@loaded`

- **Description:** 在 视点管理组件 加载完毕后发送该事件
- **Payload** 视点管理组件对象

### `@unload`

- **Description:** 在 视点管理组件 销毁时发送该事件
- **Payload** 视点管理组件对象

### `@change`

- **Description:** 在 视点列表改变 时发送该事件
- **Payload** 视点列表配置信息 数组

## 示例

```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-raster-layer
      url="http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}& tk=9c157e9585486c02edf817d2ecbc7752"
    />
    <mapgis-3d-scene-layer
      :autoReset="autoReset"
      :maximumScreenSpaceError="maximumScreenSpaceError"
      :url="m3dUrl"
    />
    <mapgis-3d-viewpoint-manager
      style="position:absolute;top:10px;left:10px;background:#fff"
    />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset: true,
      maximumScreenSpaceError: 8,
    };
  },
  methods: {},
};
</script>
```
