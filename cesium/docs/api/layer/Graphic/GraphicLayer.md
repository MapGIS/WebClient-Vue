# GraphicLayer

> mapgis-3d-graphic-layers
> [点此跳转到示例](#example)

## 属性

| 名称                      | 类型    | 默认值 | 描述                                                                           | 是否监听 |
| ------------------------- | ------- | ------ | ------------------------------------------------------------------------------ | -------- |
| [dataSource](#dataSource) | Array   | []     | 标绘图层数据源                                                                 | 是       |
| enableRelativePath        | Boolean | true   | 保存标绘数据时，模型的 URL 使用相对路径还是绝对路径，默认值 true，使用相对路径 | 是       |
| enableOneMap              | Boolean | false  | 是否为一张图模式，此模式下 UI 有所调整，不用一张图的项目可忽略                 | 是       |
| [models](#modelObj)       | {}      | {}     | 模型信息对象，添加模型时使用                                                   | 是       |

## 参数详情

### <span id="dataSource">`dataSource（标绘图层数据源）`</span>

| 名称       | 类型                            | 默认值 | 描述         |
| ---------- | ------------------------------- | ------ | ------------ |
| dataSource | [[GraphicLayer]](#GraphicLayer) | []     | 标绘图层数组 |

### <span id="GraphicLayer">`GeaphicLayer（标绘图层）`</span>

| 名称             | 类型                                                                                                                                                                           | 默认值        | 描述                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------------------------------------------------------ |
| dataSource       | [Graphic(司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Graphic.html)，[Graphic(内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Graphic.html) | []            | 标绘对象数组                                           |
| models           | [models](#modelObj)                                                                                                                                                            | {}            | 模型信息对象，添加模型时使用                           |
| autoFlyToGraphic | Boolean                                                                                                                                                                        | true          | 双击标绘列表，编辑标绘对象时，是否自动飞到该标绘对象处 |
| vueKey           | String                                                                                                                                                                         | default       | vueKey，唯一标识一个 Cesium 球体，分屏时使用           |
| vueIndex         | String                                                                                                                                                                         | Math.random() | vueIndex，唯一标识一个标绘图层                         |

### <span id="modelObj">`models（模型信息）`</span>

| 名称         | 类型   | 默认值 | 描述                 |
| ------------ | ------ | ------ | -------------------- |
| models       | Object | {}     | 模型分类对象         |
| models.img   | String | 无     | 模型缩略图的相对路径 |
| models.model | String | 无     | 模型的相对路径       |

## 事件

| 事件名称 | 参数                  | 默认值 | 描述                                     |
| -------- | --------------------- | ------ | ---------------------------------------- |
| save     | [saveData](#saveData) | {}     | 保存标绘图层事件，仅保存当前标绘图层数据 |

### <span id="saveData">`saveData（标绘图层保存数据）`</span>

| 名称             | 类型    | 默认值 | 描述                                       |
| ---------------- | ------- | ------ | ------------------------------------------ |
| name             | String  | 无     | 标绘图层名称                               |
| uuid             | String  | 无     | 标绘图层 id                                |
| autoFlyTo        | Boolean | true   | 切换图层时，是否进跳转到图层范围           |
| autoFlyToGraphic | Boolean | true   | 点击标绘列表时，是否自动跳转到标绘对象上方 |
| camera           | Object  | {}     | 相机视角对象                               |
| dataSource       | Array   | []     | 当前标绘图层所包含的所有标绘对象的集合     |

## <span id="example">示例</span>

```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-graphic-layer
      @save="save"
      :dataSource="dataSource"
      :models="models"
    />
  </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
      //标绘图层数据源
      dataSource: [],
      //模型信息，由使用者自定义
      models: {
        tree: [
          {
            img: "/项目的静态资源目录/gltf/tree/img/tree.png",
            model: "/项目的静态资源目录/gltf/tree/tree.glb"
          }
        ],
        traffic: [
          {
            img: "/项目的静态资源目录/gltf/traffic/img/car.png",
            model: "/项目的静态资源目录/gltf/traffic/car.glb"
          }
        ],
        ground: [
          {
            img: "/项目的静态资源目录/gltf/ground/img/grass.png",
            model: "/项目的静态资源目录/gltf/ground/grass.glb"
          }
        ],
        lamp: [
          {
            img: "/项目的静态资源目录/gltf/lamp/img/lamp.png",
            model: "/项目的静态资源目录/gltf/lamp/lamp.glb"
          }
        ]
      }
    };
  },
  methods: {
    save(graphicsData) {}
  }
};
</script>
<style lang="css"></style>
```
