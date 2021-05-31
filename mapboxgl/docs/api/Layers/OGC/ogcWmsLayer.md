# IgsWmsLayer

## Props

All common [layers props](/zh/api/Layers/README.md#props)

### `baseUrl`

- **类型:** `String`
- **Non-Synced**
- **描述:** KVP 模式的基地址.
- **示例:** "http://develop.smaryun.com:6163/igs/rest/ogc/beijing/WMSServer"

### `url`

- **类型:** `String`
- **Non-Synced**
- **描述:** REST 方式的完整的地图请求路径。

### `layers`

- **类型:** `String`
- **默认值:** `null`
- **Synced**
- **描述:** 指定需要被取图的图层序列号/图层名数组，以“，”分隔。默认为依据文档原始图层状态进行设置。特别注意如果是对接 mapgis 的 wms 服务，这个地方只能是"图层名字,图层名字" 而不是 "图层顺序,图层顺序"。
- **示例:** `1,2`

### `version`

- **类型:** `String`
- **默认值:** `1.0.0`
- **Non-Synced**
- **描述:** wmts 服务版本号。

### `format`

- **类型:** `String`
- **默认值:** `image/png`
- **Non-Synced**
- **描述:** 返回格式

### `token`

- **类型:** `String`
- **Non-Synced**
- **描述:** 瓦片请求的 token

### `height`

- **类型:** `Number`
- **默认值:** `512`
- **Non-Synced**
- **描述:** 瓦片的高度

### `width`

- **类型:** `Number`
- **默认值:** `512`
- **Non-Synced**
- **描述:** 瓦片的宽度

### `reversebbox`

- **类型:** `Boolean`
- **默认值:** `false`
- **Non-Synced**
- **描述:** 这个参数专门针对特定版本的 arcserver，在一些特定的 arcserve 版本其 bbox 的传入方式是[miny, minx, maxy, maxx],而不是[minx, miny, maxx, maxy]
