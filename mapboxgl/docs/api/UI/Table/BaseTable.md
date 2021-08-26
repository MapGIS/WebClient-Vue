# 表格

> mapgis-base-table

## 属性

### `dataSource`

- **类型:** `Array | Object`
- **侦听属性**
- **描述:** 表格的数据源，支持如下格式：
  ```
  一：[Feature]: Feature数组格式，使用此格式时不建议自己拼装，
    而是直接调动Feature组件的fromQueryResult或fromGeoJSON方法返回数据，
    建议如此使用:
    将Zondy.Service.QueryDocFeature.query方法查询到的result转为[Feature]
    let featureSet = Feature.fromQueryResult(result);
    将GEOJSON格式的JSON转为[Feature]
    let featureSet = Feature.fromGeoJSON(GEOJSON);
    格式：
    [
      {
        geometry:"",
        geometryType:"",
        attributes:"",
        style:"",
        FID:""
      },
      Feature2,
      Feature3
    ]
  二：Zondy: 使用Zondy的API做查询返回的格式
    {
      AttStruct:{...},
      SFEleArray:{...},
      TotalCount:""
    }
  ```
- **参考:** <br>
  `[Feature]` in [Feature](/zh/api/Util/geomtry/Feature.md) <br>
  `Zondy` in [Zondy](http://develop.smaryun.com:8899/#/demo/mapboxgl/mapgis-igserver/feature/feature-search) <br>

### `columns`

- **类型:** `Array`
- **默认值:** []
- **侦听属性**
- **描述:** 表格的字段集合，格式如下：
  ```
     [
       {
         dataIndex: 'name',
         key: 'name',
         slots: { title: 'customTitle' },
         scopedSlots: { customRender: 'name' },
         },
         {
           title: 'Age',
           dataIndex: 'age',
           key: 'age',
         },
         {
           title: 'Address',
           dataIndex: 'address',
           key: 'address',
         }
       }
     ]
  ```
- **参考:** `AntDesign` in [AntDesign Vue table](https://www.antdv.com/components/table-cn/)

### `editable`

- **类型:** `Boolean`
- **默认值:** `true`
- **侦听属性 ed**
- **描述:** 是否启用表格编辑。

### `pagination`

- **类型:** `Object`
- **侦听属性 ed**
- **描述:** 表格分页信息。

```
  {
    pageSize: 每页条数,
    total: 所有记录数,
  }
```

## 事件

### `@edited`

- **描述:** 表格的编辑完成事件
- **返回值** `{ dataSource }` <br>
  `dataSource` 表格的所有数据

### `@deleted`

- **描述:** 删除一条数据事件
- **返回值** `{ record }` <br>
  `record` 被删除的一条数据

### `@click`

- **描述:** 单击单元格事件
- **返回值** `{ record,columnKey }` <br>
  `record` 被点击的一行数据<br>
  `columnKey` 被点击的单元格所在的列名 <br>

### `@doubleClick` 或 `@doubleclick`

- **描述:** 双击单元格事件
- **返回值** `{ rowIndex,columnKey,value,record }` <br>
  `rowIndex` 行号，从 0 开始<br>
  `columnKey` 列名 <br>
  `value` 单元格数据 <br>
  `record` 一行的数据 <br>

### `@selected`

- **描述:** 多选框中，选择一行事件
- **返回值** `{ record,selectData,selected }` <br>
  `record` 被选择的一行数据<br>
  `selectData` 已选的所有数据 <br>
  `selected` 是否选中该行 <br>

### `@selectAll` 或 `@selectall`

- **描述:** 多选框中，算中一页中的所有数据事件
- **返回值** `{ selectData,selected }` <br>
  `selectData` 已选的所有数据 <br>
  `selected` 是否全选 <br>

### `@pageChanged` 或 `@pagechanged`

- **描述:** 分页点击事件
- **返回值** `{ pagination,sorter }` <br>
  `pagination` 分页信息 <br>
  `sorter` 排序信息 <br>

### `@sorted`

- **描述:** 排序事件
- **返回值** `{ sorter,pagination }` <br>
  `sorter` 排序信息 <br>
  `pagination` 分页信息 <br>

### `@fullScreen` 或 `@fullscreen`

- **描述:** 全屏事件
- **返回值** `{ pagination,sorter }` <br>
  `pagination` 分页信息，其中的 pageSize 为铺满全屏的数据条数 <br>
  `sorter` 排序信息 <br>

### `@originScreen` 或 `@originscreen`

- **描述:** 还原全屏事件
- **返回值** `{ pagination,sorter }` <br>
  `pagination` 分页信息 <br>
  `sorter` 排序信息 <br>

## 示例

```vue
<template>
  <mapgis-web-map 
    class="main"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :zoom="mapZoom"
    :center="outerCenter"
    :crs="mapCrs"
  >
    <mapgis-igs-tdt-layer
      :layer="layer"
      :layerId="layerId"
      :sourceId="sourceId"
      :baseURL="baseURL"
      :token="token"
      :crs="mapCrs"
    >
    </mapgis-igs-tdt-layer>
  </mapgis-web-map >
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import { MapgisWebMap,MapgisIgsTdtLayer } from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapgisWebMap,
    MapgisIgsTdtLayer
  },
  data() {
    return {
      accessToken:
        "pk.eyJ1IjoicGFybmRlZWRsaXQiLCJhIjoiY2o1MjBtYTRuMDhpaTMzbXhpdjd3YzhjdCJ9.sCoubaHF9-nhGTA-sgz0sA", // 使用mapbox样式需要的秘钥
      mapStyle: "mapbox://styles/mapbox/light-v9", // 地图样式
      mapZoom: 3, // 地图初始化级数
      outerCenter: [130, 30], // 地图显示中心
      mapCrs: "EPSG:4326",

      layerId: "igsLayer_layerId",
      sourceId: "igsLayer_sourceId",
      layer: {}, // 图层配置信息
      baseURL: "http://t2.tianditu.gov.cn/vec_c/wmts", // 请求基地址
      token: "2ddaabf906d4b5418aed0078e1657029" // 请求天地图的key值
    };
  },

  created() {
    // 在组件中使用mapbox-gl.js的脚本库功能
    this.mapbox = Mapbox;
  }
};
</script>

<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>
```
