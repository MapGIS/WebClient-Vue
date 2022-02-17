# GraphicLayerService 标注服务工具类

> mapgis-3d-graphic-layer-service

# 如何引入

```javascript
//引入Mapgis3dGraphicLayerService组件
import { Mapgis3dGraphicLayerService } from "@mapgis/webclient-vue-cesium";
//在mixins里面混入
export default {
  name: "你的组件",
  //混入Mapgis3dGraphicLayerService服务
  mixins: [Mapgis3dGraphicLayerService]
};
```

# 混入后，如何使用

```javascript
//初始化一个图层
this.$_newGraphicLayer({
  //指定vueIndex，只有一个时，也可以不传
  vueIndex: this.vueIndex,
  //vueKey，只有一个Cesium球时，也可以不传
  vueKey: this.vueKey,
  //标绘对象添加完毕后的回调事件
  getGraphic: function(e) {}
});
//开始绘制标绘对象
this.$_startDrawing({ type: "绘制类型", style: {} });
```

## 方法列表

| 名称                                                         | 描述                                                                                                              |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [\$\_newGraphicLayer](#newGraphicLayer)([options](#options)) | 初始化一个标绘图层对象                                                                                            |
| [\$\_getGraphicLayer](#getGraphicLayer)()                    | 通过 vueKey，vueIndex 来获取 graphicsLayer 对象，当不传时，会使用默认的 vueKey，vueIndex                          |
| [\$\_switchGraphicLayer](#switchGraphicLayer)()              | 当前 vue 页面下包含多个标绘图层时，通过 vueKey，vueIndex 来切换 graphicsLayerService 默认对应的 graphicLayer 对象 |
| [\$\_startDrawing](#startDrawing)([options](#drawOptions))   | 通过绘制参数 options 来绘制要素，可通过 vueIndex，vueKey 来指定要绘制在哪一个 graphicsLayer 图层上，默认可不传    |
| [\$\_stopDrawing](#stopDrawing)()                            | 停止绘制                                                                                                          |
| [\$\_startEdit](#startEdit)()                                | 开始编辑标绘图形对象，可通过 vueIndex，vueKey 来指定要绘制在哪一个 graphicsLayer 图层上，默认可不传               |
| [\$\_stopEdit](#stopEdit)()                                  | 停止编辑                                                                                                          |
| [\$\_getAllGraphic](#getAllGraphic)()                        | 获取该图层下所有标绘图形                                                                                          |
| [\$\_getGraphicByID](#getGraphicByID)(id)                    | 根据 id 获取标绘图形对象                                                                                          |
| [\$\_removeGraphicByID](#removeGraphicByID)(id)              | 根据 ID 移除选中标绘图形                                                                                          |
| [\$\_getGraphicByIndex](#getGraphicByIndex)(index)           | 根据 index 获取标绘图形对象                                                                                       |
| [\$\_removeGraphicByIndex](#removeGraphicByIndex)(index)     | 根据 index 移除选中标绘图形                                                                                       |
| [\$\_fromJson](#fromJson)(json)                              | 加载标绘对象组成的 json 数据                                                                                      |
| [\$\_toJSON](#toJSON)()                                      | 将整个图层导出为 json 数据                                                                                        |
| [\$\_toFile](#toFile)(dataSource)                            | 将数据导出为文件                                                                                                  |
| [\$\_removeAllGraphic](#removeAllGraphic)()                  | 移除该标绘图层下所有标绘对象                                                                                      |
| [\$\_getJsonById](#getJsonById)(id, key, value)              | 通过 id 来获取标绘对象的 json 数据，该对象与 Cesium 解绑，操作该对象，并不会改变标绘对象的属性                    |
| [\$\_updateStyle](#updateStyle)(Graphic, key, value)         | 更新标绘图形对象样式                                                                                              |
| [\$\_updateStyleByStyle](#updateStyleByStyle)(id, style)     | 通过 style 对象，更新标绘图形对象样式，一次可同时更新多个值                                                       |
| [\$\_updateStyleByLayer](#updateStyleByLayer)(layer)         | 通过一个标绘图层对象，更新标绘图形对象样式，一次可同时更新多个标绘对象的多个值                                    |
| [\$\_destroy](#destroy)()                                    | 销毁整个图层                                                                                                      |

## 方法

<span id="newGraphicLayer">### `$_newGraphicLayer(options)`</span>

> 初始化一个 graphicsLayer 对象，<span style='color: red;'>请通过\$\_getGraphicLayer 方法获取 GraphicLayer 对象，不要将 GraphicLayer 对象绑定在 vue 上</span>

#### 参数

| 名称                | 类型   | 是否必填 | 描述       |
| ------------------- | ------ | -------- | ---------- |
| [options](#options) | Object | 是       | 初始化参数 |

##### 参数详情

<span id="options">##### `options（options参数）`</span>

| 名称                 | 类型             | 默认值    | 描述                                                                  |
| -------------------- | ---------------- | --------- | --------------------------------------------------------------------- |
| vueIndex             | String or Number | 随机数    | graphicLayer 的唯一标识，随机生成的数字或字符串，不传则自动生成       |
| vueKey               | String           | 'default' | cesium 球体的唯一标识，默认值 default，当分屏时使用此对象标识多个球体 |
| getGraphic(Graphic)  | Function         | 无        | 绘制完成时的回调函数                                                  |
| finishEdit(Graphic)  | Function         | 无        | 编辑完成时的回调函数                                                  |
| revokeModel(Graphic) | Function         | 无        | 添加模型时，点击右键撤销模型的回调函数                                |

#### 返回值 - 无

#### 示例

```javascript
//始化一个 GraphicLayer 对象：
this.$_newGraphicLayer({
  vueIndex: vueIndex,
  vueKey: vueKey,
  getGraphic: function(e) {},
  finishEdit: function(e) {},
  revokeModel: function(e) {}
});
```

<span id="getGraphicLayer">### `$_getGraphicLayer(vueIndex, vueKey)`</span>

> 通过 vueKey，vueIndex 来获取 graphicsLayer 对象，当不传时，会使用默认的 vueKey，vueIndex

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值

| 名称          | 类型   | 描述               |
| ------------- | ------ | ------------------ |
| graphicsLayer | Object | graphicsLayer 对象 |

#### 示例

```javascript
//获取默认的 GraphicLayer 对象：
let graphicsLayer = this.$_getGraphicLayer();
//当在一个球体上，有多个GraphicLayer对象时，获取该对象，请指定vueIndex：
let vueIndex = "你的vueIndex";
let graphicsLayer = this.$$\_getGraphicLayer(vueIndex);
//当有多个球体，多个 GraphicLayer 对象时，获取该对象，请指定 vueIndex 以及 vueKey：
let vueIndex = "你的 vueIndex";
let vueKey = "你的 vueKey";
let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);
```

<span id="switchGraphicLayer">### `$_switchGraphicLayer(vueIndex, vueKey)`</span>

> 通过 vueKey，vueIndex 来切换 graphicsLayerService 默认对应的 graphicLayer 对象

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值 - 无

#### 示例

```javascript
//切换 GraphicLayer 对象：
let vueIndex = "你的 vueIndex";
let vueKey = "你的 vueKey";
this.$_switchGraphicLayer(vueIndex, vueKey);
```

<span id="startDrawing">### `$_startDrawing(options, vueIndex, vueKey)`</span>

> 通过绘制参数 options 来绘制要素，可通过 vueIndex，vueKey 来指定要绘制在哪一个 graphicsLayer 图层上

#### 参数

| 名称                    | 类型             | 默认值 | 是否必填 | 描述                                            |
| ----------------------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| [options](#drawOptions) | Object           | {}     | 是       | 绘制参数                                        |
| vueIndex                | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey                  | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

##### 参数详情

<span id="drawOptions">##### `options（options参数）`</span>

| 名称           | 类型    | 默认值 | 是否必填 | 描述                                                                                                                                                                                                                                                 |
| -------------- | ------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | String  | 无     | 是       | 绘制类型，[[graphicType](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Graphic.html#.graphicType)，[[Graphic](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Graphic.html#.graphicType)                           |
| style          | Object  | {}     | 是       | 绘制样式，[[Style](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Style.html)，[[Style](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Style.html)                                                                 |
| editPointStyle | Object  | {}     | 否       | 编辑点样式，[[Style.EditPointStyle](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Style.html#.EditPointStyle)，[[Style.EditPointStyle](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Style.html#.EditPointStyle) |
| attributes     | Object  | {}     | 否       | 标绘对象绑定的属性                                                                                                                                                                                                                                   |
| id             | String  | 无     | 否       | 标绘对象 id                                                                                                                                                                                                                                          |
| name           | String  | 无     | 否       | 标绘对象名称                                                                                                                                                                                                                                         |
| show           | Boolean | true   | 否       | 是否显示标绘对象                                                                                                                                                                                                                                     |
| isContinued    | Boolean | true   | 否       | 是否连续绘制                                                                                                                                                                                                                                         |
| drawWithHeight | Boolean | true   | 否       | 是否使用鼠标绘制高度，当为 true 时使用鼠标绘制高度，当为 false 时使用参数设置的统一高度                                                                                                                                                              |
| asynchronous   | Boolean | false  | 否       | 默认为阻塞式更新，true 为异步更新，false 为阻塞式更新                                                                                                                                                                                                |
| heading        | Number  | 0      | 否       | 偏航角，弧度                                                                                                                                                                                                                                         |
| pitch          | Number  | 0      | 否       | 俯仰角，弧度                                                                                                                                                                                                                                         |
| roll           | Number  | 0      | 否       | 翻滚角，弧度                                                                                                                                                                                                                                         |
| transformX     | Number  | 0      | 否       | 局部坐标系 X 方向平移量，单位米，X 方向为纬线方向                                                                                                                                                                                                    |
| transformY     | Number  | 0      | 否       | 局部坐标系 Y 方向平移量，单位米，Y 方向为经线方向                                                                                                                                                                                                    |
| transformZ     | Number  | 0      | 否       | 局部坐标系 Z 方向平移量，单位米，Z 方向为垂直地表方向                                                                                                                                                                                                |

#### 返回值 - 无

#### 示例

```javascript
//设置绘制参数，绘制点
let options = {
  type: "point", //绘制类型
  style: {
    //绘制样式
    color: Cesium.Color.ALICEBLUE
  }
};
//开始绘制
this.$_startDrawing(options);
```

<span id="stopDrawing">### `$_stopDrawing(vueIndex, vueKey)`</span>

> 停止绘制

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值 - 无

#### 示例

```javascript
//停止绘制
this.$_stopDrawing();
//指定一个graphicLayer，停止绘制
let vueIndex = "你的vueIndex";
let vueKey = "你的vueKey";
this.$_stopDrawing(vueIndex, vueKey);
```

<span id="startEdit">### `$_startEdit(vueIndex, vueKey)`</span>

> 开始编辑标绘图形对象

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值 - 无

#### 示例

```javascript
//开始编辑
this.$_startEdit();
//指定一个graphicLayer，开始编辑
let vueIndex = "你的vueIndex";
let vueKey = "你的vueKey";
this.$_startEdit(vueIndex, vueKey);
```

<span id="stopEdit">### `$_stopEdit(vueIndex, vueKey)`</span>

> 停止编辑标绘图形对象

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值 - 无

#### 示例

```javascript
//停止编辑
this.$_stopEdit();
//指定一个graphicLayer，停止编辑
let vueIndex = "你的vueIndex";
let vueKey = "你的vueKey";
this.$_stopEdit(vueIndex, vueKey);
```

<span id="updateStyle">### `$_updateStyle(Graphic, key, value)`</span>

> 更新标绘图形对象样式

#### 参数

| 名称    | 类型   | 默认值 | 是否必填 | 描述                                                                                                                                                                                         |
| ------- | ------ | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Graphic | Object | {}     | 是       | 标绘对象，[[Graphic](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Graphic.html)，[[Graphic](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Graphic.html) |
| key     | String | 无     | 是       | 样式名                                                                                                                                                                                       |
| value   | String | 无     | 是       | 样式值                                                                                                                                                                                       |

#### 返回值 - 无

#### 示例

```javascript
//根据ID获取标绘对象
let Graphic = this.$_getGraphicByID("标绘图形ID");
//设置样式名
let key = "样式名";
//设置样式值
let value = "样式值";
//更新样式
this.$_updateStyle(Graphic, key, value);
```

<span id="updateStyleByStyle">### `$_updateStyleByStyle(id, style, vueIndex, vueKey)`</span>

> 通过 style 对象，更新标绘图形对象样式，一次可同时更新多个值

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                                                                                                                                                                 |
| -------- | ---------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id       | String           | 无     | 是       | 标绘图形对象 ID                                                                                                                                                                      |
| style    | Object           | {}     | 是       | 样式对象，[[Style](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Style.html)，[[Style](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Style.html) |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串                                                                                                                                      |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串                                                                                                                                      |

#### 返回值 - 无

#### 示例

```javascript
let Graphic = this.$_getGraphicByID("标绘图形 ID");
let style = {
  "样式 1": "",
  "样式 2": ""
};
//更新样式
this.updateStyleByStyle(Graphic, style);
```

<span id="updateStyleByLayer">### `$_updateStyleByLayer(layer, vueIndex, vueKey)`</span>

> 通过一个标绘图层对象，更新标绘图形对象样式，一次可同时更新多个标绘对象的多个值

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                                                                                                                                                                                                     |
| -------- | ---------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| layer    | Object           | 无     | 是       | 标绘图层对象，[[GraphicsLayer](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/GraphicsLayer.html)，[[GraphicsLayer](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/GraphicsLayer.html) |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串                                                                                                                                                                          |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串                                                                                                                                                                          |

#### 返回值 - 无

#### 示例

```javascript
let layer = "一个标绘图层对象";
let key = "样式名";
let value = "样式值";
//更新样式
this.$_updateStyleByLayer(layer, key, value);
```

<span id="getGraphicByID">### `$_getGraphicByID(id, vueIndex, vueKey)`</span>

> 根据 id 获取标绘图形对象

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| id       | String           | 无     | 是       | 标绘图形对象 ID                                 |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值

| 名称    | 类型   | 描述                                                                                                                                                                                             |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| graphic | Object | 标绘图形对象，[[Graphic](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Graphic.html)，[[Graphic](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Graphic.html) |

#### 示例

```javascript
//根据 id 获取标绘图形对象
let id = "标绘对象 ID";
this.$_getGraphicByID(id);
```

<span id="getGraphicByIndex">### `$_getGraphicByIndex(index, vueIndex, vueKey)`</span>

> 根据 index 获取标绘图形对象

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| index    | String           | 无     | 是       | 标绘图形对象 index                              |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值

| 名称    | 类型   | 描述                                                                                                                                                                                             |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| graphic | Object | 标绘图形对象，[[Graphic](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Graphic.html)，[[Graphic](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Graphic.html) |

#### 示例

```javascript
//根据 index 获取标绘图形对象
let index = "标绘对象的 index";
this.$_getGraphicByIndex(index);
```

<span id="fromJson">### `$_fromJson(json, vueIndex, vueKey)`</span>

> 加载 json 数据

#### 参数

| 名称          | 类型             | 默认值 | 是否必填 | 描述                                            |
| ------------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| [json](#json) | Object or String | 无     | 是       | 标绘对象组成的 json 数据                        |
| vueIndex      | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey        | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

##### 参数详情

<span id="json">##### `json（json参数）`</span>

| 名称     | 类型   | 默认值              | 是否必填 | 描述                                             |
| -------- | ------ | ------------------- | -------- | ------------------------------------------------ |
| type     | String | "FeatureCollection" | 是       | 数据类型，值就是 FeatureCollection，参考 GEOJSON |
| features | Array  | []                  | 是       | 标绘对象数组                                     |

#### 返回值 - 无

#### 示例

```javascript
//通过 json 加载标绘图形对象
let json = {
  type: "FeatureCollection",
  features: []
};
this.$_fromJson(json);
```

<span id="getJsonById">### `$_getJsonById(id, vueIndex, vueKey)`</span>

> 通过 id 来获取标绘对象的 json 数据，该对象与 Cesium 解绑，操作该对象，并不会改变标绘对象的属性

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| id       | String           | 无     | 是       | 标绘对象的 ID                                   |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值

| 名称    | 类型   | 描述                                                                                                                                                                                             |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| graphic | Object | 标绘图形对象，[[Graphic](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/Graphic.html)，[[Graphic](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/Graphic.html) |

#### 示例

```javascript
//通过 id 来获取标绘对象的 json 数据
let id = "标绘对象的 ID";
this.$_getJsonById(id);
```

<span id="toJSON">### `$_toJSON(vueIndex, vueKey)`</span>

> 将整个图层导出为 json 数据

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值

| 名称          | 类型   | 描述                                                                                                                                                                                                                     |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| graphicsLayer | Object | 标绘图层对象，[[GraphicsLayer](司马云地址)](http://develop.smaryun.com/docs/other/mapgis-cesium/GraphicsLayer.html)，[[GraphicsLayer](内网地址)](http://192.168.88.204:8888/Demo/Build/Documentation/GraphicsLayer.html) |

#### 示例

```javascript
//将默认图层导出为 json 数据
this.$_toJSON();
//将指定图层导出为json数据
let vueIndex = "你的vueIndex";
let vueKey = "你的vueKey";
this.$_toJSON(vueIndex, vueKey);
```

<span id="toFile">### `$_toFile(dataSource, title)`</span>

> 将数据导出为文件

#### 参数

| 名称       | 类型   | 默认值   | 是否必填 | 描述         |
| ---------- | ------ | -------- | -------- | ------------ |
| dataSource | Any    | 无       | 是       | 要导出的数据 |
| title      | String | "无标题" | 否       | 文件名       |

#### 返回值 - 无

#### 示例

```javascript
//将数据导出为文件
this.$_toFile("你的数据", "文件名");
```

<span id="removeAllGraphic">### `$_removeAllGraphic(vueIndex, vueKey)`</span>

> 移除该标绘图层下所有标绘对象

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值

| 名称     | 类型    | 描述         |
| -------- | ------- | ------------ |
| isRemove | Boolean | 是否移除成功 |

#### 示例

```javascript
//移除默认图层的所有标绘对象
this.$_removeAllGraphic();
//移除指定图层的所有标绘对象
let vueIndex = "你的vueIndex";
let vueKey = "你的vueKey";
this.$_removeAllGraphic(vueIndex, vueKey);
```

<span id="removeGraphicByIndex">### `$_removeGraphicByIndex(index, vueIndex, vueKey)`</span>

> 根据 index 移除选中标绘图形

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| index    | Number           | 无     | 是       | 要移除的标绘图形的 index                        |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值

| 名称     | 类型    | 描述         |
| -------- | ------- | ------------ |
| isRemove | Boolean | 是否移除成功 |

#### 示例

```javascript
//根据 index，移除默认图层的标绘对象
let index = "标绘对象的 index";
this.removePlottingGraphicByIndex(index);
//根据 index，移除指定图层的标绘对象
let index = "标绘对象的 index";
let vueIndex = "你的 vueIndex";
let vueKey = "你的 vueKey";
this.$_removeGraphicByIndex(index, vueIndex, vueKey);
```

<span id="removeGraphicByID">### `$_removeGraphicByID(id, vueIndex, vueKey)`</span>

> 根据 ID 移除选中标绘图形

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| id       | String           | 无     | 是       | 要移除的标绘图形的 ID                           |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值

| 名称     | 类型    | 描述         |
| -------- | ------- | ------------ |
| isRemove | Boolean | 是否移除成功 |

#### 示例

```javascript
//根据 ID，移除默认图层的标绘对象
let ID = "标绘对象的 index";
this.$_removeGraphicByID(ID);
//根据ID，移除指定图层的标绘对象
let ID = "标绘对象的ID";
let vueIndex = "你的vueIndex";
let vueKey = "你的vueKey";
this.$$\_removeGraphicByID(ID, vueIndex, vueKey);
```

<span id="destroy">### `$_destroy(vueIndex, vueKey)`</span>

> 销毁整个图层

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值 - 无

#### 示例

```javascript
//销毁当前图层
this.$_destroy();
//销毁指定图层
let vueIndex = "你的vueIndex";
let vueKey = "你的vueKey";
this.$_destroy(vueIndex, vueKey);
```

<span id="getAllGraphic">### `$_getAllGraphic(vueIndex, vueKey)`</span>

> 获取该图层下所有标绘图形

#### 参数

| 名称     | 类型             | 默认值 | 是否必填 | 描述                                            |
| -------- | ---------------- | ------ | -------- | ----------------------------------------------- |
| vueIndex | String or Number | 随机数 | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |
| vueKey   | String           | 无     | 否       | graphicLayer 的唯一标识，随机生成的数字或字符串 |

#### 返回值 - 无

#### 示例

```javascript
//获取默认图层的所有标绘图形
this.$_getAllGraphic();
//获取指定图层的所有标绘图形
let vueIndex = "你的vueIndex";
let vueKey = "你的vueKey";
this.$$\_getAllGraphic(vueIndex, vueKey);
```
