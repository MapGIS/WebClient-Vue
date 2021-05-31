# Sightline

## Props

### `index`

- **类型:** `Number`
- **默认值:** `0`
- **non-synced**
- **描述:** 图层的索引值，表示第几个图层

### `position`

- **类型:** `String`
- **默认值:** `right`
- **non-synced**
- **描述:** 分析面板的位置（right:右边 | left: 左边）

## Example

```vue
<template>
    <mapgis-web-scene
        libPath="cesium/Cesium.js"
        pluginPath="cesium/webclient-cesium-plugin.min.js"
    >
        <mapgis-3d-raster-layer :url="url" />
        <mapgis-3d-igs-m3d
            :autoReset="autoReset"
            :maximumScreenSpaceError="maximumScreenSpaceError"
            :url="m3dUrl"
        />
        <mapgis-3d-sightline></mapgis-3d-sightline>
    </mapgis-web-scene>
</template>

<script>
export default {
    data() {
        return {
            url:
                "http://t0.tianditu.com/DataServer?T=vec_w&L={z}&Y={y}&X={x}&tk=9c157e9585486c02edf817d2ecbc7752",
            m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
            autoReset: true,
            maximumScreenSpaceError: 8,
        };
    },
};
</script>
```