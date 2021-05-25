# 矢量瓦片 mapgis-3d-vectortile-layer

## 属性

### `vueKey`

- **Type**: `String`
- **non-synced** 非 watch 属性
- **Default:** `default`
- - **Description:** 该 key 的主要作用市用来记录 Cesium 的 Source,primitive,entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

### `vueIndex`

- **Type**: `[String, Number]`
- **non-synced** 非 watch 属性
- **Default:** `cesium-${("" + Math.random()).split(".")[1]}`
- - **Description:** 该 key 的主要作用市用来记录 Cesium 的 Source,primitive,entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

### `headers`

- **Type**: `Object`
- **Required**
- **non-synced** 非 watch 属性
- **Default:**
  ```js
  {
     'szvsud-license-key': '3AE2IROq5nGn5K/+zQlUxSoHoNdjCoS1l5'
  }
  ```
- - **Description:** 瓦片服务头文件属性
-

* **Type**: `[String, Object]`
* **synced** watch 属性
* - **Description:** 样式 json 文件路径或者 MVT-JSON 对象，当为 url 时等于 styleUrl；当为 vectortilejson 等于 vectortilejson

### `styleUrl`

- **Type**: `String`
- **non-synced** 非 watch 属性
- - **Description:** 样式 json 文件路径,有 styleUrl 就可以直接读取 styleUrl 里的信息;不然就是加载中地发布的矢量瓦片，使用 ip，port 和 layerName 先拼接 styleUrl 路径再进行查询。
- **Example**

```js
<mapgis-web-scene>
  <mapgis-3d-vectortile-layer styleUrl="http://develop.smaryun.com:6163/igs/rest/mrms/vtiles/styles/蓝色-墨卡托.json" />
</mapgis-web-scene>
```

### `vectortilejson`

- **Type**: `Object`
- **synced** watch 属性
- - **Description:** 矢量瓦片 json 对象,直接取 json 对象，不需要再去请求。

### `tilingScheme`

- **Type**: `Cesium.TilingScheme`
- **non-synced** 非 watch 属性
- - **Description:** 矢量瓦片瓦片切分规则：经纬度还是墨卡托

### `token`

- **Type**: `String`
- **non-synced** 非 watch 属性
- - **Description:** 第三方需要的 token，比如 mapbox

### `show`

- **Type**: `Boolean`
- **non-synced** 非 watch 属性
- - **Description:** 是否可见

## 事件

### `@load`

- **Description:** 在矢量瓦片加载完毕后发送该事件
- **Payload** `{ this }`
- - `this` 当前组件自身引用
