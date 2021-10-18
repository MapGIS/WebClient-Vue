# 基本地图

## 添加地图组件

为了使用 mapbox-gl.js 你需要一个基础的[地图样式](https://www.mapbox.cn/mapbox-gl-js/style-spec/).

> 强烈建议使用前了解基本的 mapboxgl 的开发方式[mapboxgl-中文开发文档](https://www.mapbox.cn/mapbox-gl-js/api/)

如果你使用的是 mapbox 提供的底图或者样式, 需要设置 `access_token`. 更多细节请查看[官方秘钥](https://mapbox.com/help/define-access-token/).

如果你使用`MapGIS-IGServer`提供的底图或者样式，你可以忽略该参数

::: demo

```html
<template>
  <mapgis-web-map
    :crs="crs"
    class="mapgis-2d-map"
    :mapStyle="mapStyle"
    :center="center"
    :zoom="zoom"
    @load="handleMapLoad"
  >
    <mapgis-rastertile-layer
      layerId="tdt"
      url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
    />
  </mapgis-web-map>
</template>

<script>
  export default {
    components: {
      "mapgis-web-map": window.Mapgis2d.MapgisWebMap,
      "mapgis-rastertile-layer": window.Mapgis2d.MapgisRasterLayer
    },
    data: function() {
      return {
        mapStyle: {
          version: 8,
          sources: {},
          layers: [
            {
              id: "背景",
              type: "background",
              paint: {
                "background-color": "rgba(0, 0, 0, 0.5)"
              }
            }
          ]
        },
        zoom: 3,
        center: [114.3, 30.5],
        crs: "EPSG:4326"
      };
    },
    created() {
      console.log("window", window);
    },
    methods: {
      handleMapLoad(payload) {
        console.log(payload);
      }
    }
  };
</script>
<style>
  .mapgis-2d-map {
    height: 300px;
  }
</style>
```

:::

::: tip
如果你需要显示的传入 mapbox-gl-js 的脚本, 请实现`mapboxGl`参数. 延迟加载后可以使用该脚本

> 这里建议使用 @mapgis/mapbox-gl 而不是开源的 mapbox-gl

Example:

```vue
<script>
import mapboxgl from "@mapgis/mapbox-gl";
</script>

<template>
  <mapgis-web-map
    :mapboxGl="mapboxgl"
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
    @load="onMapLoaded"
  />
</template>
```

如果该参数没有传入，默认内部使用@mapgis/mapbox-gl
:::

### 通过 Props 来交互地图属性

你可以通过 props 来控制地图的一些参数如 zoom(缩放级别), bearing(方位), pitch(倾斜)等.

如果你给 props 参数设置了 `.sync` 修饰 ([Vue docs](https://vuejs.org/v2/guide/components.html#sync-Modifier)),
这些参数将会在对应的事件结束后同步更新(这里不见得是实时同步更新，这里强调的是事件结束同步更新).

> 例如,如果你使用 `flyTo` 方法, props `zoom`, `center`, `bearing`, `pitch` 这些属性将会在飞行动画结束后执行.

完整的 props 列表请查看[API docs](/api/#props), 注意文字描述中的字段'Synced'

## 地图加载

当地图加载完毕,即 map.on(load,callback)事件响应, `mapgis-web-map`组件就会发送 `load` 事件. 整个事件的载荷 payload 会包含 Mapbox GL JS `Map` 对象.

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
  <mapgis-web-map
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

## 地图行为

异步的地图方法暴露在 `mapbox-map`组件的 `actions` 属性上。 这些行为方法 会返回`Promise`，当行为结束后会执行解析操作`resolves`

Promise 会返回 map 中被对应的行为`影响的属性properties`。

例如:

```vue
<script>
export deafult {
  name: 'App',

  methods: {
    async onMapLoad(event) {
      // Here we cathing 'load' map event
      const asyncActions = event.component.actions
      // 这里的语法将原本的异步的语法变成了同步语法，避免了回调地狱
      const newParams = await asyncActions.flyTo({
        center: [30, 30],
        zoom: 9,
        speed: 1
      })
      console.log(newParams)
      /* => {
              center: [30, 30],
              zoom: 9,
              bearing: 9,
              pitch: 7
            }
      */
    }
  }
}
</script>
```

全部的地图行为请看[API](/api/#events) 页面.

### 特殊方法 `actions.stop()`

方法 `.stop()` 会停止所有的地图动画行为（flyTo,zoomTo....）, 同时采取新的属性 来更新 props，并且返回`.stop()`调用时间的地图当前参数.

### 事件

全部的地图行为请看 [API](/api/#events) 页面.
