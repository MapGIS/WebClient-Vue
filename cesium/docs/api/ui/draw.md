# 绘制组件 

> mapgis-3d-draw

## 属性

### `infinite`

- **类型:** `Boolean`
- **侦听属性**
- **默认值:** `false`
- **描述:** 是否允许无线绘制。true：允许无线绘制，false：不允许

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件， <br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

## 槽

### `default`

- **Description:** Draw 的自定义槽的实现，可以自定义绘制控件样式

## 事件

### `@load`

- **Description:** 在 Draw 加载完毕后发送该事件
- **Payload** `{ Draw ,webGlobe }`
- `Draw` Draw 对象
- `webGlobe` 当前绘制组件所在的 webGlobe

### `@unload`

- **Description:** 在 Draw 注销完毕后发送该事件
- **Payload** `{ Draw }`
- `Draw` Draw 对象

### `@drawCreate`

- **Description:** 在 Draw 绘制图形完毕后发送该事件
- **Payload** `{ cartoCoordinate ,degreeCoordinate ,webGlobe}`
- `cartoCoordinate` 笛卡尔坐标集合
- `degreeCoordinate` 经纬度坐标集合
- `webGlobe` 当前绘制组件所在的 webGlobe

### `@drawcreate`

- **Description:** 使用 CDN 的方式引入，会使用全小写的方式，在 Draw 绘制图形完毕后发送该事件
- **Payload** `{ cartoCoordinate ,degreeCoordinate ,webGlobe}`
- `cartoCoordinate` 笛卡尔坐标集合
- `degreeCoordinate` 经纬度坐标集合
- `webGlobe` 当前绘制组件所在的 webGlobe

## 示例

### 简单使用

::: demo

```vue
<template>
  <div id="app">
    <mapgis-web-scene>
      <mapgis-3d-draw
        ref="drawref"
        v-on:load="handleDrawLoad"
        v-on:drawcreate="handleCreate"
      >
        <div id="toolbar-wrapper">
          <div class="toolbar-item" v-on:click="togglePoint">画点</div>
          <div class="toolbar-item" v-on:click="togglePolyline">画线</div>
          <div class="toolbar-item" v-on:click="toggleRect">矩形</div>
          <div class="toolbar-item" v-on:click="togglePolygon">多边形</div>
          <div class="toolbar-item" v-on:click="toggleDelete">删除</div>
        </div>
      </mapgis-3d-draw>
    </mapgis-web-scene>
  </div>
</template>

<script>
export default {
  name: "cesiumWmtsLayer",
  data() {
    return {};
  },
  methods: {
    handleDrawLoad(drawer) {
      this.drawer = drawer;
    },
    handleCreate(cartesian3, lnglat) {
      console.log("create", cartesian3, lnglat);
    },
    togglePoint(e) {
      //绘制点
      this.drawer && this.drawer.enableDrawPoint();
    },
    togglePolyline() {
      //绘制线
      this.drawer && this.drawer.enableDrawLine();
    },
    togglePolygon() {
      //绘制多边形
      this.drawer && this.drawer.enableDrawPolygon();
    },
    toggleRect() {
      //绘制矩形
      this.drawer && this.drawer.enableDrawRectangle();
    },
    toggleDelete() {
      //删除绘制
      this.drawer && this.drawer.removeEntities();
    }
  }
};
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
#toolbar-wrapper {
  position: absolute;
  z-index: 9999;
  display: inline-flex;
  overflow-x: hidden;
  overflow-y: visible;
  top: 20px;
  left: 20px;
}
.toolbar-item {
  background: #ffffff;
  border: 1px dashed #666666;
  text-align: center;
  font-size: 20px;
  line-height: 20px;
  height: fit-content;
  padding: 6px 16px;
  cursor: pointer;
}
</style>
```

:::