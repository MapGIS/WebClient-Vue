# FeatureTable

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `MapUrl`

- **类型:** `String`
- **Non-Synced**
- **watch**
- **描述:** 地图文档的url地址，格式如下http://{ip}:{port}/igs/rest/mrms/docs/{docname}

### `geometry`

- **类型:** `Boolean`
- **默认值:** false
- **Non-Synced**
- **watch**
- **描述:** 是否启用图形工具，默认不显示

### `styles`

- **类型:** `Object`
- **Non-Synced**
- **watched**
- **描述:** 图形工具的样式。

### `editable`

- **类型:** `Boolean`
- **Non-Synced**
- **watched**
- **默认值:** true
- **描述:** 是否启用编辑，默认启用。

## Events
### `@loaded`

- **描述:** 要素表格加载完成
- **返回值** `{ table }` <br>
  `table` 表格对象
  
### `@addSuccess`

- **描述:** 表格新增要素成功事件
- **返回值** `{ result }` <br>
  `result` 新增接口的执行结果
  
### `@addFailure`

- **描述:** 表格新增要素失败事件
- **返回值** `{ result }` <br>
  `result` 新增接口的执行结果

### `@deleteSuccess`

- **描述:** 删除要素成功事件
- **返回值** `{ OID,record }` <br> 
  `OID`要素的OID <br>
  `record` 被删除的一条数据

### `@deleteFailure`

- **描述:** 删除要素失败事件
- **返回值** `无` <br>

### `@updateSuccess`

- **描述:** 更新要素成功事件
- **返回值** `{ allData }` <br>
  `allData` 该分页的所有数据 <br>

### `@updateFailure`

- **描述:** 更新要素失败事件
- **返回值** `{ 无 }` <br>

### `@querySuccess`

- **描述:** 查询要素成功事件
- **返回值** `{ allData }` <br>
  `allData` 查询到的所有数据 <br>

### `@queryFailure`

- **描述:** 查询要素失败事件
- **返回值** `{ 无 }` <br>

## Example

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
