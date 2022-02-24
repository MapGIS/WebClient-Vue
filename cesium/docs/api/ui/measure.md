# 量测组件

> mapgis-3d-measure

## 属性

| 名称                                                | 类型   | 默认值    | 是否必填 | 描述                                                                                                                                                                                                                     | 是否监听 |
| --------------------------------------------------- | ------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| vueKey                                              | String | `default` | `否`     | mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。 | `否`     |
| vueIndex                                            | Number | 随机数    | `否`     | 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。                                                                                                            | `否`     |
| styles                                              | Object | {}        | `否`     | 线颜色（推荐在 measureOptions 里面设置样式，可选择更多）                                                                                                                                                                 | `是`     |
| [measureOptions(直线测量)](#measureOptionsLength)   | Object | {}        | `否`     | 直线测量参数，参考[measureOptions(直线测量)](#measureOptionsLength)                                                                                                                                                      | `是`     |
| [measureOptions(面积测量)](#measureOptionsArea)     | Object | {}        | `否`     | 面积测量参数，参考[measureOptions(面积测量)](#measureOptionsArea)                                                                                                                                                        | `是`     |
| [measureOptions(三角测量)](#measureOptionsTriangle) | Object | {}        | `否`     | 三角测量参数，参考[measureOptions(三角测量)](#measureOptionsTriangle)                                                                                                                                                    | `是`     |

## 槽

| 名称    | 描述                                             |
| ------- | ------------------------------------------------ |
| default | Measure 的自定义槽的实现，可以自定义绘制控件样式 |

## 事件

| 名称     | 描述                            | 回调参数            |
| -------- | ------------------------------- | ------------------- |
| load     | 在 Measure 加载完毕后发送该事件 | `{ Measure }`       |
| unload   | 在 Measure 注销完毕后发送该事件 | `无`                |
| measured | 在 Measure 测量完毕后发送该事件 | [result](#callBack) |

## 方法

| 名称                    | 描述             |
| ----------------------- | ---------------- |
| enableMeasureLength()   | 激活直线测量功能 |
| enableMeasureArea()     | 激活面积测量功能 |
| enableMeasureTriangle() | 激活三角测量功能 |
| enableMeasureSlope()    | 激活坡度测量功能 |

## 示例

### 简单使用

::: demo

```vue
<template>
  <div id="app">
    <mapgis-web-scene>
      <mapgis-3d-measure
        :measureOptions="measureOptions"
        @load="handleLoad"
        @measured="measured"
      >
        <div id="toolbar-wrapper">
          <div class="toolbar-item" v-on:click="measureLength">直线测量</div>
          <div class="toolbar-item" v-on:click="measureArea">面积测量</div>
          <div class="toolbar-item" v-on:click="measureTriangle">三角测量</div>
          <div class="toolbar-item" v-on:click="measureSlope">坡度测量</div>
          <div class="toolbar-item" v-on:click="deleteMeasure">删除</div>
        </div>
      </mapgis-3d-measure>
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      //测量参数
      measureOptions: {}
    };
  },
  methods: {
    handleLoad(measure) {
      console.log("地图加初始化完毕！", measure);
      //取得测量组件对象
      this.measure = measure;
    },
    measured(result) {
      //取得测量结果
      console.log("result", result);
    },
    measureLength() {
      //激活直线测距
      this.measure && this.measure.enableMeasureLength();
    },
    measureArea() {
      //激活面积测量
      this.measure && this.measure.enableMeasureArea();
    },
    measureTriangle() {
      //激活三角测量
      this.measure && this.measure.enableMeasureTriangle();
    },
    deleteMeasure() {
      //删除测量结果
      this.measure && this.measure.deleteMeasure();
    }
  }
};
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
#toolbar-wrapper {
  position: absolute;
  z-index: 9999;
  display: inline-flex;
  overflow-x: hidden;
  overflow-y: visible;
  top: 20px;
  left: 20px;
}
.toolbar-item {
  background: #ffffff;
  border: 1px dashed #666666;
  text-align: center;
  font-size: 20px;
  line-height: 20px;
  height: fit-content;
  padding: 6px 16px;
  cursor: pointer;
}
</style>
```

:::

### 多屏使用

```vue
<template>
  <div id="app">
    <!--第一个webscene-->
    <mapgis-web-scene v-bind:vueKey="vueKeyOne"> </mapgis-web-scene>
    <!--第二个webscene，多个webscene请指定vueKey来标识组件，这里让测量组件作用在vueKey为vueKeyTwo的组件上-->
    <mapgis-web-scene v-bind:vueKey="vueKeyTwo">
      <mapgis-3d-Measure
        v-bind:vueKey="vueKeyTwo"
        @load="handleLoad"
        @measured="measured"
      >
        <div id="toolbar-wrapper">
          <div class="toolbar-item" v-on:click="measureLength">直线测量</div>
          <div class="toolbar-item" v-on:click="measureArea">面积测量</div>
          <div class="toolbar-item" v-on:click="measureTriangle">三角测量</div>
          <div class="toolbar-item" v-on:click="measureSlope">坡度测量</div>
          <div class="toolbar-item" v-on:click="deleteMeasure">删除</div>
        </div>
      </mapgis-3d-Measure>
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  name: "cesiumWmtsLayer",
  data() {
    return {
      vueKeyOne: "sceneOne",
      vueKeyTwo: "sceneTwo"
    };
  },
  methods: {
    handleLoad(measure) {
      console.log("地图加初始化完毕！", measure);
      //取得测量组件对象
      this.measure = measure;
    },
    measured(result) {
      //取得测量结果
      console.log("result", result);
    },
    measureLength() {
      //激活直线测距
      this.measure && this.measure.enableMeasureLength();
    },
    measureArea() {
      //激活面积测量
      this.measure && this.measure.enableMeasureArea();
    },
    measureTriangle() {
      //激活三角测量
      this.measure && this.measure.enableMeasureTriangle();
    },
    measureSlope() {
      //激活坡度测量
      this.measure && this.measure.enableMeasureSlope();
    },
    deleteMeasure() {
      //删除测量结果
      this.measure && this.measure.deleteMeasure();
    }
  }
};
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
}
#toolbar-wrapper {
  position: absolute;
  z-index: 9999;
  display: inline-flex;
  overflow-x: hidden;
  overflow-y: visible;
  top: 20px;
  left: 20px;
}
.toolbar-item {
  background: #ffffff;
  border: 1px dashed #666666;
  text-align: center;
  font-size: 20px;
  line-height: 20px;
  height: fit-content;
  padding: 6px 16px;
  cursor: pointer;
}
</style>
```

## 参数详情

### <span id="measureOptionsLength">`measureOptions(直线测量)`</span>

| 名称                     | 类型                   | 默认值                         | 描述                                                                             |
| ------------------------ | ---------------------- | ------------------------------ | -------------------------------------------------------------------------------- |
| [callBack](#callBack)    | function               | function(e){}                  | 回调函数，参考[callBack](#callBack)                                              |
| lineColor                | Cesium.Color Or String | Color.AQUA                     | 边线颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）         |
| font                     | String                 | '12pt 楷体'                    | 字体以及大小，详见https://html.spec.whatwg.org/multipage/canvas.html#text-styles |
| fillColor                | Cesium.Color Or String | Color.WHITE                    | 字体颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）         |
| outlineColor             | Cesium.Color Or String | Color.WHITE                    | 文字外边线的颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'） |
| outlineWidth             | Number                 | 4.0                            | 文字外边线的宽度                                                                 |
| showBackground           | Boolean                | true                           | 是否显示文字的背景                                                               |
| backgroundColor          | Cesium.Color Or String | new Cesium.Color(0, 0, 0, 0.4) | 文字背景的颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）   |
| showMoreInfo             | Boolean                | false                          | 是否显示详细测量信息                                                             |
| exHeight                 | Number                 | 0                              | 附加高程偏移 （避免遮挡）                                                        |
| disableDepthTestDistance | Number                 | Number.POSITIVE_INFINITY       | 只要小于这个距离深度检测就会失效，就会一直显示在最前面 不会被遮挡                |
| isTerrain                | Boolean                | false                          | 是否针对地形，为 true 时对地形数据进行贴地距离测量，为 false 时进行直线距离测量  |
| paneNum                  | Number                 | 32                             | 地形贴地距离测量中，向每段中插入采样点的数量                                     |
| pixelOffset              | Cesium.Cartesian2      | new Cartesian2(0, -4)          | 相对于设定点的偏移位置                                                           |
| unit                     | String                 | kilometers                     | 显示距离的单位，可选值为 kilometers、meters                                      |
| fixNum                   | Number                 | 4 or 0                         | unit 为 kilometers 默认值为 4，为 meters 时，默认值为 0                          |
| pointIcon                | String                 | 默认图标                       | 测量点的图标，不传则用默认图标                                                   |
| pointIconWith            | Number                 | 16                             | 测量点图标的宽度                                                                 |
| pointIconHeight          | Number                 | 16                             | 测量点图标的高度                                                                 |
| pointIconScale           | Number                 | 1.2                            | 测量点图标的缩放比例                                                             |
| pointIconOffsetX         | Number                 | 0                              | 测量点图标的 X 轴偏移，用于微调图标位置                                          |
| pointIconOffsetX         | Number                 | -5                             | 测量点图标的 Y 轴偏移，用于微调图标位置                                          |
| closeIcon                | String                 | 默认图标                       | 删除测量结果图标，不传则用默认图标                                               |
| closeIconWith            | Number                 | 16                             | 删除测量结果图标的宽度                                                           |
| closeIconHeight          | Number                 | 16                             | 删除测量结果图标的高度                                                           |
| closeIconScale           | Number                 | 1                              | 删除测量结果图标的缩放比例                                                       |
| closeIconOffsetX         | Number                 | 3                              | 删除测量结果图标的 X 轴偏移，用于微调图标位置                                    |
| closeIconOffsetX         | Number                 | 3                              | 删除测量结果图标的 Y 轴偏移，用于微调图标位置                                    |

### <span id="measureOptionsArea">`measureOptions(面积测量)`</span>

| 名称                     | 类型                   | 默认值                          | 描述                                                                             |
| ------------------------ | ---------------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| [callBack](#callBack)    | function               | function(e){}                   | 回调函数，参考[callBack](#callBack)                                              |
| lineColor                | Cesium.Color Or String | Color.AQUA                      | 边线颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）         |
| areaColor                | Cesium.Color Or String | Color.CHARTREUSE.withAlpha(0.5) | 选定区域颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）     |
| font                     | String                 | '12pt 楷体'                     | 字体以及大小，详见https://html.spec.whatwg.org/multipage/canvas.html#text-styles |
| fillColor                | Cesium.Color Or String | Color.WHITE                     | 字体颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）         |
| outlineColor             | Cesium.Color Or String | Color.WHITE                     | 文字外边线的颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'） |
| outlineWidth             | Number                 | 4.0                             | 文字外边线的宽度                                                                 |
| showBackground           | Boolean                | true                            | 是否显示文字的背景                                                               |
| backgroundColor          | Cesium.Color Or String | new Cesium.Color(0, 0, 0, 0.4)  | 文字背景的颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）   |
| showMoreInfo             | Boolean                | false                           | 是否显示详细测量信息                                                             |
| exHeight                 | Number                 | 0                               | 附加高程偏移 （避免遮挡）                                                        |
| disableDepthTestDistance | Number                 | Number.POSITIVE_INFINITY        | 只要小于这个距离深度检测就会失效，就会一直显示在最前面 不会被遮挡                |
| isTerrain                | Boolean                | false                           | 是否针对地形，为 true 时对地形数据进行贴地距离测量，为 false 时进行直线距离测量  |
| paneNum                  | Number                 | 32                              | 地形贴地距离测量中，向每段中插入采样点的数量                                     |
| pixelOffset              | Cesium.Cartesian2      | new Cartesian2(0, -4)           | 相对于设定点的偏移位置                                                           |
| xPaneNum                 | Number                 | 32                              | 地形贴地面积测量中，向经度方向插入采样点的数量                                   |
| yPaneNum                 | Number                 | 32                              | 地形贴地面积测量中，向纬度方向插入采样点的数量                                   |
| verticalOrigin           | Cesium.VerticalOrigin  | VerticalOrigin.BOTTOM           | 面积测量结果的 label 的摆放位置                                                  |
| spaceArea                | Boolean                | false                           | 是否计算空间点面积 默认计算的是球面投影面积                                      |

### <span id="measureOptionsTriangle">`measureOptions(三角测量)`</span>

| 名称                     | 类型                   | 默认值                          | 描述                                                                             |
| ------------------------ | ---------------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| [callBack](#callBack)    | function               | function(e){}                   | 回调函数，参考[callBack](#callBack)                                              |
| lineColor                | Cesium.Color Or String | Color.AQUA                      | 边线颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）         |
| lineMaterial             | Cesium.Material        | 纯色                            | 线材质，详见 Cesium 材质对象                                                     |
| pointColor               | Cesium.Color Or String | Color.CHARTREUSE.withAlpha(0.5) | 点颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）           |
| font                     | String                 | '12pt 楷体'                     | 字体以及大小，详见https://html.spec.whatwg.org/multipage/canvas.html#text-styles |
| fillColor                | Cesium.Color Or String | Color.WHITE                     | 字体颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）         |
| outlineColor             | Cesium.Color Or String | Color.WHITE                     | 文字外边线的颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'） |
| outlineWidth             | Number                 | 4.0                             | 文字外边线的宽度                                                                 |
| showBackground           | Boolean                | true                            | 是否显示文字的背景                                                               |
| backgroundColor          | Cesium.Color Or String | new Cesium.Color(0, 0, 0, 0.4)  | 文字背景的颜色，Cesium 颜色对象或者 css 颜色字符串（'#XXX 或 rgb()或 rgba()'）   |
| disableDepthTestDistance | Number                 | Number.POSITIVE_INFINITY        | 只要小于这个距离深度检测就会失效，就会一直显示在最前面 不会被遮挡                |
| pixelOffset              | Cesium.Cartesian2      | new Cartesian2(0, -4)           | 相对于设定点的偏移位置                                                           |
| verticalOrigin           | Cesium.VerticalOrigin  | VerticalOrigin.BOTTOM           | 面积测量结果的 label 的摆放位置                                                  |

### <span id="callBack">`callBack(回调函数)返回值`</span>

| 名称             | 类型  | 默认值 | 描述                                                                |
| ---------------- | ----- | ------ | ------------------------------------------------------------------- |
| result(直线测量) | Array | []     | 绘制结果，[length1(第一个点的距离，永远为 0), length2, length3,...] |
| result(三角测量) | Array | []     | 绘制结果，参考[resultTriangle](#resultTriangle)                     |
| result(面积测量) | Array | []     | 绘制结果，单位米                                                    |

### <span id="resultTriangle">`result(三角测量)`</span>

| 名称               | 类型   | 默认值 | 描述             |
| ------------------ | ------ | ------ | ---------------- |
| horizontalDiatance | Number | 0      | 水平距离，单位米 |
| slantDiatance      | Number | 0      | 直线距离，单位米 |
| verticalDiatance   | Number | 0      | 高差，单位米     |
| slope              | Number | 0      | 坡度，单位度     |
