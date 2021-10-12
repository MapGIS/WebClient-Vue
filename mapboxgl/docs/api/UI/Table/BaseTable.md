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
  <mapgis-web-map crs="EPSG:4326" :center="[116.3909, 39.9148]" :zoom="8">
    <mapgis-rastertile-layer layerId="tdt" url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752" />
    <mapgis-igs-doc-layer :layerId="layerId" :sourceId="sourceId" :baseUrl="baseUrl"/>
    <mapgis-base-table
            :dataSource="dataSource"
            :pagination="pagination"
            :columns="columns"
            @pageChanged="pageChanged"
            @sorted="sorted"
            @selected="selected"
            @selectAll="selectAll"
            @delete="deleteRow"
            @edited="edited"
            @fullScreen="fullScreen"
            @originScreen="originScreen"
    >
    </mapgis-base-table>
    <mapgis-feature-service @loaded="serviceLoaded" :url="serviceUrl"/>
  </mapgis-web-map>
</template>

<script>
import {MRFS} from '@mapgis/webclient-es6-service'
const {VFeature,SQLParameter}=MRFS
export default {
  name: "basetable2d",
  data(){
    return {
      layerId: "igs_layer_layerid",
      sourceId: "igs_layer_sourceid",
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
      service: '',
      columns: [],
      dataSource: [],
      pagination:{
        total:0,
        pageSize:10
      },
      serviceUrl: "http://develop.smaryun.com:6163/igs/rest/mrfs/docs/Hubei3857"
    }
  },
  mounted() {
  },
  methods:{
    //获取数据
    getData(type){
      //获取数据
      this.query(0,10,undefined,undefined,true,"Feature");
    },
    query(pageIndex,pagination,orderBy,isAsc,initial,type){
      let vm = this;
      let sql = new SQLParameter({
        layers: "1",
        where: '',
        pageIndex: pageIndex,
        pagination: pagination,
        orderBy: orderBy,
        isAsc: isAsc,
        IncludeGeometry: false
      })
      //zondy格式
      vm.service.$_queryBySQL(sql,function (result) {
        if(type === "zondy"){
          vm.dataSource = result;
        }else if(type === "Feature"){
          vm.dataSource = VFeature.fromQueryResult(result);
        }
        if(initial){
          vm.columns = [{
            title: "mpArea",
            key: "mpArea",
            checked: true
          },{
            title: "mpPerimeter",
            key: "mpPerimeter",
            width: 120,
            checked: true
          },{
            title: "mpLayer",
            key: "mpLayer",
            width: 120,
            checked: true
          }];
          vm.pagination.total = result.TotalCount;
        }
      },function () {})
    },
    //要素服务加载完毕事件
    serviceLoaded(service){
      this.service = service;
      this.getData('zondy');
    },
    //table加载完毕事件
    handleCreated(table){
      this.table = table;
    },
    //编辑完成事件
    edited(row){
      console.log("编辑完成",row);
    },
    deleteRow(OID,row){
      console.log(OID,row)
    },
    pageChanged(pagination,sorter){
      //默认降序
      let isAsc = false;
      if(sorter.order === "ascend"){
        isAsc = true;
      }else if(sorter.order === "") {
        sorter.columnKey = "";
      }
      this.query(pagination.current - 1,pagination.pageSize,sorter.columnKey,isAsc,false,"Feature");
    },
    sorted(sorter,pagination){
      //默认降序
      let isAsc = false;
      if(sorter.order === "ascend"){
        isAsc = true;
      }else if(sorter.order === "") {
        sorter.columnKey = "";
      }
      this.query(pagination.current - 1,pagination.pageSize,sorter.columnKey,isAsc,false,"Feature");
    },
    selected(row,selectRows){
      console.log("选择一行",row);
      console.log("已选择数据",selectRows);
    },
    selectAll(selectRows){
      console.log("已选择数据",selectRows);
    },
    fullScreen(){},
    originScreen(){}
  }
}
</script>
```
