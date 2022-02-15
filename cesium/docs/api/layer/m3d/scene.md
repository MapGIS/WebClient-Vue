# Scene 场景

> mapgis-3d-scene-layer
> [点此跳转到示例](#example)


## 属性

| 名称                      | 类型                | 默认值  | 描述                                                                                                                                                                                                                                 | 是否监听 |
| ------------------------- | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| vueKey                    | String              | default | mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件 <br/>        同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。 | 否       |
| vueIndex                  | Number              |         | 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-scene-layer 组件，用来区分组件的标识符。                                                                                                                            | 否       |
|url**必传**|String||场景服务g3d网络请求地址|否|
| layerId | String               |      | 图层过滤功能:**'show:0,1'**表示显示第0,1个图层，**'hide:0,2'**表示隐藏第0,2个图层                                                                                                                                                                                | 是       |
| height                    | Number              | 700     | 地图故事面板高度                                                                                                                                                                                                                     | 是       |
| width                     | Number              | 300     | 地图故事面板宽度                                                                                                                                                                                                                     | 是       |
| enableOneMap              | Boolean             | false   | 是否为一张图模式，此模式下 UI 有所调整，不用一张图的项目可忽略                                                                                                                                                                       | 是       |
| [models](#modelObj)       | [models](#modelObj) | {}      | 模型信息对象，添加模型时使用                                                                                                                                                                                                         |          |

## 事件

### `@loaded`

- **描述** 在 M3D 加载完毕后发送该事件
- **Payload** `{ component }`
- - `component` 组件对象

### `@unload`

- **描述** 在 M3D 卸载完毕后发送该事件
- **Payload** `{ component }`
- - `component` 组件对象


<span id="example">## 示例</span>
```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-scene-layer url="http://192.168.199.71:8089/igs/rest/services/CIMyanshi/倾斜临时/SceneServer"/>
  </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
<style lang="css"></style>
```