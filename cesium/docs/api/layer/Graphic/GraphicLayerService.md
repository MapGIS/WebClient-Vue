# GraphicLayerService 标注服务工具类

> mapgis-3d-graphic-layer-service

``` vue
    //引入Mapgis3dGraphicLayerService组件
    import {Mapgis3dGraphicLayerService} from '@mapgis/webclient-vue-cesium'
    //在mixins里面混入
    export default {
      name: "你的组件",
      //混入Mapgis3dGraphicLayerService服务
      mixins: [Mapgis3dGraphicLayerService],
    }
```

# 混入后，如何使用

``` vue
      //初始化一个图层
      this.$_newGraphicLayer({
        //指定vueIndex，只有一个时，也可以不传
        vueIndex: this.vueIndex,
        //标绘对象添加完毕后的回调事件
        getGraphic: function (e) {
          //你的业务逻辑
        }
      });
      //当要操作标绘图层对象时，请先通过$_getGraphicLayer方法获取对象，不要将该对象绑定在vue上
      //取得graphicLayer图层对象
      let graphicLayer = this.$_getGraphicLayer();
      //切换图层
      this.$_switchGraphicLayer(vueIndex, vueKey );
      //绘制标绘对象
      this.$_startDrawing({
        type: "绘制类型",
        style: {}
      });
      //停止绘制
      this.$_stopDrawing();
      //开始编辑
      this.$_startEdit();
      //停止编辑
      this.$_stopEdit();
      //更新标绘对象，使用方法请看下面的说明
      this.$_updateStyle();
      this.$_updateStyleByStyle();
      this.$_updateStyleByLayer();
      this.$_updateStyleById();
      //获取标绘对象
      this.$_getPlottingPrimtiveByIndex();
      this.$_getPlottingPrimtiveByID();
      this.$_getJsonById();
      this.$_getAllPlottingPrimitive();
      //通过json，将数据导入图层
      this.$_loadJson(json);
      //导出json数据
      this.$_exportToJson();      
      //导出数据为文件
      this.$_exportToFile();
      //移除标绘对象
      this.$_removeAllPirmive();
      this.$_removePickingPrimive();
      this.$_removePlottingPrimitiveByIndex();
      this.$_removePlottingPrimiveByID();
      //销毁图层
      this.$_destroy();
```

## 注入

### `Cesium`

- **类型:** `Object`
- **描述:** Cesium对象。
  > 在线文档：http://develop.smaryun.com/docs/other/mapgis-cesium/index.html

### `viewer`

- **类型:** `Object`
- **描述:** Cesium对象的Viewer对象
  > 在线文档：http://develop.smaryun.com/docs/other/mapgis-cesium/Viewer.html?classFilter=vie

## 方法

### `$_newGraphicLayer(options)`

> 初始化一个graphicsLayer对象，<span style='color: red;'>请通过$_getGraphicLayer方法获取GraphicLayer对象，不要将GraphicLayer对象绑定在vue上</span>

- **参数 - options:** `Object`
- **可选**
- **描述:** 初始化参数，内容如下：

```javascript
  {
  //String or Number 可选，graphicLayer的唯一标识，随机生成的数字或字符串，不传则自动生成
  vueIndex: vueIndex,
    //String 可选，cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体
    vueKey
:
  vueIndex,
    //Object 可选，Cesium的Viewer对象，不传则使用注入的Viewer对象
    viewer
:
  viewer,
    //Function 可选，绘制完成后的回调事件，返回绘制完成的对象
    getGraphic
:

  function (e) {
  }
}
```

> 示例：<br>
> 始化一个GraphicLayer对象： this.$_newGraphicLayer();<br>
> 始化一个GraphicLayer对象，并制定vueIndex（类似ID）： <br>
> let vueIndex = "你的vueIndex";<br>
> this.$_newGraphicLayer(vueIndex);<br>
> 有多个Cesium球体时（多个分屏）,初始化一个GraphicLayer对象： <br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_newGraphicLayer(vueIndex, vueKey);<br>
> 使用外部的viewer对象：<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> let viewer = "外部的viewer";<br>
> this.$_newGraphicLayer(vueIndex, vueKey, viewer);

