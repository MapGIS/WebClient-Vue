# MapStory

> mapgis-3d-map-story

## 属性

### `dataSource`

- **类型:** `Array`
- **默认值:** ``
- **侦听属性**
- **描述:** 地图故事源数据

### `height`

- **类型:** `Number`
- **默认值:** `[]`
- **侦听属性**
- **描述:** 地图故事面板高度

### `width`

- **类型:** `Array`
- **默认值:** `[]`
- **侦听属性**
- **描述:** 地图故事面板宽度

### `enableOneMap`

- **类型:** `Boolean`
- **默认值:** `false`
- **侦听属性**
- **描述:** 是否为一张图模式，此模式下 UI 有所调整，不用一张图的项目可忽略

## 示例

```vue
<template>
  <mapgis-web-scene style="height:95vh">
    <mapgis-3d-map-story :dataSource="dataSource" />
  </mapgis-web-scene>
</template>
<script>
export default {
  data() {
    return {
      dataSource: []
    };
  }
};
</script>
<style lang="css"></style>
```
