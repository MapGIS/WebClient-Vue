# 量测组件

> mapgis-3d-measure

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

### `measureOptions`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:**
  > 测量参数。

### `enableMeasureLength(直线测量)参数`

| 名称                     | 类型                   | 默认值                         | 描述                                                                             |
| ------------------------ | ---------------------- | ------------------------------ | -------------------------------------------------------------------------------- |
| callBack                 | function               | function(e){}                  | 回调函数，回调结果单位为米                                                       |
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

### `enableMeasureArea(面积测量)参数`

| 名称                     | 类型                   | 默认值                          | 描述                                                                             |
| ------------------------ | ---------------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| callBack                 | function               | function(e){}                   | 回调函数，回调结果单位为米                                                       |
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

### `enableMeasureTriangle(三角测量)参数`

| 名称                     | 类型                   | 默认值                          | 描述                                                                             |
| ------------------------ | ---------------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| callBack                 | function               | function(e){}                   | 回调函数，回调结果单位为米                                                       |
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

## 槽

### `default`

- **描述:** Measure 的自定义槽的实现，可以自定义绘制控件样式

## 事件

### `@load`

- **描述:** 在 Measure 加载完毕后发送该事件
- **回调参数** `{ Measure }`
- `Measure` Measure 对象

### `@unload`

- **描述:** 在 Measure 注销完毕后发送该事件

### `@measured`

- **描述:** 在 Measure 测量完毕后发送该事件
  > 直线测量结果：Array,[起始点（0），第一次点击距离起始点的长度，第二次点击距离起始点的长度，...，右键结束测量后，最后一个点距离起始点的长度]，
  > 单位：千米 <br/>
  > 面积测量结果：Number,测量的面积，单位：平方米 <br/>
  > 三角测量结果：Object,{horizontalDiatance（水平距离）,slantDiatance（直线距离）,verticalDiatance（高差）} <br/>
  > 坡度测量：number，坡度，单位：度
- **回调参数** `{ result }`

## 方法

### `enableMeasureLength()`

- **描述:** 激活直线测量功能

### `enableMeasureArea()`

- **描述:** 激活面积测量功能

### `enableMeasureTriangle()`

- **描述:** 激活三角测量功能

### `enableMeasureSlope()`

- **描述:** 激活坡度测量功能

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