### `$_getGraphicLayer(vueIndex, vueKey)`

> 通过vueKey，vueIndex来获取graphicsLayer对象，当不传时，会使用默认的vueKey，vueIndex

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - graphicsLayer:** `Object`
- **描述:** graphicsLayer对象

> 示例：<br>
> 获取默认的GraphicLayer对象：
> let graphicsLayer = this.$_getGraphicLayer();<br>
> 当在一个球体上，有多个GraphicLayer对象时，获取该对象，请指定vueIndex： <br>
> let vueIndex = "你的vueIndex";<br>
> let graphicsLayer = this.$_getGraphicLayer(vueIndex);<br>
> 当有多个球体，多个GraphicLayer对象时，获取该对象，请指定vueIndex以及vueKey：<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);

### `$_switchGraphicLayer(vueIndex, vueKey)`

> 通过vueKey，vueIndex来切换graphicsLayerService默认对应的graphicLayer对象

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - graphicsLayer:** `Object`
- **描述:** graphicsLayer对象

> 示例：<br>
> 切换GraphicLayer对象：
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_switchGraphicLayer(vueIndex, vueKey);<br>

### `$_startDrawing(options, vueIndex, vueKey)`

> 通过绘制参数options来绘制要素，可通过vueIndex，vueKey来指定要绘制在哪一个graphicsLayer图层上

- **参数1 - options:** `Object`
- **必传**
- **描述:** 绘制参数，有如下值： <br>

> type: 类型，必选 <br>
> id: 要素ID，可选 <br>
> positions: 绘制要素的点坐标，可选 <br>
> style: 绘制样式，可选 <br>
> editPointStyle: this._editPointStyl <br>
> attributes: 绘制要素的属性 <br>
> name: 名字 <br>
> show: 是否显示要素 <br>
> editing: 是否可编辑要素 <br>
> allowPicking: 是否可选中 <br>
> modelMatrix: 矩阵 <br>
> asynchronous: <br>
> getPrimitive: 绘制完成后的回调事件，返回绘制好的对象 <br>

- **参数2 - vueIndex:** `String or Number`
- **必传**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **必传**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 在默认的graphicsLayer上绘制要素：
> let options = { <br>
> id: "你的ID", <br>
> type: "label", <br>
> text: "测试", <br>
> font: "30px sans-serif", <br>
> fillColor: Cesium.Color.WHITE <br>
> }; <br>
> this.$_startDrawing(options);<br>
> 在同一个球体上的指定的一个graphicsLayer上绘制要素：<br>
> this.$_startDrawing(options, vueIndex);<br>
> 在不同的球体上，选择一个graphicsLayer，绘制要素：<br>
> this.$_startDrawing(options, vueIndex, vueKey);<br>

### `$_stopDrawing(vueIndex, vueKey)`

> 定制绘制

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 停止绘制<br>
> this.$_stopDrawing();
> 指定一个graphicLayer，停止绘制<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_stopDrawing(vueIndex, vueKey);

### `$_startEdit(vueIndex, vueKey)`

> 开始编辑标绘图形对象

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 开始编辑<br>
> this.$_startEdit();
> 指定一个graphicLayer，开始编辑<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_startEdit(vueIndex, vueKey);

### `$_stopEdit(vueIndex, vueKey)`

> 停止编辑标绘图形对象

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 停止编辑<br>
> this.$_stopEdit();
> 指定一个graphicLayer，停止编辑<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_stopEdit(vueIndex, vueKey);

### `$_updateStyle(primitive, key, value)`

> 更新标绘图形对象样式

- **参数1 - primitive:** `Object`
- **必传**
- **描述:** 标绘图形对象

- **参数2 - key:** `String`
- **必传**
- **描述:** 样式名

- **参数3 - value:** `Any`
- **必传**
- **描述:** 样式值

