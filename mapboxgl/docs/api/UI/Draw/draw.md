# Draw

[官方参数](https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md)

## 属性

### `controls`

- **类型:** `Object`
- **非侦听属性**
- **默认**

```javascript
{
  point: false,
  line_string: false,
  polygon: false,
  trash: false,
  combine_features: false,
  uncombine_features: false
}
```

- **描述:** 是否使用默认的 UI

### `styles`

- **类型:** `Array`
- **侦听属性** watch 属性
- **默认值:**

```javascript
[
  {
    id: "gl-draw-polygon-fill-inactive",
    type: "fill",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Polygon"],
      ["!=", "mode", "static"]
    ],
    paint: {
      "fill-color": "#3bb2d0",
      "fill-outline-color": "#3bb2d0",
      "fill-opacity": 0.1
    }
  },
  {
    id: "gl-draw-polygon-fill-active",
    type: "fill",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#fbb03b",
      "fill-outline-color": "#fbb03b",
      "fill-opacity": 0.1
    }
  },
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": 3,
      "circle-color": "#fbb03b"
    }
  },
  {
    id: "gl-draw-polygon-stroke-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Polygon"],
      ["!=", "mode", "static"]
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#3bb2d0",
      "line-width": 2
    }
  },
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#fbb03b",
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  {
    id: "gl-draw-line-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "LineString"],
      ["!=", "mode", "static"]
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#3bb2d0",
      "line-width": 2
    }
  },
  {
    id: "gl-draw-line-active",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#fbb03b",
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  {
    id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"]
    ],
    paint: {
      "circle-radius": 5,
      "circle-color": "#fff"
    }
  },
  {
    id: "gl-draw-polygon-and-line-vertex-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"]
    ],
    paint: {
      "circle-radius": 3,
      "circle-color": "#fbb03b"
    }
  },
  {
    id: "gl-draw-point-point-stroke-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"]
    ],
    paint: {
      "circle-radius": 5,
      "circle-opacity": 1,
      "circle-color": "#fff"
    }
  },
  {
    id: "gl-draw-point-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"]
    ],
    paint: {
      "circle-radius": 3,
      "circle-color": "#3bb2d0"
    }
  },
  {
    id: "gl-draw-point-stroke-active",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "active", "true"],
      ["!=", "meta", "midpoint"]
    ],
    paint: {
      "circle-radius": 7,
      "circle-color": "#fff"
    }
  },
  {
    id: "gl-draw-point-active",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["!=", "meta", "midpoint"],
      ["==", "active", "true"]
    ],
    paint: {
      "circle-radius": 5,
      "circle-color": "#fbb03b"
    }
  },
  {
    id: "gl-draw-polygon-fill-static",
    type: "fill",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#404040",
      "fill-outline-color": "#404040",
      "fill-opacity": 0.1
    }
  },
  {
    id: "gl-draw-polygon-stroke-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#404040",
      "line-width": 2
    }
  },
  {
    id: "gl-draw-line-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#404040",
      "line-width": 2
    }
  },
  {
    id: "gl-draw-point-static",
    type: "circle",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
    paint: {
      "circle-radius": 5,
      "circle-color": "#404040"
    }
  }
];
```

- **描述:** 绘制的几何的样式

### `keybindings`

- **类型:** `Boolean`
- **非侦听属性**
- **默认** true
- **描述:** 是否键位绑定

### `touchEnabled`

- **类型:** `Boolean`
- **非侦听属性**
- **默认** true
- **描述:** 是否触摸激活

### `boxSelect`

- **类型:** `Boolean`
- **非侦听属性**
- **默认** true
- **描述:** 是否支持框选，这个地方指的是按住 shift 键进行框选

### `clickBuffer`

- **类型:** `Number`
- **非侦听属性**
- **默认** 2
- **描述:** 点击的缓冲区范围

### `touchBuffer`

- **类型:** `Number`
- **非侦听属性**
- **默认** 25
- **描述:** 触摸的缓冲区范围

### `displayControlsDefault`

- **类型:** `Boolean`
- **非侦听属性**
- **默认** true
- **描述:** 是否激活默认控件

### `modes`

- **类型:** `Object`
- **非侦听属性**
- **描述:** 当前绘制组件的绘制模式 [官方模式](https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#modes)
- 1. simple_select
- 2. direct_select
- 3. draw_line_string
- 4. draw_polygon
- 5. draw_point
- 6. draw_circle

### `modes`

- **类型:** `String`
- **非侦听属性**
- **默认** simple_select
- **描述:** 当前绘制默认的绘制模式

### `userProperties`

- **类型:** `Boolean`
- **非侦听属性**
- **默认** false
- **描述:** 添加一个 uers\_的前缀在绘制出来的要素上，通常是用来自定义显示或者做数值统计, e.g., ['==', 'user_custom_label', 'Example']

## 槽

### `default`

- **描述:** 自定义测量绘制插槽

## 示例

```vue
<template>
  <div>
    <mapgis-web-map @load="handleMapLoad">
      <mapgis-rastertile-layer :layerId="layerId" :url="url" />
      <mapgis-draw
        v-if="drawOrMeasure"
        position="top-left"
        :styles="styles"
        v-bind:controls="controls"
        v-on:added="handleDrawAdded"
        v-on:drawcreate="handleDrawCreate"
        ref="draw"
      >
        <div id="mapgis-2d-draw-wrapper">
          <a-button-group>
            <a-button v-on:click="togglePoint">画点</a-button>
            <a-button v-on:click="togglePolyline">画线</a-button>
            <a-button v-on:click="togglePolygon">画区</a-button>
            <a-button type="primary" v-on:click="toggleDelete">删除</a-button>
          </a-button-group>
        </div>
      </mapgis-draw>
    </mapgis-web-map>
  </div>
</template>

<script>
export default {
  name: "DrawExample",
  data() {
    return {
      layerId: "igsLayer_layerId",
      url:
        "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: false,
        combine_features: false,
        uncombine_features: false
      },
      styles: [
        {
          id: "gl-draw-polygon-stroke-active",
          type: "line",
          filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
          layout: {
            "line-cap": "round",
            "line-join": "round"
          },
          paint: {
            "line-color": "#FF0000",
            "line-dasharray": [0.2, 2],
            "line-width": 2
          }
        }
      ]
    };
  },
  created() {},
  methods: {
    handleAdded(e) {
      let { drawer } = e;
      this.drawer = drawer;
    },
    enableDrawer() {
      const component = this.$refs.draw;
      if (component) {
        component.enableDrawer();
      }
    },
    handleDrawAdded(e) {
      const { drawer } = e;
      this.drawer = drawer;
    },
    togglePoint(e) {
      this.type = "point";
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_point");
    },
    togglePolyline() {
      this.type = "polyline";
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_line_string");
    },
    togglePolygon() {
      this.type = "polygon";
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_polygon");
    },
    toggleDelete() {
      this.featureArr = "";
      this.queryParameters = "";
      this.drawer && this.drawer.deleteAll();
    },
    handleDrawCreate() {}
  }
};
</script>
```

## 事件

### `@added`

- **属性值:** `drawer` 当前绘制组件对象
- **描述:** 当绘制组件添加后，向父组件传递当前绘制组件对象

### `@removed`

- **描述:** 当移除绘制组件后，通知父组件已移除绘制组件
