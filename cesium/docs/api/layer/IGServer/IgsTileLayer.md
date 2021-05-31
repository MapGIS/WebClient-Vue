# IgsTileLayer

## Props

### `id`

- **类型:** `String`
- **可选**
- **Non-Synced**
- **描述:** 服务基地址
- **示例** `http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市`
- 
### `baseUrl`

- **类型:** `String`
- **可选**
- **Non-Synced**
- **描述:** 服务基地址
- **示例** `http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市`

### `options`  Cesium原生高级参数

1. `tileWidth`
    - **类型:** `Number`
    - **可选**
    - **Non-Synced**
    - **默认值** `256`
    - **描述:** 瓦片宽度

2. `tileHeight`
   - **类型:** `Number`
   - **可选**
   - **Non-Synced**
   - **默认值** `256`
   - **描述:** 瓦片高度

3. `minimumLevel`
   - **类型:** `Number`
   - **可选**
   - **Non-Synced**
   - **默认值** `0`
   - **描述:** 瓦片最小级别,目前ceisum本身的机制不支持设置大于0的值，否则会触发渲染错误
   - ![渲染错误](../../../images/layer/minzoom-error.png)

4. `maximumLevel`
   - **类型:** `Number`
   - **可选**
   - **Non-Synced**
   - **默认值** `20`
   - **描述:** 瓦片最大级别

::: warning
~ 后面请统一使用baseUrl的方式进行组件调用，补充的组件都以baseUrl + 对应的协议的kvp的传参方式实现对应的补充，后面domain、protocol、ip、port的方式会逐步移除
:::


## Example

```vue
<template>
    <mapgis-web-scene
        libPath="cesium/Cesium.js"
        pluginPath="cesium/webclient-cesium-plugin.min.js"
    >
        <mapgis-3d-igs-tile-layer :id="id" :baseUrl="baseUrl" :srs="srs" />
    </mapgis-web-scene>
</template>

<script>
export default {
    data() {
        return {
            id: "IGServer-瓦片图层"
            baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/tile/北京市",
            srs: "EPSG:4326",
        };
    },
};
</script>
```