> 示例：<br>
> 更新样式<br>
> let primitive = this.$_getPlottingPrimtiveByID("标绘图形ID");<br>
> let key = "样式名";<br>
> let value = "样式值";<br>
> this.$_updateStyle(primitive, key, value);

### `$_updateStyleByStyle(id, style, vueIndex, vueKey)`

> 通过style对象，更新标绘图形对象样式，一次可同时更新多个值

- **参数1 - id:** `String`
- **必传**
- **描述:** 标绘图形对象ID

- **参数2 - style:** `Object`
- **必传**
- **描述:** 样式对象

- **参数3 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数4 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 更新样式<br>
> let primitive = this.$_getPlottingPrimtiveByID("标绘图形ID");<br>
> let style = {
> "样式1": "",
> "样式2": "", };<br>
> this.updateStyleByStyle(primitive, style);

### `$_updateStyleByLayer(layer, vueIndex, vueKey)`

> 通过一个标绘图层对象，更新标绘图形对象样式，一次可同时更新多个标绘对象的多个值

- **参数1 - layer:** `Object`
- **必传**
- **描述:** 标绘图层对象

- **参数2 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 更新样式<br>
> let layer = "一个标绘图层对象";<br>
> let key = "样式名";<br>
> let value = "样式值";<br>
> this.$_updateStyleByLayer(layer, key, value);

### `$_updateStyleByLayer(layer, vueIndex, vueKey)`

> 通过一个标绘图层对象，更新标绘图形对象样式，一次可同时更新多个标绘对象的多个值

- **参数1 - layer:** `Object`
- **必传**
- **描述:** 标绘图层对象

- **参数2 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 更新样式<br>
> let layer = "一个标绘图层对象";<br>
> let key = "样式名";<br>
> let value = "样式值";<br>
> this.$_updateStyleByLayer(layer, key, value);

### `$_updateStyleById(layer, vueIndex, vueKey)`

> 通过ID更新标绘图形对象样式

- **参数1 - id:** `String`
- **必传**
- **描述:** 标绘图形对象ID

- **参数2 - key:** `String`
- **必传**
- **描述:** 样式名

- **参数3 - value:** `Any`
- **必传**
- **描述:** 样式值

- **参数4 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数5 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 更新样式<br>
> let id = "标绘对象ID";<br>
> let key = "样式名";<br>
> let value = "样式值";<br>
> this.$_updateStyleById(id, key, value);

### `$_getPlottingPrimtiveByID(id, vueIndex, vueKey)`

> 根据id获取标绘图形对象

- **参数1 - id:** `String`
- **必传**
- **描述:** 标绘图形对象ID

- **参数2 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - primitive:** `Object`
- **描述:** 标绘图形对象

> 示例：<br>
> 根据id获取标绘图形对象<br>
> let id = "标绘对象ID";<br>
> this.$_getPlottingPrimtiveByID(id);

### `$_getPlottingPrimtiveByIndex(index, vueIndex, vueKey)`

> 根据index获取标绘图形对象

- **参数1 - index:** `Number`
- **必传**
- **描述:** 标绘图形对象的index

- **参数2 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - primitive:** `Object`
- **描述:** 标绘图形对象

> 示例：<br>
> 根据index获取标绘图形对象<br>
> let index = "标绘对象的index";<br>
> this.$_getPlottingPrimtiveByIndex(index);

### `$_loadJson(json, vueIndex, vueKey)`

> 加载json数据

- **参数1 - json:** `Object or String`
- **必传**
- **描述:** 标绘元素生成的json对象

- **参数2 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 通过json加载标绘图形对象<br>
> let json = "标绘对象的json数据";<br>
> this.$_loadJson(json);

### `$_getJsonById(id, vueIndex, vueKey)`

> 通过id来获取标绘对象的json数据

- **参数1 - id:** `String`
- **必传**
- **描述:** 标绘对象的ID

- **参数2 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - json:** `Object`
- **描述:** 标绘对象的json数据

