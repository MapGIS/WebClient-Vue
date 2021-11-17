# 基本地图

::: demo

```html
<template>
  <mapgis-web-scene class="mapgis-3d-scene">
    <mapgis-3d-ogc-wmts-layer
      :baseUrl="baseUrl"
      :wmtsLayer="wmtsLayer"
      :tilingScheme="tilingScheme"
      :tileMatrixSet="tileMatrixSet"
      :format="format"
      :layerStyle="layerStyle"
    >
    </mapgis-3d-ogc-wmts-layer>
  </mapgis-web-scene>
</template>

<script>
  export default {
    components: {
      "mapgis-web-scene": window.Mapgis3d.MapgisWebScene,
      "mapgis-3d-ogc-wmts-layer": window.Mapgis3d.Mapgis3dOgcWmtsLayer
    },
    data: function() {
      return {
        baseUrl:
          "http://t6.tianditu.gov.cn/vec_c/wmts?tk=9c157e9585486c02edf817d2ecbc7752",
        wmtsLayer: "vec",
        tileMatrixSet: "c",
        tilingScheme: "EPSG:4326",
        format: "tiles",
        layerStyle: {
          zIndex: 1
        }
      };
    },
    methods: {}
  };
</script>
<style>
  .mapgis-3d-scene {
    height: 300px;
  }
</style>
```

:::

## 添加地图场景组件

> 强烈建议使用前了解基本的 cesium 引导[Cesium - 向导](https://cesium.com/docs/) 以及 cesium 的开发方式[cesium - API](https://cesium.com/docs/cesiumjs-ref-doc/)

如果你使用的地形是 cesium 提供的地形, 需要设置[Cesium ion](https://cesium.com/docs/oauth/). 更多细节请查看[Ion](https://cesium.com/ion).

如果你使用`MapGIS-IGServer`提供的地形数据，你可以忽略该参数

::: tip
上一章节文件`拷贝目录`中的 2 个路径，这里初始化的时候就需要传入`libPath`以及`pluginPath` 如果不传入则从司马云上自动下载对应的网络地址，没有互联网则无法下载

```sh
# quasar 的静态资源目录为src/static
# 常见的静态资源目录为 public
# 主Cesium主体路径 对应 libPath
path/to/statics/cesium/Cesium.js
# Cesium拓展插件路径 对应 pluginPath
path/to/statics/cesium/webclient-cesium-plugins.js
```

:::

```vue
<template>
  <mapgis-web-scene
    libPath="statics/cesium/Cesium.js"
    pluginPath="statics/cesium/webclient-cesium-plugin.min.js"
    @load="handleLoad"
  />
</template>

<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>

<script>
import { MapgisWebScene } from "@mapgis/webclient-vue-cesium";

export default {
  components: {
    MapgisWebScene
  },
  methods: {
    handleLoad(payload) {
      const { Cesium, CesiumZondy, component } = payload;
      this.Cesium = Cesium;
      this.CesiumZondy = CesiumZondy;
      let webGlobe = window.webGlobe; // 获取实例化的Cesium场景对象
    }
  }
};
</script>
```

### Vue 组件

```md
<template>
<button class="animated shake infinite" @click="onClick">Click me!</button>
</template>

<script>
export default {
    methods: {
        onClick: () => { window.alert(1) },
    },
}
</script>

<style>
button {
    color: blue;
}
</style>
```

### 结果

```vue
<template>
  <button class="animated shake infinite" @click="onClick">Click me!</button>
</template>

<script>
export default {
  methods: {
    onClick: () => {
      window.alert(1);
    }
  }
};
</script>

<style>
button {
  color: blue;
}
</style>
```

:::

### 通过 Props 来交互场景属性

你可以通过 props 来控制地图场景的一些参数如 viewerMode(显示模式), animation(动画播放器), timeline(时间线), cameraView(初始化视角)等.

完整的 props 列表请查看[API docs](/zh/api/#props), 注意文字描述中的字段'侦听属性'

## 场景加载

当地图场景加载完毕,即 map.on(load,callback)事件响应, `mapgis-web-scene`组件就会发送 `load` 事件. 整个事件的载荷 payload 会包含 CesiumJS `Cesium` 对象、MapGIS `CesiumZondy`对象以及发送当前事件的`mapgis-web-scene`组件。

```js
onMapLoaded(payload) {
  // in component
  const {component, Cesium, CesiumZondy } = payload;
  // component 当前场景组件
  // Cesium 标准Cesium对象
  // CesiumZondy 中地Cesium对象
}
```

所有的`mapgis-web-scene`的内部组件都会在地图完全加载完毕后才加载渲染。

::: warning Vuex 存储 Map 对象
请注意，除了基本类型和普通对象外，向 Vuex 或组件的“data”添加其他类型的对象通常都不是一个好主意。尤其是类似以下几种情况:

1.  向 vuex 的 store 中添加地图 map，以方便其他组件使用, `强烈不推荐`
    ```js
    this.$store.map = map;
    ```
2.  向组件的 data 属性添加地图 map,`强烈不推荐`
    ```js
      data(){
        return {
          map: undefined
        }
      },
      // 某处代码....
      this.map = map;
    ```
3.  向全局的对象中添加地图 map，以方便全局使用,实在没办法了可以这样使用
    ```js
    window.globalMap = window.globalMap || map;
    ```
    > 某种情况来说，采取第 3 种相对容易找到出 bug 的原因，第 1,2 种很容易导致不知名的 bug，如（更新延迟等）且短时间找不到原因 Orz...

Vue 为每个属性添加了 getter 和 setter 方法，所以如果你将 Map 对象添加到 Vuex store 或组件 data 中，可能会导致奇怪的 bug。
如果希望存储映射对象，请将其存储为非响应性属性，如下面的示例所示。
:::

```vue
<template>
  <mapgis-web-scene @load="onMapLoaded" />
</template>

<script>
export default {
  // …component code…
  created() {
    this.map = null; //这里的this.map 不是指的 props/data里面的map 而是传统的js对象的属性参数
  },
  methods: {
    onMapLoaded(event) {
      // 组件内部使用，绝大部分场景都可以满足应用场景，
      // 少数场景请使用上面的方案三配合Promise的方式来全局调用
      this.webGlobe = window.webGlobe;
      // 或者只是存起来，加入全局vuex的状态存储中，以方便其他组件使用map对象，
      // 强烈禁止,应为很容易在其他地方误触this.$store.map的setter事件
      this.$store.webGlobe = window.webGlobe;
    }
  }
};
</script>
```

### 事件

全部的地图行为请看 [API](/api/#events) 页面.
