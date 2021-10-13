# 要素服务

> mapgis-feature-service

## Data

All common [layers props](/api/Layers/README.md#props)

### `MapUrl`

- **类型:** `String`
- **非侦听属性**
- **描述:** 地图文档 URL,例如http://{ip}:{port}/igs/rest/mrms/docs/{地图名称}

## 方法

### `$_getLayerInfo(layer,callback)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 取得单个图层所对应的数据库 URL
- **参数: layer Number 图层编号，从 0 开始**
- **参数: callback(url) Function 回调函数，回调函数参数：url String：单个图层所对应的 gdbp 地址**

### `$_getGDBPInfo(layer,callback)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 取得单个图层所对应的数据库的信息
- **参数: layer String 数据库地址，例如 gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市**
- **参数: callback(result) Function 回调函数，回调函数参数：result Object，获取的数据库信息**

### `$_getFieldAtt(layer,callback)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 根据图层 ID 或数据库地址取得数据库字段信息，新增要素或更新要素要使用到
- **参数: layer String 图层 Id，例如 0，表示第 0 个图层，或数据库地址，例如 gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市，表示武汉市这张表的地址**
- **参数: callback(result) Function 回调函数，回调函数参数：result Object，获取的数据库信息**

### `$_queryByRectangle(rectangleParameter,onSuccess,onError)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 根据 bbox 查询要素
- **参数: rectangleParameter RectangleParameter 查询参数**
- **参数: onSuccess(result) Function 回调函数，回调函数参数：result Object，查询到的要素集合**
- **参数: onError(result) Function 回调函数，回调函数参数：result Object，失败后的信息**

### `$_queryBySQL(sqlParameter,onSuccess,onError)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 根据 bbox 查询要素
- **参数: sqlParameter SQLParameter 查询参数**
- **参数: onSuccess(result) Function 回调函数，回调函数参数：result Object，查询到的要素集合**
- **参数: onError(result) Function 回调函数，回调函数参数：result Object，失败后的信息**

### `$_queryBySQL(sqlParameter,onSuccess,onError)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 根据 SQL 查询要素
- **参数: sqlParameter SQLParameter 查询参数**
- **参数: onSuccess(result) Function 回调函数，回调函数参数：result Object，查询到的要素集合**
- **参数: onError(result) Function 回调函数，回调函数参数：result Object，失败后的信息**

### `$_queryByObjectIds(objectIdsParameter,onSuccess,onError)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 根据 ObjectIds 查询要素
- **参数: objectIdsParameter ObjectIdsParameter 查询参数**
- **参数: onSuccess(result) Function 回调函数，回调函数参数：result Object，查询到的要素集合**
- **参数: onError(result) Function 回调函数，回调函数参数：result Object，失败后的信息**

### `$_queryByGeometry(geometryParameter,onSuccess,onError)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 根据几何查询要素
- **参数: geometryParameter GeometryParameter 查询参数**
- **参数: onSuccess(result) Function 回调函数，回调函数参数：result Object，查询到的要素集合**
- **参数: onError(result) Function 回调函数，回调函数参数：result Object，失败后的信息**

### `$_add(features,layer,onSuccess,onError)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 添加要素
- **参数: features [Feature] 要素（Feature）对象数组**
- **参数: layer String 仅支持在单个图层或数据库上操作,图层 Id，例如 0，表示第 0 个图层，或数据库地址，例如 gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市，表示武汉市这张表的地址**
- **参数: onSuccess(result) Function 回调函数，回调函数参数：result Object，新增成功**
- **参数: onError(result) Function 回调函数，回调函数参数：result Object，新增失败**

### `$_update(features,layer,onSuccess,onError)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 更新要素
- **参数: features [Feature] 要素（Feature）对象数组**
- **参数: layer String 仅支持在单个图层或数据库上操作，图层 Id，例如 0，表示第 0 个图层，或数据库地址，例如 gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市，表示武汉市这张表的地址**
- **参数: onSuccess(result) Function 回调函数，回调函数参数：result Object，更新成功**
- **参数: onError(result) Function 回调函数，回调函数参数：result Object，更新失败**

### `$_delete(objectIds,layer,onSuccess,onError)`

- **类型:** `Function`
- **非侦听属性**
- **描述:** 删除要素
- **参数: objectIds String 要删除的要素的 OID，多个 OID 以逗号分隔，例如"2,3,4,7,..."**
- **参数: layer String 仅支持在单个图层或数据库上操作,图层 Id，例如 0，表示第 0 个图层，或数据库地址，例如 gdbp://MapGISLocalPlus/wuhan_new/sfcls/武汉市，表示武汉市这张表的地址**
- **参数: onSuccess(result) Function 回调函数，回调函数参数：result Object，新增成功**
- **参数: onError(result) Function 回调函数，回调函数参数：result Object，新增失败**

## 示例

### 中地格式

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
  </mapgis-web-map >
</template>

<script>
import "@mapgis/mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "@mapgis/mapbox-gl";
import {
  MapgisWebMap,
  featureService,
  ObjectIdsParameter,
  SQLParameter,
  GeometryParameter
} from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapgisWebMap
  },
  data() {
    return {
      mapZoom: 3, // 地图初始化级数
      outerCenter: [130, 30], // 地图显示中心
      mapCrs: "EPSG:4326",
      MapUrl: "http://localhost:6163/igs/rest/mrms/docs/wuhan_WFS_4326"
    };
  },
  mixins: [featureService],
  mounted() {
    //通过ObjectIds查询要素
    let objectIdsParameter = new ObjectIdsParameter({
      layers: [0],
      objectIds: [10]
    });
    this.$_queryByObjectIds(objectIdsParameter, function(result) {
      console.log("result", result);
    });
    //通过SQL查询要素
    let sqlParameter = new SQLParameter({
      layers: [0],
      where: "Name = '武昌区'"
    });
    this.$_queryBySQL(sqlParameter, function(result) {
      console.log("result", result);
    });
    //通过几何查询要素
    let geometryParameter = new GeometryParameter({
      layers: layer
    });
    geometryParameter.fromGeoJSON({}); //一般通过绘图或其他插件来提供geojson
    this.$_queryByGeometry(geometryParameter, function(result) {
      console.log("result", result);
    });
    //几何联合SQL查询要素
    let param = new GeometryParameter({
      layers: layer,
      where: "area > 30"
    });
    geometryParameter.fromGeoJSON({}); //一般通过绘图或其他插件来提供geojson
    this.$_queryByGeometry(geometryParameter, function(result) {
      console.log("result", result);
    });
    //更新要素
    //先查询要素
    this.$_queryByGeometry(param, function(result) {
      //通过Feature的fromQueryResult方法将结果转换为要素集合
      let features = Feature.fromQueryResult(result);
      //更新要素
      this.$_update(features, "0", function(result) {
        console.log("更新完成:", result);
      });
    });
    //删除要素，删除第0个图层，OID为13和56的要素
    this.$_delete("13,56", "0", function(result) {
      console.log(result);
    });
    //取得单个图层所对应的数据库URL
    let vm = this;
    this.$_getLayerInfo(layer, function(url) {
      console.log("这是数据库地址", url);
      //取得单个图层所对应的数据库的信息
      vm.$_getGDBPInfo(url, function(result) {
        console.log("这是数据库信息", result);
      });
    });
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