> 示例：<br>
> 通过id来获取标绘对象的json数据<br>
> let id = "标绘对象的ID";<br>
> this.$_getJsonById(id);

### `$_exportToJson(vueIndex, vueKey)`

> 将整个图层导出为json数据

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - json:** `Object`
- **描述:** 标绘图层的JSON对象

> 示例：<br>
> 将默认图层导出为json数据<br>
> this.$_exportToJson();
> 将指定图层导出为json数据<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_exportToJson(vueIndex, vueKey);

### `$_exportToFile(dataSource, title)`

> 将数据导出为文件

- **参数1 - dataSource:** `Any`
- **必传**
- **描述:** 要导出为文件的数据

- **参数2 - title:** `String`
- **可选**
- **描述:** 文件名

> 示例：<br>
> 将数据导出为文件<br>
> this.$_exportToFile("你的数据", "文件名");

### `$_removeAllPirmive(vueIndex, vueKey)`

> 移除图层所有标绘图形

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - isRemove:** `Boolean`
- **描述:** 是否移除成功

> 示例：<br>
> 移除默认图层的所有标绘对象<br>
> this.$_removeAllPirmive();
> 移除指定图层的所有标绘对象<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_removeAllPirmive(vueIndex, vueKey);

### `$_removePlottingPrimitiveByIndex(index, vueIndex, vueKey)`

> 根据index移除选中标绘图形

- **参数1 - index:** `Number`
- **可选**
- **描述:** 要移除的标绘图形的index

- **参数2 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - isRemove:** `Boolean`
- **描述:** 是否移除成功

> 示例：<br>
> 根据index，移除默认图层的标绘对象<br>
> let index = "标绘对象的index";<br>
> this.removePlottingPrimitiveByIndex(index);
> 根据index，移除指定图层的标绘对象<br>
> let index = "标绘对象的index";<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_removePlottingPrimitiveByIndex(index, vueIndex, vueKey);

### `$_removePlottingPrimiveByID(index, vueIndex, vueKey)`

> 根据ID移除选中标绘图形

- **参数1 - ID:** `Number`
- **可选**
- **描述:** 要移除的标绘图形的ID

- **参数2 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数3 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **返回值 - isRemove:** `Boolean`
- **描述:** 是否移除成功

> 示例：<br>
> 根据ID，移除默认图层的标绘对象<br>
> let ID = "标绘对象的index";<br>
> this.$_removePlottingPrimiveByID(ID);
> 根据ID，移除指定图层的标绘对象<br>
> let ID = "标绘对象的ID";<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_removePlottingPrimiveByID(ID, vueIndex, vueKey);

### `$_destroy(vueIndex, vueKey)`

> 销毁整个图层

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 销毁默认图层<br>
> this.$_destroy();
> 销毁指定图层<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_destroy(vueIndex, vueKey);

### `$_getAllPlottingPrimitive(vueIndex, vueKey)`

> 获取图层所有标绘图形

- **参数1 - vueIndex:** `String or Number`
- **可选**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 获取默认图层的所有标绘图形<br>
> this.$_getAllPlottingPrimitive();
> 获取指定图层的所有标绘图形<br>
> let vueIndex = "你的vueIndex";<br>
> let vueKey = "你的vueKey";<br>
> this.$_getAllPlottingPrimitive(vueIndex, vueKey);

### `$_formatType(type)`

> 将类型从英文转为中文

- **参数1 - type:** `String`
- **必传**
- **描述:** 类型，英文

- **返回值 - type:** `String`
- **描述:** 类型，中文

> 示例：<br>
> 将类型从英文转为中文<br>
> let type = this.$_formatType("英文type");

### `$_getId(random)`

> 获取随机数字id

- **参数1 - random:** `Number`
- **必传**
- **描述:** 随机数因子

- **返回值 - id:** `Number`
- **描述:** id

> 示例：<br>
> 获取随机数字id<br>
> let id = this.$_getId();
> 指定随机数<br>
> let id = this.$_getId(1000000000000);