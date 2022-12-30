> mapgis-edit

[官方参数](https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md)

:::tip
编辑组件`mapgis-edit`在地图对象加载完成之后才会生效，详见[Mapbox GL 官方文档](https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md)
:::

## 属性

### `feature`

- **类型:** `Object`
- **侦听属性** watch 属性
- **必传:**
- **描述:** 初始化编辑的图形要素信息，默认是 feature 要素格式。

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
      ["!=", "mode", "static"],
    ],
    paint: {
      "fill-color": "#3bb2d0",
      "fill-outline-color": "#3bb2d0",
      "fill-opacity": 0.1,
    },
  },
  {
    id: "gl-draw-polygon-fill-active",
    type: "fill",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#fbb03b",
      "fill-outline-color": "#fbb03b",
      "fill-opacity": 0.1,
    },
  },
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": 3,
      "circle-color": "#fbb03b",
    },
  },
  {
    id: "gl-draw-polygon-stroke-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Polygon"],
      ["!=", "mode", "static"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#3bb2d0",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#fbb03b",
      "line-dasharray": [0.2, 2],
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-line-inactive",
    type: "line",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "LineString"],
      ["!=", "mode", "static"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#3bb2d0",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-line-active",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#fbb03b",
      "line-dasharray": [0.2, 2],
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "circle-radius": 5,
      "circle-color": "#fff",
    },
  },
  {
    id: "gl-draw-polygon-and-line-vertex-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "meta", "vertex"],
      ["==", "$type", "Point"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "circle-radius": 3,
      "circle-color": "#fbb03b",
    },
  },
  {
    id: "gl-draw-point-point-stroke-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "circle-radius": 5,
      "circle-opacity": 1,
      "circle-color": "#fff",
    },
  },
  {
    id: "gl-draw-point-inactive",
    type: "circle",
    filter: [
      "all",
      ["==", "active", "false"],
      ["==", "$type", "Point"],
      ["==", "meta", "feature"],
      ["!=", "mode", "static"],
    ],
    paint: {
      "circle-radius": 3,
      "circle-color": "#3bb2d0",
    },
  },
  {
    id: "gl-draw-point-stroke-active",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["==", "active", "true"],
      ["!=", "meta", "midpoint"],
    ],
    paint: {
      "circle-radius": 7,
      "circle-color": "#fff",
    },
  },
  {
    id: "gl-draw-point-active",
    type: "circle",
    filter: [
      "all",
      ["==", "$type", "Point"],
      ["!=", "meta", "midpoint"],
      ["==", "active", "true"],
    ],
    paint: {
      "circle-radius": 5,
      "circle-color": "#fbb03b",
    },
  },
  {
    id: "gl-draw-polygon-fill-static",
    type: "fill",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": "#404040",
      "fill-outline-color": "#404040",
      "fill-opacity": 0.1,
    },
  },
  {
    id: "gl-draw-polygon-stroke-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#404040",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-line-static",
    type: "line",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#404040",
      "line-width": 2,
    },
  },
  {
    id: "gl-draw-point-static",
    type: "circle",
    filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
    paint: {
      "circle-radius": 5,
      "circle-color": "#404040",
    },
  },
];
```

- **描述:** 初始化绘制的几何的样式

### `enableControl`

- **类型:** `Boolean`
- **非侦听属性:**
- **默认** false
- **描述** 添加一个自带的能实现基本功能的编辑控件。

### `closeEdit`

- **类型:** `Boolean`
- **非侦听属性:**
- **默认** false
- **描述** 关闭编辑功能，当为 true 时，初始化结束绘制图形后禁止编辑该图形或者拖拽该图形。

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

## 槽

### `default`

## 示例 1

- **描述:** 默认编辑功能和默认内部样式

```vue
<template>
  <mapgis-web-map v-bind="{ ...mapOptions }" style="height:95vh">
    <mapgis-rastertile-layer
      layerId="tdt"
      url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
    />
    <mapgis-draw :enableControl="true" />
    <mapgis-ui-collapse-card
      ref="edit-card"
      :outStyle="editStyle"
      position="bottom-left"
    >
      <span slot="title">要素编辑</span>
      <mapgis-ui-iconfont type="mapgis-edit-square" slot="icon-hiden" />
      <mapgis-ui-iconfont type="mapgis-hide" slot="extra" @click="hideCard" />
      <mapgis-edit
        :enableControl="true"
        :closeEdit="false"
        :feature="feature"
      />
    </mapgis-ui-collapse-card>
  </mapgis-web-map>
</template>

