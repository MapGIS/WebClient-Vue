# 基本地图

## 添加地图组件

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
    }
  }
};
</script>
```

### Vue 组件

```md
::: demo
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

:::
```

### 结果

::: demo
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

:::

### 通过 Props 来交互地图属性

你可以通过 props 来控制地图的一些参数如 zoom(缩放级别), bearing(方位), pitch(倾斜)等.

如果你给 props 参数设置了 `.sync` 修饰 ([Vue docs](https://vuejs.org/v2/guide/components.html#sync-Modifier)),
这些参数将会在对应的事件结束后同步更新(这里不见得是实时同步更新，这里强调的是事件结束同步更新).

> 例如,如果你使用 `flyTo` 方法, props `zoom`, `center`, `bearing`, `pitch` 这些属性将会在飞行动画结束后执行.

完整的 props 列表请查看[API docs](/zh/api/#props), 注意文字描述中的字段'Synced'

## 地图加载

当地图加载完毕,即 map.on(load,callback)事件响应, `mapbox-map`组件就会发送 `load` 事件. 整个事件的载荷 payload 会包含 Mapbox GL JS `Map` 对象.

```js
onMapLoaded(payload) {
  // in component
  this.map = payload.map; // 等价于 new mapboxGl.Map()
}
```

所有的`mapbox-map`的内部组件都会在地图完全加载完毕后才加载渲染。

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
  <mapbox-map
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
    @load="onMapLoaded"
  />
</template>

<script>
export default {
  // …component code…
  created() {
    this.map = null; //这里的this.map 不是指的 props/data里面的map 而是传统的js对象的属性参数
  },
  methods: {
    onMapLoaded(event) {
      // 组件内部使用， 相信我，绝大部分场景都可以满足应用场景，
      // 少数场景请使用上面的方案三配合Promise的方式来全局调用
      this.map = event.map;
      // 或者只是存起来，加入全局vuex的状态存储中，以方便其他组件使用map对象，
      // 真心不建议,应为很容易在其他地方误触this.$store.map的setter事件
      this.$store.map = event.map;
    }
  }
};
</script>
```

### Events

全部的地图行为请看 [API](/zh/api/#events) 页面.
