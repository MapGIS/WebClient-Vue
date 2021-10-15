# 表格组件

> mapgis-3d-table

## 属性

### `dataSource`

- **类型:** `Array | Object`
- **侦听属性**
- **描述:** 表格的数据源，支持如下格式：
  > 一：[Feature]: Feature 数组格式 <br/>
  > 使用此格式时不建议自己拼装，
  > 而是直接调动 Feature 组件的 fromQueryResult 或 fromGeoJSON 方法返回数据，
  > 建议如此使用: <br/>
  > 将 Zondy.Service.QueryDocFeature.query 方法查询到的 result 转为[Feature] <br/>
  > let featureSet = Feature.fromQueryResult(result); <br/>
  > 将 GEOJSON 格式的 JSON 转为[Feature] <br/>
  > let featureSet = Feature.fromGeoJSON(GEOJSON); <br/>
  > 格式： <br/> > [{ <br/>
  > > geometry:"", <br/>
  > > geometryType:"", <br/>
  > > attributes:"", <br/>
  > > style:"", <br/>
  > > FID:"" <br/>
  > > }, <br/>
  > > Feature2, <br/>
  > > Feature3 <br/>
  > > ] <br/>
  > 二：Zondy: 使用 Zondy 的 API 做查询返回的格式 <br/>
  > { <br/>
  > AttStruct:{...}, <br/>
  > SFEleArray:{...}, <br/>
  > TotalCount:"" <br/>
  > }
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
  > { <br/>
  > pageSize: 每页条数,<br/>
  > total: 所有记录数,<br/>
  > }

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

- **描述:** 多选框中，其中一页中的所有数据事件
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
  <mapgis-web-scene style="height: 800px">
    <mapgis-3d-igs-m3d :url="url"> </mapgis-3d-igs-m3d>
    <mapgis-3d-table
      :dataSource="dataSource"
      :pagination="pagination"
      @pageChanged="pageChanged"
      @selectAll="selectAll"
      @fullScreen="fullScreen"
      @originScreen="originScreen"
      @edited="edited"
      @click="click"
      @deleted="deleted"
      @sorted="sorted"
      @selected="selected"
    ></mapgis-3d-table>
  </mapgis-web-scene>
</template>

<script>
import { Mapgis3dTable, Mapgis3dIgsM3d } from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    Mapgis3dTable,
    Mapgis3dIgsM3d
  },
  data() {
    return {
      url: "http://develop.smaryun.com:6163/igs/rest/g3d/ModelM3D",
      dataSource: undefined,
      pagination: {
        total: 0,
        pageSize: 10
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let vm = this;
      let inter = setInterval(function() {
        if (Zondy.Catalog) {
          clearInterval(inter);
          vm.query("0", 10);
        }
      }, 20);
    },
    query(page, pageCount, orderField, isAsc) {
      let vm = this;
      //初始化参数对象
      let queryParam = new Zondy.Catalog.G3DMapDoc();
      //查询图层的URL路径
      queryParam.gdbp =
        "gdbp://MapGisLocal/示例数据/ds/三维示例/sfcls/景观_模型";
      //设置查询结果结构
      queryParam.structs = {
        IncludeAttribute: true,
        IncludeGeometry: false,
        IncludeWebGraphic: false
      };
      //属性查询
      queryParam.where = "";
      //分页信息
      queryParam.page = page;
      queryParam.pageCount = pageCount;
      //服务器的ip
      queryParam.ip = "develop.smaryun.com";
      queryParam.port = "6163";
      //排序设置
      queryParam.orderField = orderField ? orderField : "";
      queryParam.isAsc = isAsc ? isAsc : false;
      //查询服务
      queryParam.GetFeature(
        function(result) {
          console.log("result", result);
          vm.dataSource = result;
          vm.pagination.total = result.TotalCount;
        },
        function(e) {
          console.log("e", e);
        }
      );
    },
    pageChanged(pagination, sorter) {
      //分页事件
      console.log("pageChanged", pagination);
      this.query(
        pagination.current - 1,
        pagination.pageSize,
        sorter.orderField,
        sorter.isAsc
      );
    },
    selectAll(selectData) {
      //全选事件
      console.log("selectAll", selectData);
    },
    selected(selectData, allDate) {
      //选择单个数据事件
      console.log("selected", selectData);
      console.log("allDate", allDate);
    },
    fullScreen(pagination, sorter) {
      //全屏事件
    },
    originScreen(pagination, sorter) {
      //还原屏幕事件
      this.pagination.pageSize = pagination.pageSize;
      this.query(
        pagination.current - 1,
        pagination.pageSize,
        sorter.orderField,
        sorter.isAsc
      );
    },
    edited(result) {
      //编辑完成事件
      console.log("edited", result);
    },
    click(result, key) {
      //单击事件
      console.log("click", result, key);
    },
    deleted(result) {
      //删除事件
      console.log("deleted", result);
    },
    sorted(sorter, pagination) {
      //排序事件
      this.query(
        pagination.current - 1,
        pagination.pageSize,
        sorter.orderField,
        sorter.isAsc
      );
    }
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
