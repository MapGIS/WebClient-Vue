# 源码分析
## 源码结构
整个组件的封装 几乎可以拆分成两部分： 针对mapbox对象的常规基本封装 & 关键事件封装
### 常规基本封装
Vue组件的**三大件:** props、data、watch我认为几乎是按照要封装的mapbox的对象照本画科，几乎都一个模子，再加上地图开发必需要的map对象和整个脚本对象(这两个通过注入inject就可以了)
如下所示:
``` vue
<script>
export default {
    props:{
        // 封装原生mapbox的属性
    },
    data() {
        // 记录是否初识化&封装的mapbox对象
    },
    watch:{
        // 观察原生mapbox的属性
    },
    inject: ["mapbox", "map"],  //
}
</script>
```

## 关键事件机制
由于整个组件是对 marker对象进行封装，有可能自定义插槽的时候渲染HTML元素。
因此，除了处理本身Vue的事件机制以外，还需要处理Map的事件，以及HTML-DOM的事件三种：


1. `_emitEvent` 处理Vue事件，告诉Vue，我这个marker已经在地图里面加载完毕了 等于是说 `我这个封装的vue-marker组件已经生效加载了`， 因此这里发送是的`Vue的事件`
    ``` js
    // 这里的add是自己定义的,可以随便取
    this.$_emitEvent("added", { marker: this.marker });
    ```
1. `_emitMapEvent` 处理地图事件，由于marker在地图里面是可以拖拽的，查看[官方文档](https://docs.mapbox.com/mapbox-gl-js/api/#marker.event:dragstart)也可以发现marker局有三种地图事件dragstart,drag,dragend因此这三种事件需要处理成地图事件。从事件机制本身来说最后都是采取的`vue.emit()`机制，但针对地图事件做了封装，将该组件和map对象作为data的一部分封装。 
    ``` js
    // 这里的name和 marker本身的事件名[dragstart,drag,dragend]建议一致
    this.$emit(name, {
        map: this.map, //传递map对象让开发者按照自己的业务逻辑做事情
        component: this, //传递组件本身，万网用来获取marker自身的属性
        ...data //事件的真正payload
      });
    ```
1. `_emitDOMEvent` 原生DOM事件在代码里面是藏在bindMarkerDOMEvents内部实现的。
    > 核心原理是:marker本身的`html-element`元素不是显式的存在Vue的`<template>`模板中的,而是map对象自己创建的一个内部`html-element`元素。 因此不能直接的向Vue的`<template>`的`html-element`注册事件。而是通过获取`内部html-element元素`主动添加事件的方式实现。
    ``` js
    this.marker._element.addEventListener(key, event => {
        this.$_emitSelfEvent(event);
    });
    ```

## 完整代码
完整代码如下： 

``` vue
<template>
  <div style="display: none">
    <!-- slot for custom marker -->
    <slot name="marker" />
    <!-- slot for popup -->
    <slot v-if="marker" />
  </div>
</template>

<script>
// 这两行 = this.$emit(markerEvents, data)
import withEvents from "../../lib/withEvents";
import withSelfEvents from "./withSelfEvents";

const markerEvents = {
  drag: "drag",
  dragstart: "dragstart",
  dragend: "dragend"
};

const markerDOMEvents = {
  click: "click",
  mouseenter: "mouseenter",
  mouseleave: "mouseleave"
};

export default {
  name: "MapMarker",
  mixins: [withEvents, withSelfEvents],

  provide() {
    const self = this;
    return {
      get marker() {
        return self.marker;
      }
    };
  },

  mounted() {
    const markerOptions = {
      ...this.$props
    };
    if (this.$slots.marker) {
      markerOptions.element = this.$slots.marker[0].elm;
    }
    this.marker = new this.mapbox.Marker(markerOptions);

    if (this.$listeners["update:coordinates"]) {
      this.marker.on("dragend", event => {
        let newCoordinates;
        if (this.coordinates instanceof Array) {
          newCoordinates = [event.target._lngLat.lng, event.target._lngLat.lat];
        } else {
          newCoordinates = event.target._lngLat;
        }
        this.$emit("update:coordinates", newCoordinates);
      });
    }

    const eventNames = Object.keys(markerEvents);
    this.$_bindSelfEvents(eventNames, this.marker);

    this.initial = false;
    this.$_addMarker();
  },

  beforeDestroy() {
    if (this.map !== undefined && this.marker !== undefined) {
      this.marker.remove();
    }
  },

  methods: {
    $_addMarker() {
      this.marker.setLngLat(this.coordinates).addTo(this.map);
      this.$_bindMarkerDOMEvents();
      this.$_emitEvent("added", { marker: this.marker });
    },

    $_emitSelfEvent(event) {
      this.$_emitMapEvent(event, { marker: this.marker });
    },

    $_bindMarkerDOMEvents() {
      Object.keys(this.$listeners).forEach(key => {
        if (Object.values(markerDOMEvents).includes(key)) {
          this.marker._element.addEventListener(key, event => {
            this.$_emitSelfEvent(event);
          });
        }
      });
    },

    remove() {
      this.marker.remove();
      this.$_emitEvent("removed");
    },

    togglePopup() {
      return this.marker.togglePopup();
    }
  }
};
</script>
```