# 创建插件组件

## 概述
Webclient-Vue-Mapboxgl是针对原始的mapbox-gl脚本的封装。很多额外的高效的插件也是项目开发中常常使用的。因此为了将常用的mapbox-gl的插件也通过Vue的方式使用，下面将介绍如何创建插件组件。

一个插件组件本质上还是通过Vue组件的方式，核心思想是通过获取 根组件`mapbox-map`中的 `mapbox` and `map`对象来进行对应的拓展功能。 

Webclient-Vue-Mapboxgl内部使用独立的VUE注入机制[provide/inject](https://vuejs.org/v2/api/#provide-inject)。

当`mapbox-map`组件创建的时候，必须等到地图初始化加载完毕后，然后才会渲染子组件 同时通过provide的方式提供下面三个组件:

::: tip
1. `mapbox` (Mapbox GL官方脚本), 
1. `map` ([Map实例](https://docs.mapbox.com/mapbox-gl-js/api/#map)) 
1. `actions` ([promisified](/zh/api/#actions) 封装的同步的地图方法).
:::

只要是注入了上面的属性,你就可以添加地图要素或者执行对应的地图方法。 注入方法如下：

``` js
inject: ["mapbox", "map", "actions"],
```

封装插件的核心思想是： 保持Vue本身的声明规范，这样做可以容易封装额外的控制组件和图层组件.同时也容易封装第三方插件，适应不用的业务需求。

> 这里我在 左侧导航栏 `源码分析`-`注记视图` 里面有详细的描述，请认真阅读。

## 基本示例

**App项目代码**

```vue
<template>
  <mapbox-map :accessToken="accessToken" :mapStyle="mapStyle">
    <MyPluginComponent />
  </mapbox-map>
</template>

<script>
import Mapbox from "@mapgis/mapbox-gl";
import { MapboxMap } from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapboxMap
  },
  data() {
    return {
      accessToken: ACCESS_TOKEN,
      mapStyle: MAP_STYLE
    };
  }
};
</script>
```

**自定义插件组件**

```vue
<template>
  <button @click="fly">Fly!</button>
  <div>地图中心是: 经度={{ center.lng }}, 纬度={{ center.lat }}</div>
</template>

<script>
import Mapbox from "@mapgis/mapbox-gl";
// import { MapboxMap } from "@mapgis/webclient-vue-mapboxgl";

export default {
  name: "MyPluginComponent"
  inject: ["mapbox", "map", "actions"],

  data() {
    return {
      center: null
    };
  },

  created() {
    this.center = this.map.getCenter();
  },

  methods: {
    async fly() {
      const flyResult = await this.actions.flyTo({ center: [10, 10] });
      this.center = flyResult.center;
    }
  }
};
</script>
```

## 实验性功能 helpers <Badge text="experimental" type="warn"/>

::: danger Experimental
helpers是一个实验性的功能，类似数据库，我们往往在操作数据库的时候很多情况都是通过一个DBHelper、DBLink的方式去连接数据库，因为常见很多SQL语法完全可以封装起来。 这里提出的helpers就是这个目的。
这个试验特性在后续的版本中会不断的改变，我们会尽可能保证长期的向后兼容。这个特性会一直给个`experimental`的提示。
目前他们只是 把`Webclient-Vue-Mapboxgl`框架中的事件机制暴露出去了。
:::


除了基本的地图对象，helpers还提供了一些很有用的注入，这些特性都会包含在$helpers中。代码如下：

```js
import { $helpers } from "@mapgis/webclient-vue-mapboxgl";

const { withEvents, withSelfEvents, asControl, asLayer } = $helpers;
```

### `withEvents`

[Source](https://github.com/soal/vue-mapbox/blob/master/src/lib/withEvents.js).  
提供了`$_emitEvent` 和 `$_emitMapEvent` 两种方法发送 Vue风格的事件
1. `$_emitEvent` 着重强调发送Vue自身特性的事件可以自定义
1. `$_emitMapEvent` 着重强调发送map自身的事件，一般和地图事件同名

### `withSelfEvents`

[Source](https://github.com/soal/vue-mapbox/blob/master/src/components/UI/withSelfEvents.js)  
 `$_bindSelfEvents`, `$_unbindSelfEvents` and `$_emitSelfEvent`.
上面三者的核心思想其实就是一个，就是把controls, markers and popups绑定的Dom-Html元素添加对应的事件监听并把该事件传递给Vue组件。
> 通俗的说就是 将地图内部的html的事件对外暴露给Vue组件。 也可以理解为将地图对象的内部事件从map映射到Vue组件上。

### `asControl`

[Source](https://github.com/soal/vue-mapbox/blob/master/src/components/UI/controls/controlMixin.js).  
提供地图控制视图的主代码结构, 核心是封装了 map.addControl / removeControl(this.control);

### `asLayer`

[Source](https://github.com/soal/vue-mapbox/blob/master/src/components/layer/layerMixin.js).  
提供地图图层的主代码结构 [layers API](/zh/api/layers)

## 从原生插件创建组件

举例说明如何从一个原生mapbox插件创建Vue组件。

**[VueMaboxGeocoder](https://github.com/soal/vue-mapbox-geocoder) — 包装 [mapbox-gl-geocoder](https://github.com/mapbox/mapbox-gl-geocoder)**:

```js
// 因为该组件没有HTML需要渲染，因此不需要<template>，只用js就可以了。

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { $helpers } from "@mapgis/webclient-vue-mapboxgl"; //获取 $helpers

// 定义mapbox-gl-geocoder事件
const geocoderEvents = {
  clear: "clear",
  loading: "loading",
  results: "results",
  result: "result",
  error: "error"
};

export default {
  name: "GeocoderControl",
  mixins: [$helpers.asControl], // 因为是控制组件，所以需要注入asControl

  inject: ["mapbox", "map"], // 获取根组件传递来的对象

  props: {
    //该插件需要秘钥
    accessToken: {
      type: String,
      required: true
    },
    input: {
      type: String,
      default: null
    },
    proximity: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      initial: true
    };
  },

  // 观察必要的属性
  watch: {
    input: {
      handler(next, prev) {
        if (this.control && next !== prev) {
          this.control.setInput(next);
        }
      },
      immediate: true
    },
    proximity(next, prev) {
      if (this.control && next !== prev) {
        this.control.setProximity(next);
      }
    }
  },

  created() {
    // 特别注意这里的this.control不是使用的 data里面的而是 组件自身的this
    // 核心原因在于 如果使用data或者vuex会使得和Vue自身的响应式机制混乱
    // 因此使用一种非响应式的属性来记录，类似全局变量的形式
    this.control = null; 
    if (this.accessToken && !this.mapbox.accessToken) {
      this.mapbox.accessToken = this.accessToken;
    }
    this.control = new MapboxGeocoder(this.$props); // 创建对象
    this.control.on("results", this.$_updateInput); // 当用户输入的时候，更新同步属性 "input" 

    // 把组件添加到地图上
    this.$_deferredMount();
  },

  beforeDestroy() {
    this.control.off("results", this.$_updateInput);
    // 由于是注入了asControl，因此控制组件会在asControl的hook周期中执行调用 `地图移除该控制组件`
  },

  methods: {
    $_deferredMount() {
      // 由于该控制组件已经是挂载到<mapbox-map>的子树下面，this.map已经初始化完毕并注入该组件中了
      this.map.addControl(this.control);
      if (this.input) {
        // 设置默认输入数据
        this.control.setInput(this.input);
      }
      // 发送添加事件. `$_emitEvent` 方法来自 `asControl` 
      this.$_emitEvent("added", { geocoder: this.control });
      this.$_bindSelfEvents(Object.keys(geocoderEvents)); // 把geocode自身的事件映射成vue的事件
      this.initial = false; // 初始化完毕
    },

    $_bindSelfEvents(events) {
      // asControl 本身是拥有 $_bindSelfEvents 方法的，但是这里的geocoder组件并不是遵循的mapbox-gl.js的事件机制，
      // 因此我们需要覆盖该方法, 按照对应的业务方式实现
      const vm = this;
      // 使用vue的this.$listeners方式来订阅用户指定的事件
      Object.keys(this.$listeners).forEach(eventName => {
        if (events.includes(eventName)) {
          this.control.on(eventName, vm.$_emitControlEvent.bind(vm, eventName));
        }
      });
    },

    // 按照@mapgis/webclient-vue-mapboxgl的规范 发送事件 ，其实就是用{type：eventName}包装事件名
    $_emitControlEvent(eventName, eventData) {
      return this.$_emitSelfEvent({ type: eventName }, eventData);
    },

    $_updateInput(results) {
      if (!this.initial) {
        const input = results.query ? results.query.join("") : "";
        this.$emit("update:input", input); // 更新同步属性 "input"
      }
    }
  }
};
```

::: tip
可能看完上面的源码分析，还是有点晕晕的，这里的核心思想本质上和封装官方原始对象是一摸一样的。
唯一的不同之处在于，官方的原始对象监听的事件都是遵循的mapboxgl.js的事件机制，所以封装官方组件的_bindSelfEvents通常是不需要重新实现的，就走内部封装的￥_emitMapEvent方法。
而第三方的插件对象监听的事件 `不一定` 遵循mapboxgl.js的事件机制，因此需要**重新实现**bindSelfEvents和**封装**emitSelfEvent
:::

**一言以蔽之：**

官方组件事件:
> bindSelfEvents => emitSelfEvent<Badge text="不变" type="info"/> => emitMapEvent<Badge text="不变" type="info"/> 流程

三方插件事件:
> bindSelfEvents<Badge text="新" type="warn"/> => emitControlEvent<Badge text="新" type="warn"/> => emitSelfEvent<Badge text="不变" type="info"/> => emitMapEvent<Badge text="不变" type="info"/>

::: danger
此刻我源代码分析到这里不由得真心感叹一句，这个原始结构设计的真心是 真的**即精通mapboxgl又同时精通vue事件**,很多GitHub的开源代码往往只是vue/mapboxgl中的某一种进行对应的封装，而这份代码确实是两者都精通，设计上确实高山流水,代码信雅达，因此后面的封装组件强烈建议遵循这一套模式!
:::

<!-- ## Component API recommendations -->