<script>
export default {
  name: "editExample",
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 5,
        center: [107.19, 26.85],
      },
      editStyle: {
        position: "absolute",
        zIndex: 2000,
        width: "290px",
        height: "420px",
        left: "10px",
        bottom: "10px",
      },
      feature: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [104.954372, 28.2192881478019],
              [111.865903828745, 28.2192881478019],
              [111.865903828745, 32.62563],
              [104.954372, 32.62563],
              [104.954372, 28.2192881478019],
            ],
          ],
        },
        properties: {
          ID: 1262,
          JB: 1,
          mpLayer: 0,
          name: "长江",
          mapgis_style: 1,
          mpLength: 51.64045457828864,
        },
      },
    };
  },
  created() {},
  methods: {
    hideCard() {
      this.$refs["edit-card"].hide();
    },
  },
};
</script>
<style></style>
```

## 示例 2

- **描述:** 采取禁用编辑功能和自定义禁用的图形样式

```vue
<template>
  <mapgis-web-map v-bind="{ ...mapOptions }" style="height:95vh">
    <mapgis-rastertile-layer
      layerId="tdt"
      url="http://t0.tianditu.com/DataServer?T=vec_c&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752"
    />
    <mapgis-draw :enableControl="true" :closeEdit="true" />
    <mapgis-ui-collapse-card
      ref="edit-card"
      :outStyle="editStyle"
      position="bottom-left"
    >
      <span slot="title">要素编辑</span>
      <mapgis-ui-iconfont type="mapgis-edit-square" slot="icon-hiden" />
      <mapgis-ui-iconfont type="mapgis-hide" slot="extra" @click="hideCard" />
      <mapgis-edit
        :enableControl="true"
        :closeEdit="true"
        :feature="feature"
        :style="featureStyle"
      />
    </mapgis-ui-collapse-card>
  </mapgis-web-map>
</template>

<script>
export default {
  name: "editExample",
  data() {
    return {
      mapOptions: {
        crs: "EPSG:4326", //经纬度一定要设置crs参数
        maxBounds: [
          [-180, -90],
          [180, 90],
        ],
        zoom: 5,
        center: [107.19, 26.85],
      },
      editStyle: {
        position: "absolute",
        zIndex: 2000,
        width: "290px",
        height: "420px",
        left: "10px",
        bottom: "10px",
      },
      feature: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [104.954372, 28.2192881478019],
              [111.865903828745, 28.2192881478019],
              [111.865903828745, 32.62563],
              [104.954372, 32.62563],
              [104.954372, 28.2192881478019],
            ],
          ],
        },
        properties: {
          ID: 1262,
          JB: 1,
          mpLayer: 0,
          name: "长江",
          mapgis_style: 1,
          mpLength: 51.64045457828864,
        },
      },
      featureStyle: [
        {
          id: "gl-draw-polygon-fill-static",
          type: "fill",
          filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
          paint: {
            "fill-color": "#3bb2d0",
            "fill-outline-color": "#3bb2d0",
            "fill-opacity": 0.1,
          },
        },
        {
          id: "gl-draw-polygon-stroke-static",
          type: "line",
          filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3bb2d0",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-line-static",
          type: "line",
          filter: [
            "all",
            ["==", "mode", "static"],
            ["==", "$type", "LineString"],
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3bb2d0",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-point-static",
          type: "circle",
          filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
          paint: {
            "circle-radius": 5,
            "circle-color": "#3bb2d0",
          },
        },
      ],
    };
  },
  created() {},
  methods: {
    hideCard() {
      this.$refs["edit-card"].hide();
    },
  },
};
</script>
<style></style>
```

## 事件

### `@added`

- **属性值:** `editor` 当前编辑组件对象
- **描述:** 当编辑组件添加后，向父组件传递当前编辑组件对象。

### `@removed`

- **描述:** 当移除编辑组件后，通知父组件已移除编辑组件。

### `@change.feature`

- **描述:** 当编辑组件的要素信息被更改后，向父组件抛出更新后的 feature。

## 编辑标绘说明

在编辑状态下，单击标绘选中当前标绘物，这个时候标绘物的控制点信息将会以 Marker 点的形式绘制到屏幕上。

点击标绘物控制点，标绘物会进入选中状态，图标大小会比原来的大，这个时候可以进行控制点的拖拽以及删除操作，点击`Del`键删除选中点。

同时也支持批量操作控制点，按住`shift`键点击控制点，实现控制点的多选，这个时候可以进行控制点组的拖拽以及删除操作，点击`Del`键删除选中的控制点点组。
