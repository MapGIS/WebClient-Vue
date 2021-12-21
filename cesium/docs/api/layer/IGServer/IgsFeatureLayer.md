# IGServer 要素图层

> mapgis-3d-igs-Feature-layer

<font style="color:red;fontsize=5px;"> 注意：</font>由于三维底层支持原因，目前仅支持 4326 坐标系的要素图层，

> 若要实现 3857 坐标系要素查询，则需要在矢量地图文档发布前，
> 在 igserver 桌面端先动态投影成经纬度，再发布地图文档。
> 目前三维底层暂时只支持二维矢量文档，后期会补充其他形式。

## 属性

### `baseUrl`

- **类型:** `String`
- **必填**
- **侦听属性**
- **描述:**
  > 服务基地址：发布的二维文档地址， eg：二维地图文档地址：http://[host]:[port]/igs/rest/mrfs/docs/{docName}/mapIndex/LayerIndex。

### autoReset

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **描述:** 视角是否自动切换到地图文档范围。

### loadAll

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值** `false`
- **描述:** 是否加载所有数据，默认以网格形式动态加载（即为 false），数据量大的建议网格形式动态加载。

### setViewToExisting

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值** `false`
- **描述:** 视角是否定位到现存要素的范围，仅当 loadAll=true 时有效

### clampToGround

- **类型:** `Boolean`
- **可选**
- **非侦听属性**
- **默认值** `false`
- **描述:** 是否贴地，当加载三维地图文档或矢量白模时该属性无效

### filter

- **类型:** `Object|Array`
- **可选**
- **侦听属性**
- **描述:** 过滤条件对象，空对象则默认无过滤。
- **示例:**
  ```json
      filter: {
             where: 'OBJECTID>500'
       }
  ```

### featureStyle

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 矢量地图文档对应图层的style 样式对象,
  featureStyle 包含一下两个属性：

| Name       | Type   | Description                                                                            |
| :--------- | :----- | :------------------------------------------------------------------------------------- |
| type       | String | style 样式类型，可选参数为"point、line、polygon、building"，对应点，线，区，区矢量白模 |
| parameters | Object | 具体参数对象                                                                           |

其中 parameters 对象中包括以下属性：

| Name         | Type   | Description                                                                                                                                     |
| :----------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| color        | String | rgba 或者十六进制颜色                                                                                                                           |
| size         | Number | 点符号大小，仅当 options.style.type="point"时生效                                                                                               |
| outlineColor | String | 边框线颜色，仅当 options.style.type="point 或 polygon 或 building"时生效，当传入边框线颜色或边框线宽度参数时启用边框线                          |
| outlineWidth | Number | 边框线宽度，仅当 options.style.type="point"时生效，当传入边框线颜色或边框线宽度参数时启用边框线,"polygon 或 building"边框线宽度仅能为默认值 1。 |
| width        | Number | 线宽，仅当 options.style.type="line"时生效                                                                                                      |
| heightField  | String | 用作区矢量白模高程的属性字段名称，不设置则高程为零，仅当 options.style.type="building"时生效                                                    |
| heightRatio  | Number | 区矢量白模高程放缩比例，默认 1.0，仅当 options.style.type="building"时生效                                                                      |

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件， <br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

## 事件

### `@load`

- **Description:** 在要素图层加载完毕后发送该事件
- **Payload** 事件载荷如下所示:
  - `layerIndex` 当前要素图层对象的图层索引数组

## 示例

### 加载 文档要素

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-feature-layer
      :base-url="baseUrl"
      :layers="layers"
      :featureStyle="featureStyle"
      :filter="filter"
    >
    </mapgis-3d-igs-feature-layer>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url,本地发布的二维文档，坐标系为4326
      baseUrl: "http://localhost:6163/igs/rest/mrfs/docs/kunshan",
      //featureStyle:传对象或数组对象
      featureStyle: [
        {
          type: "polygon",
          parameters: {
            color: "rgba(218,98,125,0.6)",
            outline: true,
            outlineColor: "rgba(255,255,0,0.5)",
          },
        },
      ],
      filter: { where: "mpArea>2880000" },
      //layers 显示图层顺序为0的
      layers: "0",
    };
  },
};
</script>
```

:::

### 加载 矢量图层要素

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-feature-layer
      :base-url="baseUrl"
      :layers="layers"
      :featureStyle="featureStyle"
      :filter="filter"
    >
    </mapgis-3d-igs-feature-layer>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url,本地发布的二维文档，坐标系为4326
      baseUrl: "http://localhost:6163/igs/rest/mrfs/layer",
      featureStyle: {
        type: "polygon",
        parameters: {
          color: "rgba(218,98,125,0.6)",
          outline: true,
          outlineColor: "rgba(255,255,0,0.5)",
        },
      },
      filter: { where: "mpArea>2880000" },
      layers: "gdbp://MapGISLocalPlus/示例数据/sfcls/KS_buildings",
    };
  },
};
</script>
```

### 设置 building - 矢量白膜

```vue
<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-feature-layer
      :base-url="baseUrl"
      :layers="layers"
      :featureStyle="featureStyle"
      :filter="filter"
    >
    </mapgis-3d-igs-feature-layer>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url,本地发布的二维文档，坐标系为4326
      baseUrl: "http://localhost:6163/igs/rest/mrfs/docs/kunshan",
      //featureStyle:传对象或数组对象
      featureStyle: [
        {
          type: "building",
          parameters: {
            heightField: "HEIGHT",
            // heightField: 'mpPerimeter',
            heightRatio: 20,
            color: "rgba(218,98,125,0.6)",
            outline: true,
            outlineColor: "rgba(255,255,0,0.5)",
          },
        },
      ],
      filter: { where: "mpArea>2880000" },
      layers: "0",
    };
  },
};
</script>
```
