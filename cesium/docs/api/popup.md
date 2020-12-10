# Popup

## Props

### `position`

- **类型**: `Object`
- **non-synced属性**
- **描述:** 该参数一共有3种不同的传递方式：
  1. `entity`, 传入任意一个Cesiumd的Entity实体，然后根据该实体的中心点position显示对应的popup
  1. `cartesian`, 传入一个cartesian3的坐标点{x,y,z},然后将popup显示在此处
  1. `longitude`/`latitude`/`height`,传入经纬度以及高度，内部转换成cartesian3的坐标点{x,y,z}，然后将popup显示在此处

  |参数名称|类型|说明|
  |:---|:---|:---|
  |entity|Entity|实体,内部获取坐标点cartesian, 输入此参数可忽略下面的，cartesian，longitude,latitude|
  |cartesian|Cartesian3|先判断entity是否存在，存在忽略此参数.笛卡尔积坐标点cartesian, 输入此参数可忽略下面的longitude,latitude|
  |longitude|Number|经度, 先判断cartesian是否存在，存在忽略此参数|
  |latitude|Number|纬度, 先判断cartesian是否存在，存在忽略此参数|
  |height|Number|高度, 可选 默认0|

### `options`

- **类型**: `Object`
- **non-synced属性**
- **描述:** 对象传参方式
1. `popupId` 外部传入id，用来指定特殊的id，用于外部获取该DOM事件/样式个性化定制
1. `popupContentId` 外部传入id，用来指定特殊的id，用于外部获取该DOM事件/样式个性化定制
1. `postRender` 关闭此参数会提升性能，但是会减少视觉效果
1. `showClose` 一旦上面采取非entiy的方式创建Popup,一旦关闭后无法通过交互激活Popup,只能通过对应的代码对象的`popup.show()`方法重新激活。

  |参数名称|类型|说明|
  |:---|:---|:---|
  |popupId|String|本次popup对应的唯一id,不传随机生成|
  |popupContentId|String|本次popup对应的唯一内容id,不传随机生成|
  |postRender|Boolean|是否实时渲染|
  |showClose|Boolean|是否显示关闭按钮|
  

### `container`

- **类型**: `String`
- **non-synced属性**
- **描述:** 外部传递htmlString给popup的内部content的DIV内容进行填充，一般这个都在配合echarts时同步使用，主要是让外部的echart或者其他需要主动操作dom的元素进行初始化操作

``` javascript
const popup = new CesiumZondy.Overlayer.PopupLayer(
  webGlobe.viewer,
  {
    // entity: entity,
    cartesian: c,
  },
  {
    /* popupId: "cesium-popup-id-1", //要保证唯一性
  popupContentId: "cesium-popup-content-id-1", //要保证唯一性 */
    postRender: true, //是否实时刷新
    showClose: true,
  },
  '<div id="echarts_id" style="height:100px;width:200px;color:#fff;">echats内容</div>'
);
var myChart = echarts.init(document.getElementById("echarts_id"));
myChart.setOption(option);
```