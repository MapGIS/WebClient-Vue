# Markers and Popups

## Marker

Marker 组件主要是封装了 [Mapbox GL Marker API](https://docs.mapbox.com/mapbox-js/api/#marker).

```vue
<template>
  <mapgis-web-map
    :accessToken="mapboxAccessToken"
    :mapStyle.sync="mapStyle"
    :center="coordinates"
  >
    <mapgis-marker :coordinates="coordinates" color="blue" />
  </mapgis-web-map>
</template>

<script>
export default {
  data() {
    return {
      mapStyle: "mapbox://styles/mapbox/basic-v10",
      coordinates: [-111.549668, 39.014]
    };
  }
};
</script>
```

### 属性

- `color {String}` 设置默认的颜色 (当使用`marker` slot 时不生效)
- `coordinates {Array}` GeoJSON 格式的 coordinates 部分, 用于标注位置
- `offset {Object, Array}` 相对显示位置的偏移

完整的参数请看 [API](/api/marker.md#props)

### 插槽

Marker 组件有 2 中插槽： `marker` 插槽和用于 Marker 上 popup 的 `默认` 插槽

#### The `marker` slot

marker 插槽 `marker` 可以自定义 marker 的内部 html 样式. 请参考 [IconFont](https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.16&helptype=code) 替代默认的 icon 图形:

```vue
<template>
  <mapgis-web-map
    :accessToken="mapboxAccessToken"
    :mapStyle.sync="mapStyle"
    :center="coordinates"
  >
    <mapgis-marker :coordinates="coordinates">
      <iconfont slot="marker">mdi-map-marker</iconfont>
    </mapgis-marker>
  </mapgis-web-map>
</template>

<script>
export default {
  data() {
    return {
      mapStyle: "mapbox://styles/mapbox/basic-v10",
      coordinates: [-111.549668, 39.014]
    };
  }
};
</script>
```

```vue
<template>
  <div class="iconfont-wrapper">
    <svg v-if="iconId" class="icon" aria-hidden="true" @click="click()">
      <use :xlink:href="iconId" />
    </svg>
    <div class="iconfont-text" v-if="name">{{ name }}</div>
    <div class="iconfont-text-none" v-else />
  </div>
</template>

<script>
import "./iconfont.js";

export default {
  name: "iconfont",
  props: {
    type: {
      type: String,
      default: ""
    },
    name: String
  },
  computed: {
    iconId() {
      return this.type ? `#${this.type}` : "";
    }
  },
  methods: {
    click() {
      this.$emit("click");
    }
  }
};
</script>
<style lang="scss">
.iconfont-wrapper {
  display: inline;

  .icon {
    width: 1.15em;
    height: 1.15em;
    vertical-align: -0.25em;
    line-height: 16px;
    fill: currentColor;
    overflow: hidden;
  }

  .iconfont-text {
    display: inline;
    margin-left: 12px;
    // line-height: 12px;
    font-size: 14px;
  }

  .iconfont-text-none {
    display: none;
    margin-left: 12px;
    // line-height: 12px;
    font-size: 14px;
  }
}
</style>
```

### 默认插槽

默认的插槽允许定制 当点击一个 Marker 后弹出的 Popup 的样式。请看 [Markder&Popups](#MarkersPopups)

## Popup

Popup 组件是对[Mapbox GL Popup API](https://docs.mapbox.com/mapbox-gl-js/api/#popup)的封装.
你可以直接 HTML 或者 Vue 组件设置 popup 的内部的样式.

如下所示 [Element-Card](https://element.eleme.cn/#/zh-CN/component/card) 作为内容:

```vue
<template>
  <mapgis-web-map
    :accessToken="mapboxAccessToken"
    :mapStyle.sync="mapStyle"
    :center="coordinates"
  >
    <mapgis-popup :coordinates="coordinates" anchor="top">
      <el-card class="box-card"> <div>Hello, I'm popup!</div> </el-card>
    </mapgis-popup>
  </mapgis-web-map>
</template>

<script>
export default {
  data() {
    return {
      mapStyle: "mapbox://styles/mapbox/basic-v10",
      coordinates: [-111.549668, 39.014]
    };
  }
};
</script>
```

如果你设置 `onlyText` 属性为 `true`, 内容被统一当做文本处理. 一般用于从一个不信任的数据源获取对应的显示 html 内容，防止注入。

通常 Popup 被添加到地图上是默认隐藏的，如果你想加载的时候立即展示，你需要设置`showed` 属性为 `true`。

### 属性

- `showed {Boolean}` 如果是 `true`, 在组件创建后会立即显示。

- `closeButton {Boolean}` 如果 `true`, 右上角出现关闭按钮。

- `closeOnClick {Boolean}` 如果 `true`, 当点击地图的时候，该 popup 会消失。

- `coordinates {Array}` GeoJSON 格式的 coordinates 参数.如果 popup 用于 markder 内部忽略该参数，使用 marker 的位置。

- `anchor {string}` 指定了 popup 出现的位置是在设置的那个方位。

完整的参数列表请看 [API](/api/popup.md#props)

## MarkersPopups

Popup 通常使用内部的地图注记 Marker. 你可以将 Popup 组件作为子组件内嵌在 Marker 组件中。

```vue
<template>
  <mapgis-web-map
    :accessToken="mapboxAccessToken"
    :mapStyle.sync="mapStyle"
    :center="coordinates"
  >
    <mapgis-marker :coordinates="coordinates">
      <mapgis-popup>
        <el-card>
          <div>Hello, I'm popup!</div>
        </el-card>
      </mapgis-popup>
    </mapgis-marker>
  </mapgis-web-map>
</template>

<script>
export default {
  data() {
    return {
      mapStyle: "mapbox://styles/mapbox/basic-v10",
      coordinates: [-111.549668, 39.014]
    };
  }
};
</script>
```

在该场景下，Popup 会自动的挂载到 Marker 上。你可以使用`togglePopup`方法控制 popup 的可见与不可见。

> 在该场景下, Popup 的 `coordinates`属性会被忽略
