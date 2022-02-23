> mapgis-3d-scene-setting

## 属性

### `panelStyle`

- **类型:** `Object`
- **可选**
- **非侦听属性**
- **描述:** 场景设置组件的面板的样式。

### `initialStatebar`

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值:** `false`
- **描述:** 控制场景控制组件状态栏的初始开闭状态。

## 方法

### `togglePanel`

- **Description:** 切换场景设置面板的显示状态

## 事件

### `@loaded`

- **Description:** 在 场景设置组件 加载完毕后发送该事件
- **Payload** 场景设置组件对象

### `@unload`

- **Description:** 在 场景设置组件 销毁时发送该事件
- **Payload** 场景设置组件对象

## 示例

```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-m3d-layer
      :auto-reset="autoReset"
      :maximum-screen-space-error="maximumScreenSpaceError"
      :url="m3dUrl"
    />
    <mapgis-3d-scene-setting :panelStyle="panelStyle" :initialStatebar="true" />
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      autoReset: true,
      maximumScreenSpaceError: 8,

      panelStyle: {
        position: "absolute",
        top: "10px",
        left: "10px",
        width: "320px",
        background: "#fff",
      },
    };
  },
};
</script>
```
