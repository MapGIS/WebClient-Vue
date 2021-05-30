# IgsVectorLayer

## Props

### `url`

- **类型:** `String`
- **可选**
- **Non-Synced**
- **描述:** 服务基地址。【url，domain和（protocol，ip，port）三选一】

```
http://{ip}:{port}/igs/rest/mrms/layers
```

### `domain`

- **类型:** `String`
- **可选**
- **Non-Synced**
- **描述:** 域名。【url，domain和（protocol，ip，port）三选一】

### `protocol`

- **类型:** `String`
- **可选**
- **Non-Synced**
- **默认值** `location.protocol.split(":")[0] || "http"`
- **描述:** 网络协议。【url，domain和（protocol，ip，port）三选一】

### `ip`

- **类型:** `String`
- **可选**
- **Non-Synced**
- **默认值** `localhost`
- **描述:** 地图服务ip。【url，domain和（protocol，ip，port）三选一】

### `port`

- **类型:** `String`
- **可选**
- **Non-Synced**
- **默认值** `6163`
- **描述:** 地图服务端口。【url，domain和（protocol，ip，port）三选一】

### `tileWidth`

- **类型:** `Number`
- **可选**
- **Non-Synced**
- **默认值** `256`
- **描述:** 瓦片宽度

### `tileHeight`

- **类型:** `Number`
- **可选**
- **Non-Synced**
- **默认值** `256`
- **描述:** 瓦片高度

### `minimumLevel`

- **类型:** `Number`
- **可选**
- **Non-Synced**
- **默认值** `0`
- **描述:** 瓦片最小级别

### `maximumLevel`

- **类型:** `Number`
- **可选**
- **Non-Synced**
- **默认值** `20`
- **描述:** 瓦片最大级别

### `gdbps`

- **类型:** `Array | String`
- **必传**
- **Non-Synced**
- **描述:** gdbp地址，允许多个图层

## Example

```vue
<template>
    <mapgis-web-scene
        libPath="cesium/Cesium.js"
        pluginPath="cesium/webclient-cesium-plugin.min.js"
    >
        <mapgis-3d-igs-vector-layer
            :gdbps="gdbps"
            :domain="domain"
        ></mapgis-3d-igs-vector-layer>
    </mapgis-web-scene>
</template>

<script>
export default {
    data() {
        return {
            gdbps: [
                "gdbp://MapGisLocal/OpenLayerVecterMap/sfcls/武汉市",
                "gdbp://MapGisLocal/OpenLayerVecterMap/sfcls/overLayByLayerAnalysisResultLayer2021-04-22-165404",
            ],
            domain: "http://localhost:6163",
        };
    },
};
</script>
```