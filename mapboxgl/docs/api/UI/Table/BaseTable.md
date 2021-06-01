# BaseTable

## 属性

All common [layers props](/zh/api/Layers/README.md#props)

### `dataSource`

- **类型:** `Array | Object`
- **watch**
- **描述:** 表格的数据源，支持如下格式：
  ```
  一：AntDesign: AntDesign-Vue中table的datasouce格式
    [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      }
    ]
  二：[Feature]: Feature数组格式，使用此格式时不建议自己拼装，
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
  三：Zondy: 使用Zondy的API做查询返回的格式
    {
      AttStruct:{...},
      SFEleArray:{...},
      TotalCount:""
    }
    四：GEOJSON: 标准的GEOJSON格式
    单个feature：
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [125.6, 10.1]
      },
      "properties": {
        "name": "Dinagat Islands"
      }
    }
    feature集合：
    {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [114.31, 30.81]
        },
        "properties": {
          "Name": "点测试"
        }
      }]
    }
  ```
- **参考:** <br>
  `AntDesign` in [AntDesign Vue table](https://www.antdv.com/components/table-cn/) <br>
  `[Feature]` in [Feature](/zh/api/Util/geomtry/Feature.md) <br>
  `Zondy` in [Zondy](http://develop.smaryun.com:8899/#/demo/mapboxgl/mapgis-igserver/feature/feature-search) <br>
  `GEOJSON` in [GEOJSON](https://geojson.org/)

### `columns`

- **类型:** `Array`
- **默认值:** []
- **watch**
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
- **watched**
- **描述:** 是否启用表格编辑。

### `pagination`

- **类型:** `Object`
- **watched**
- **描述:** 表格分页信息。

```
  {
    disabled: 禁用分页,
    pageSize: 每页条数,
    total: 所有记录数,
  }
```

### `height`

- **类型:** `Number`
- **watched**
- **描述:** 表格高度，默认不指定时，会根据 pageSize 来计算表格的高度，显示与 pageSize 相同条数的数据。

### `select`

- **类型:** `Number`
- **默认值** `true`
- **watched**
- **描述:** 是否显示左侧的复选框，默认显示。

## 事件

### `@handleCreated`

- **描述:** 表格加载完成事件
- **返回值** `{ table }` <br>
  `table` 整个表格对象

### `@edited`

- **描述:** 表格的编辑完成事件
- **返回值** `{ dataSource }` <br>
  `dataSource` 表格的所有数据

### `@delete`

- **描述:** 删除一条数据
- **返回值** `{ OID,record }` <br>
  `OID`要素的 OID <br>
  `record` 被删除的一条数据

### `@click`

- **描述:** 点击单元格事件
- **返回值** `{ index,key,value,row,allRow }` <br>
  `index` 单元格所在行号，从 0 开始 <br>
  `key` 单元格中数据的 key <br>
  `value` 单元格中数据的 value <br>
  `row` 被点击单元格所在行的属性数据 <br>
  `allRow` 被点击单元格所在行的所有数据 <br>

## 示例

```vue
<template>
  <mapbox-map
    class="main"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :zoom="mapZoom"
    :center="outerCenter"
    :crs="mapCrs"
  >
    <mapbox-igs-tdt-layer
      :layer="layer"
      :layerId="layerId"
      :sourceId="sourceId"
      :baseURL="baseURL"
      :token="token"
      :crs="mapCrs"
    >
    </mapbox-igs-tdt-layer>
  </mapbox-map>
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import { MapboxMap, MapboxIgsTdtLayer } from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapboxMap,
    MapboxIgsTdtLayer
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
