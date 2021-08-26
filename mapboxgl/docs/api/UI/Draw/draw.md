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
- 3. draw_line_string 画线
- 4. draw_polygon 画多边形
- 5. draw_point 画点
- 6. draw_circle 画圆
- 7. draw_radius 画支持动态改变半径的圆

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

### `enableControl`

- **类型:** `Boolean`
- **非侦听属性:**
- **默认** true
- **描述** 添加一个自带的能实现基本功能的按钮控件，可通过传入的属性position改变其显示的位置

### `editable`

- **类型:** `Boolean`
- **非侦听属性:**
- **默认** true
- **描述** 控制双击结束绘制后图形是否为可编辑状态

## 槽

### `default`

- **描述:** 自定义测量绘制插槽

## 示例

```vue
<template>
  <mapgis-web-map @load="handleMapLoad">
    <mapgis-rastertile-layer :layerId="layerId" :url="url" />
    <mapgis-draw
      position="top-left"
      :styles="styles"
      :controls="controls"
      v-on:added="handleDrawAdded"
      v-on:drawcreate="handleDrawCreate"
      ref="draw"
    >
      <mapgis-ui-button-group class="mapgis-2d-draw-wrapper">
        <mapgis-ui-tooltip
          v-for="(item, i) in draws"
          :key="i"
          placement="bottom"
        >
          <template slot="title">
            <span>{{ item.tip }}</span>
          </template>
          <mapgis-ui-button
            circle
            size="small"
            :type="item.type"
            @click="item.click"
          >
            <mapgis-ui-iconfont :type="item.icon" />
          </mapgis-ui-button>
        </mapgis-ui-tooltip>
      </mapgis-ui-button-group>
    </mapgis-draw>
  </mapgis-web-map>
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
      ],
      drawer: undefined,
      draws: [
        {
          icon: "mapgis-erweidian",
          type: "default",
          tip: "点选几何,按住shift可以框选",
          click: this.toggleSimple
        },
        {
          icon: "mapgis-erweidian",
          type: "primary",
          tip: "画点",
          click: this.togglePoint
        },
        {
          icon: "mapgis-erweixian",
          type: "primary",
          tip: "画线",
          click: this.togglePolyline
        },
        {
          icon: "mapgis-erweiqu",
          type: "primary",
          tip: "画矩形",
          click: this.toggleRect
        },
        {
          icon: "mapgis-erweiqu",
          type: "primary",
          tip: "画多边形",
          click: this.togglePolygon
        },
        {
          icon: "mapgis-yuan1",
          type: "primary",
          tip: "画圆",
          click: this.toggleCircle
        },
        {
          icon: "mapgis-yuanxinbanjingyuan1",
          type: "primary",
          tip: "画半径",
          click: this.toggleRadius
        },
        {
          icon: "mapgis-shanchudangqianziceng",
          type: "primary",
          tip: "删除选中图元",
          click: this.toggleDelete
        },
        {
          icon: "mapgis-shanchudangqianziceng",
          type: "primary",
          tip: "删除全部",
          click: this.toggleDeleteAll
        },
        {
          icon: "mapgis-juxing1",
          type: "default",
          tip: "矩形查询",
          click: this.toggleQueryByRect
        },
        {
          icon: "mapgis-pinghangsibianxing1",
          type: "default",
          tip: "多边形查询",
          click: this.toggleQueryByPolygon
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
    toggleSimple() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("simple_select");
    },
    togglePoint() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_point");
    },
    togglePolyline() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_line_string");
    },
    togglePolygon() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_polygon");
    },
    toggleRect() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_rectangle");
    },
    toggleCircle() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_circle");
    },
    toggleRadius() {
      this.enableDrawer();
      this.drawer && this.drawer.changeMode("draw_radius");
    },
    toggleDelete() {
      this.enableDrawer();
      this.drawer && this.drawer.deleteAll();
    },
    toggleDeleteAll() {
      this.enableDrawer();
      this.drawer && this.drawer.deleteAll();
    },
    toggleQueryByRect() {},
    toggleQueryByPolygon() {},
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

### `@update-radius`

- **描述:** 当绘制组件添加后，可以实时获取绘制图形的面积（平方千米）、半径（千米）和中心坐标