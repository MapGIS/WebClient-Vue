# Scene 场景

> mapgis-3d-scene-layer
> [点此跳转到示例](#example)


## 属性

| 名称        | 类型    | 默认值  | 描述                                                                                                                                                                                                                                 | 是否监听 |
| ----------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| vueKey      | String  | default | mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件 <br/>        同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。 | 否       |
| vueIndex    | Number  |         | 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-scene-layer 组件，用来区分组件的标识符。                                                                                                                          | 否       |
| url**必传** | String  |         | 场景服务g3d网络请求地址                                                                                                                                                                                                              | 否       |
| layerId     | String  |         | 图层过滤功能:**'show:0,1'**表示显示第0,1个图层，**'hide:0,2'**表示隐藏第0,2个图层                                                                                                                                                    | 是       |
| opacity     | Number  | 1       | 透明度                                                                                                                                                                                                                               | 是       |
| autoReset   | Boolean | true    | 自动跳跃到对应的空间范围                                                                                                                                                                                                             | 否       |
| synchronous | Boolean | true    | 是否为异步发送网络请求                                                                                                                                                                                                               | 否       |
|showBoundingVolume|Boolean|false|是否显示包围盒|否|
|maximumScreenSpaceError|Number|16|用于控制模型显示细节 值较大将会渲染更少的贴图,进而可以提高性能,而较低的值将提高视觉质量|否|
|useIDB|Boolean|false|是否使用前端缓存|否|
|maxCacheLevel|Number|3|前端最大缓存级别|否|
|tileFeaturesCount|Number|400|矢量图层单个瓦片加载的矢量要素数量|否|
|duration|Number|0|跳转时间，以秒为单位|否|
|requestVertexNormals|Boolean|false|是否激活地形法向量|否|
|enablePopup|Boolean|false|是否激活查询弹窗|否|
|enableControl|Boolean|false|是否激活默认UI|否|
|outStyle|Object|{ position: "absolute", zIndex: 1000, height: "450px", width: "270px", top: "0px", left: "0px" }|当上面的enableControl=true时，可以自定义对应的包裹样式|否|

## 事件

### `@loaded`

- **描述** 在 场景图层 的所有的子图层加载完毕后发送该事件
- **Payload** `{ g3d, component }`
- - `g3d` 组件对象this
- - `component` 组件对象this

### `@unload`

- **描述** 在 M3D 卸载完毕后发送该事件
- **Payload** `{ component }`
- - `component` 组件对象this


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