# GraphicLayerService 标注服务工具类

> mapgis-3d-graphic-layer-service

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

### `$_initGraphicLayer(vueIndex, vueKey, viewer)`

> 通过vueIndex, vueKey，初始化一个graphicsLayer对象，请用$_getGraphicLayer方法获取GraphicLayer对象，不要将此对象绑定在vue上

- **参数1 - vueIndex:** `String or Number`
- **必传**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **可选**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

- **参数3 - viewer:** `Object`
- **可选**
- **描述:** Cesium的Viewer对象，不传则使用注入的Viewer对象

> 示例：<br>
> 始化一个GraphicLayer对象： this.$_initGraphicLayer(vueIndex);<br>
> 有多个Cesium球体时（多个分屏）,初始化一个GraphicLayer对象： <br>
> this.$_initGraphicLayer(vueIndex, vueKey);<br>
> 使用外部的viewer对象：<br>
> this.$_initGraphicLayer(vueIndex, vueKey, viewer);

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
> 仅有一个GraphicLayer对象时，获取该对象： 
> let graphicsLayer = this.$_getGraphicLayer();<br>
> 当在一个球体上，有多个GraphicLayer对象时，获取该对象，请指定vueIndex： <br>
> let graphicsLayer = this.$_getGraphicLayer(vueIndex);<br>
> 当有多个球体，多个GraphicLayer对象时，获取该对象，请指定vueIndex以及vueKey：<br>
> let graphicsLayer = this.$_getGraphicLayer(vueIndex, vueKey);


### `$_switchGraphicLayer(vueIndex, vueKey)`
> 通过vueKey，vueIndex来切换graphicsLayerService默认对应的graphicsLayer对象

- **参数1 - vueIndex:** `String or Number`
- **必传**
- **描述:** graphicLayer的唯一标识，随机生成的数字或字符串

- **参数2 - vueKey:** `String`
- **必传**
- **描述:** cesium球体的唯一标识，默认值default，当分屏时使用此对象标识多个球体

> 示例：<br>
> 切换graphicsLayerService默认对应的graphicsLayer对象：
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
>   id: "你的ID", <br>
>   type: "label", <br>
>   text: "测试", <br>
>   font: "30px sans-serif", <br>
>   fillColor: Cesium.Color.WHITE <br>
> }; <br>
> this.$_startDrawing(options);<br>
> 在同一个球体上的指定的一个graphicsLayer上绘制要素：<br>
> this.$_startDrawing(options, vueIndex);<br>
> 在不同的球体上，选择一个graphicsLayer，绘制要素：<br>
> this.$_startDrawing(options, vueIndex, vueKey);<br>

### `layerStyle`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 控制地图的显隐、透明度以及顺序，有如下值：
  > visible Boolean 控制图层显示或隐藏，不会重新加载图层，true：显示图层、fales：隐藏图层 <br/>
  > opacity Number 控制图层透明度，会重新加载图层，0 - 1 之间的数字，0：隐藏，1：显示 <br/>
  > zIndex Number 控制图层顺序，会重新加载图层，类似 css 里面的 z-index，从 1 开始的数字 <br/>

## 示例

### 加载 4326 地图

::: demo

```vue

<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :baseUrl="baseUrl"/>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市"
    };
  }
};
</script>
```

:::

### 动态投影

```vue

<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :baseUrl="baseUrl" :srs="srs"/>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
      //动态投影
      srs: "EPSG: 3857"
    };
  }
};
</script>
```

### 设置样式 - 透明度、可见性、zIndex

```vue

<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :baseUrl="baseUrl" :layerStyle="layerStyle"/>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
      //图层样式
      layerStyle: {
        opacity: 0.5,
        visible: true,
        zIndex: 115
      }
    };
  }
};
</script>
```

### 设置子图层

```vue

<template>
  <mapgis-web-scene>
    <mapgis-3d-igs-doc-layer :baseUrl="baseUrl" :layers="layers"/>
  </mapgis-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //要加载的url
      baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
      //要显示的子图层
      layers: "show:1,2"
    };
  }
};
</script>
```

### 多个 mapgis-web-scene

```vue

<template>
  <mapgis-web-scene :vueKey="vueKey">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="baseUrlWmts"
      :wmtsLayer="layerWmts"
      :tileMatrixSet="tileMatrixSetIDWmts"
      :srs="srsWmts"
      :layerStyle="layerStyleWmts"
      :vueKey="vueKey"
    />
    <mapgis-3d-igs-doc-layer
      :baseUrl="baseUrlDoc"
      :layers="layers"
      :layerStyle="layerStyleDoc"
      :vueKey="vueKey"
    />
    <button @click="changeIndex">改变图层顺序</button>
  </mapgis-web-scene>
  <mapgis-web-scene :vueKey="vueKey2"/>
</template>

<script>
export default {
  data() {
    return {
      baseUrlWmts:
        "http://t0.tianditu.com/DataServer?T=vec_c&L={TileMatrix}&Y={TileRow}&X={TileCol}&tk=f5347cab4b28410a6e8ba5143e3d5a35",
      layerWmts: "",
      tileMatrixSetIDWmts: "",
      srsWmts: "EPSG:4326",
      layerStyleWmts: {
        zIndex: 100
      },
      //要加载的url
      baseUrlDoc: "http://develop.smaryun.com:6163/igs/rest/mrms/docs/北京市",
      //要显示的子图层
      layers: "show:1,2",
      //mapgis-web-scene的Id，组件唯一标识，多个图层时用来查找webGlobe
      vueKey: "vueKeyOne",
      vueKey2: "vueKeyTwo",
      layerStyleDoc: {
        zIndex: 1000
      }
    };
  },
  methods: {
    changeIndex() {
      if (this.layerStyleDoc.zIndex === 1000) {
        this.layerStyleDoc.zIndex = 50;
      } else {
        this.layerStyleDoc.zIndex = 1000;
      }
    }
  }
};
</script>
```
