# 绘制组件 mapgis-3d-draw

## 属性

## 槽

### `default`

- **Description:** Draw 的自定义槽的实现，可以自定义绘制控件样式

### `toolbar`

- **Description:** Draw 的具名插槽，可以自定义绘制控件样式

## 事件

### `@load`

- **Description:** 在 Draw 加载完毕后发送该事件
- **Payload** `{ Draw }`
- `Draw` Draw 对象

### `@unload`

- **Description:** 在 Draw 注销完毕后发送该事件
- **Payload** `{ Draw }`
- `Draw` Draw 对象

### `@drawCreate`

- **Description:** 在 Draw 绘制图形完毕后发送该事件
- **Payload** `{ cartoCoordinate ,degreeCoordinate }`
- `cartoCoordinate` 笛卡尔坐标集合
- `degreeCoordinate` 经纬度坐标集合

### `@drawcreate`

- **Description:** 使用 CDN 的方式引入，会使用全小写的方式，在 Draw 绘制图形完毕后发送该事件
- **Payload** `{ cartoCoordinate ,degreeCoordinate }`
- `cartoCoordinate` 笛卡尔坐标集合
- `degreeCoordinate` 经纬度坐标集合

### 使用方法

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
      this.drawer && this.drawer.enableDrawPoint();
    },
    togglePolyline() {
      this.drawer && this.drawer.enableDrawLine();
    },
    togglePolygon() {
      this.drawer && this.drawer.enableDrawPolygon();
    },
    toggleRect() {
      this.drawer && this.drawer.enableDrawRectangle();
    },
    toggleDelete() {
      this.drawer && this.drawer.removeEntities();
    }
  }
};
</script>

<style scoped>
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
